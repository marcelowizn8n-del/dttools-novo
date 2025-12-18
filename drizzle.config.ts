import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const rawDatabaseUrl = process.env.DATABASE_URL;
let databaseUrl = rawDatabaseUrl;

try {
  const parsed = new URL(rawDatabaseUrl);
  const host = parsed.hostname;
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  if (!isLocalhost && !parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
    databaseUrl = parsed.toString();
  }
} catch {
  // If DATABASE_URL is not a valid URL, keep it as-is
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
