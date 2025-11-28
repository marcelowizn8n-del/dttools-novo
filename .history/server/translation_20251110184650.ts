import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface TranslationResult {
  en: string;
  es: string;
  fr: string;
}

export async function translateText(
  portugueseText: string,
  context: "title" | "description" | "content" = "content"
): Promise<TranslationResult> {
  if (!portugueseText || portugueseText.trim() === "") {
    return { en: "", es: "", fr: "" };
  }

  const contextInstructions = {
    title: "This is a title/heading. Keep it concise and impactful.",
    description: "This is a brief description or summary. Keep it clear and engaging.",
    content: "This is full content. Maintain formatting, tone, and all details."
  };

  const prompt = `You are a professional translator specializing in Design Thinking and business content.

${contextInstructions[context]}

Translate the following Portuguese text to English, Spanish, and French.
Maintain the exact same tone, style, and formatting.
For Design Thinking terms, use standard industry terminology.

PORTUGUESE TEXT:
${portugueseText}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "en": "English translation here",
  "es": "Spanish translation here",
  "fr": "French translation here"
}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
    
    if (!text) {
      throw new Error("Empty response from AI");
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }
    
    const translations = JSON.parse(jsonMatch[0]);
    
    return {
      en: translations.en || "",
      es: translations.es || "",
      fr: translations.fr || ""
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      en: portugueseText,
      es: portugueseText,
      fr: portugueseText
    };
  }
}

export async function translateArticle(article: {
  title: string;
  description: string;
  content: string;
}) {
  const [titleTranslations, descTranslations, contentTranslations] = await Promise.all([
    translateText(article.title, "title"),
    translateText(article.description, "description"),
    translateText(article.content, "content")
  ]);

  return {
    titleEn: titleTranslations.en,
    titleEs: titleTranslations.es,
    titleFr: titleTranslations.fr,
    descriptionEn: descTranslations.en,
    descriptionEs: descTranslations.es,
    descriptionFr: descTranslations.fr,
    contentEn: contentTranslations.en,
    contentEs: contentTranslations.es,
    contentFr: contentTranslations.fr
  };
}

export async function translateVideo(video: {
  title: string;
  description: string;
}) {
  const [titleTranslations, descTranslations] = await Promise.all([
    translateText(video.title, "title"),
    translateText(video.description, "description")
  ]);

  return {
    titleEn: titleTranslations.en,
    titleEs: titleTranslations.es,
    titleFr: titleTranslations.fr,
    descriptionEn: descTranslations.en,
    descriptionEs: descTranslations.es,
    descriptionFr: descTranslations.fr
  };
}

export async function translateTestimonial(testimonial: {
  testimonialPt: string;
}) {
  const translations = await translateText(testimonial.testimonialPt, "content");

  return {
    testimonialEn: translations.en,
    testimonialEs: translations.es,
    testimonialFr: translations.fr
  };
}
