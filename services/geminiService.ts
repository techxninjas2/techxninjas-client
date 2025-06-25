
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT_GENERATION } from "../constants";

// IMPORTANT: The API key MUST be set in the environment variables as process.env.API_KEY.
// This client-side code assumes process.env.API_KEY is made available to the browser 
// environment through a build process or server-side injection.
// Directly embedding API keys in client-side code is insecure for production.
// For this exercise, we follow the prompt's instruction to use process.env.API_KEY.

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // This error will be caught by the calling function.
      // It's crucial for the user to understand this requirement.
      console.error("Gemini API key (process.env.API_KEY) is not configured.");
      throw new Error("API_KEY_NOT_CONFIGURED: Gemini API key is missing. Please ensure process.env.API_KEY is set.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateTechFact = async (): Promise<string> => {
  try {
    const client = getAiClient();
    const model = GEMINI_MODEL_TEXT_GENERATION;
    
    const prompt = "Tell me an interesting, concise, and kid-friendly fun fact about technology or computers. Make it sound exciting!";

    const response: GenerateContentResponse = await client.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      // No thinkingConfig needed for this simple request, defaults are fine.
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content received from Gemini API.");
    }
    return text.trim();

  } catch (error: any) {
    console.error("Error generating tech fact from Gemini:", error);
    if (error.message && error.message.includes("API_KEY_NOT_CONFIGURED")) {
        throw error; // Re-throw specific error for UI handling
    }
    // General error message for other API or network issues
    throw new Error(`Failed to communicate with Gemini API: ${error.message || 'Unknown error'}`);
  }
};
