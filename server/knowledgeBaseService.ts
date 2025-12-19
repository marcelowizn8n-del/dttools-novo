import { google } from "googleapis";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
import { db } from "./db";
import { kbChunks, kbDocuments } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  md5Checksum?: string | null;
  modifiedTime?: string | null;
  webViewLink?: string | null;
  size?: string | null;
};

export type KnowledgeBaseCitation = {
  ref: string;
  title: string;
  url?: string;
  snippet: string;
  chunkId: string;
};

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/\s+/g, " ").trim();
}

function normalizeCitationTitle(input: string): string {
  let title = String(input ?? "").trim();
  if (!title) return title;

  title = title.replace(/\.(pdf)$/i, "");
  title = title.replace(/_+/g, " ");
  title = title.replace(/\s+/g, " ").trim();

  const parts = title
    .split(/\s+--\s+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    title = parts[0];
  }

  if (title.length > 120) {
    title = `${title.slice(0, 117)}...`;
  }

  return title;
}

function chunkText(text: string, opts?: { maxChars?: number; overlapChars?: number }): string[] {
  const maxChars = opts?.maxChars ?? 1500;
  const overlapChars = opts?.overlapChars ?? 200;

  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return [];

  const parts = cleaned.split(/\n\n+/g).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];

  let buffer = "";
  for (const part of parts) {
    const candidate = buffer ? `${buffer}\n\n${part}` : part;
    if (candidate.length <= maxChars) {
      buffer = candidate;
      continue;
    }

    if (buffer) {
      chunks.push(buffer);
      buffer = "";
    }

    if (part.length <= maxChars) {
      buffer = part;
      continue;
    }

    let start = 0;
    while (start < part.length) {
      const end = Math.min(part.length, start + maxChars);
      const slice = part.slice(start, end).trim();
      if (slice) chunks.push(slice);
      if (end >= part.length) break;
      start = Math.max(0, end - overlapChars);
    }
  }

  if (buffer) chunks.push(buffer);

  return chunks;
}

function parseServiceAccount(): any {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
  if (!b64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON_B64 is not set");
  }
  const json = Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json);
}

function toVectorString(values: number[]): string {
  return `[${values.join(",")}]`;
}

export class KnowledgeBaseService {
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  private async getDriveClient() {
    const credentials = parseServiceAccount();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    return google.drive({ version: "v3", auth });
  }

  private async listFolderFiles(folderId: string): Promise<DriveFile[]> {
    const drive = await this.getDriveClient();

    const files: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const resp = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "nextPageToken, files(id,name,mimeType,md5Checksum,modifiedTime,webViewLink,size)",
        pageSize: 1000,
        pageToken,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const batch = (resp.data.files ?? []) as any[];
      for (const f of batch) {
        if (f?.id && f?.name && f?.mimeType) {
          files.push({
            id: String(f.id),
            name: String(f.name),
            mimeType: String(f.mimeType),
            md5Checksum: f.md5Checksum ? String(f.md5Checksum) : null,
            modifiedTime: f.modifiedTime ? String(f.modifiedTime) : null,
            webViewLink: f.webViewLink ? String(f.webViewLink) : null,
            size: f.size ? String(f.size) : null,
          });
        }
      }

      pageToken = resp.data.nextPageToken || undefined;
    } while (pageToken);

    return files;
  }

  private async downloadFile(fileId: string): Promise<Buffer> {
    const drive = await this.getDriveClient();
    const resp = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "arraybuffer" },
    );

    const data = resp.data as ArrayBuffer;
    return Buffer.from(data);
  }

  private async extractPdfText(buffer: Buffer): Promise<string> {
    const result = await pdfParse(buffer);
    return result.text || "";
  }

  private async embedTexts(texts: string[]): Promise<number[][]> {
    if (!texts.length) return [];

    const resp = await this.ai.models.embedContent({
      model: "text-embedding-004",
      contents: texts,
      config: { outputDimensionality: 256 },
    });

    const embeddings = (resp.embeddings ?? []).map((e) => e.values ?? []);
    return embeddings.map((values) => values.map((v) => Number(v)));
  }

  async reindexFromDrive(): Promise<{ scannedCount: number; updatedCount: number; skippedCount: number; errorCount: number; errors: Array<{ fileId: string; message: string }> }> {
    const folderId = process.env.DTTOOLS_LIBRARY_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw new Error("DTTOOLS_LIBRARY_DRIVE_FOLDER_ID is not set");
    }

    const driveFiles = await this.listFolderFiles(folderId);
    const pdfs = driveFiles.filter((f) => f.mimeType === "application/pdf");

    let updatedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ fileId: string; message: string }> = [];

    for (const file of pdfs) {
      try {
        const existing = await db
          .select()
          .from(kbDocuments)
          .where(eq(kbDocuments.driveFileId, file.id))
          .limit(1);

        const existingDoc = existing[0];
        const shouldSkip =
          existingDoc &&
          (existingDoc as any).md5Checksum &&
          String((existingDoc as any).md5Checksum) === String(file.md5Checksum ?? "") &&
          (existingDoc as any).modifiedTime &&
          file.modifiedTime &&
          new Date((existingDoc as any).modifiedTime).toISOString() === new Date(file.modifiedTime).toISOString();

        if (shouldSkip) {
          skippedCount++;
          continue;
        }

        let documentId: string;

        if (existingDoc) {
          documentId = String((existingDoc as any).id);
          await db
            .update(kbDocuments)
            .set({
              title: file.name,
              mimeType: file.mimeType,
              md5Checksum: file.md5Checksum ?? null,
              modifiedTime: file.modifiedTime ? new Date(file.modifiedTime) : null,
              webViewLink: file.webViewLink ?? null,
              sizeBytes: file.size ? Number(file.size) : null,
              updatedAt: new Date(),
            })
            .where(eq(kbDocuments.id, documentId));
        } else {
          const inserted = await db
            .insert(kbDocuments)
            .values({
              driveFileId: file.id,
              title: file.name,
              mimeType: file.mimeType,
              md5Checksum: file.md5Checksum ?? null,
              modifiedTime: file.modifiedTime ? new Date(file.modifiedTime) : null,
              webViewLink: file.webViewLink ?? null,
              sizeBytes: file.size ? Number(file.size) : null,
            })
            .returning({ id: kbDocuments.id });

          documentId = String(inserted[0]?.id);
        }

        await db.delete(kbChunks).where(eq(kbChunks.documentId, documentId));

        const buffer = await this.downloadFile(file.id);
        const text = await this.extractPdfText(buffer);
        const chunks = chunkText(text);

        if (!chunks.length) {
          updatedCount++;
          continue;
        }

        const embeddings = await this.embedTexts(chunks);

        const rows = chunks.map((content, idx) => ({
          documentId,
          chunkIndex: idx,
          content,
          metadata: {},
          embedding: embeddings[idx] ?? [],
        }));

        const invalidEmbedding = rows.find((r) => !Array.isArray(r.embedding) || r.embedding.length !== 256);
        if (invalidEmbedding) {
          throw new Error("Embedding dimensionality mismatch (expected 256)");
        }

        await db.insert(kbChunks).values(rows as any);

        updatedCount++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ fileId: file.id, message });
      }
    }

    return {
      scannedCount: pdfs.length,
      updatedCount,
      skippedCount,
      errorCount: errors.length,
      errors,
    };
  }

  async retrieve(query: string, topK = 6): Promise<{ citations: KnowledgeBaseCitation[] }> {
    const maxDistance = 0.35;
    const minResults = 2;
    const [queryEmbedding] = await this.embedTexts([query]);
    if (!queryEmbedding || queryEmbedding.length !== 256) {
      return { citations: [] };
    }

    const embeddingStr = toVectorString(queryEmbedding);
    const distanceSql = sql<number>`${kbChunks.embedding} <=> ${embeddingStr}::vector(256)`;

    const rows = await db
      .select({
        chunkId: kbChunks.id,
        chunkContent: kbChunks.content,
        docTitle: kbDocuments.title,
        docUrl: kbDocuments.webViewLink,
        distance: distanceSql,
      })
      .from(kbChunks)
      .leftJoin(kbDocuments, eq(kbChunks.documentId, kbDocuments.id))
      .orderBy(distanceSql)
      .limit(topK);

    const filteredRows = rows.filter((r) => {
      const distance = Number((r as any).distance);
      if (!Number.isFinite(distance)) return false;
      if (distance > maxDistance) return false;
      const title = String((r as any).docTitle ?? "").trim();
      const snippet = String((r as any).chunkContent ?? "").trim();
      return !!title && !!snippet;
    });

    if (filteredRows.length < minResults) {
      return { citations: [] };
    }

    const seenDocs = new Set<string>();
    const citations: KnowledgeBaseCitation[] = [];
    for (const r of filteredRows) {
      const rawTitle = String((r as any).docTitle ?? "").trim();
      const urlRaw = (r as any).docUrl;
      const url = urlRaw ? String(urlRaw) : undefined;
      const docKey = `${rawTitle}|${url ?? ""}`;
      if (seenDocs.has(docKey)) continue;
      seenDocs.add(docKey);

      const title = normalizeCitationTitle(rawTitle);

      const content = String((r as any).chunkContent ?? "");
      const snippet = content.length > 350 ? `${content.slice(0, 350)}...` : content;

      citations.push({
        ref: `KB${citations.length + 1}`,
        title,
        url,
        snippet,
        chunkId: String((r as any).chunkId),
      });
    }

    return { citations };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
