import { google } from "@ai-sdk/google";

/**
 * Creates a Google Gemini model instance for blog generation.
 * Uses GOOGLE_GENERATIVE_AI_API_KEY from environment.
 */
export function getGeminiModel(modelId = "gemini-2.0-flash") {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  return google(modelId);
}
