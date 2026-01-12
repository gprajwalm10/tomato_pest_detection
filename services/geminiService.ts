
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { PestDiagnosis, Language } from "../types";

export const diagnosePlant = async (base64Image: string, lang: Language = 'en'): Promise<PestDiagnosis> => {
  // Define available keys in order of priority
  const keys = [
    process.env.API_KEY,
    process.env.API_KEY_2,
    process.env.API_KEY_3
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error("No API keys configured. Please check your settings.");
  }

  // Clean the base64 string
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  let lastError: any = null;

  for (const key of keys) {
    try {
      // Create a new instance with the current key
      const ai = new GoogleGenAI({ apiKey: key });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
            { text: `Diagnose this tomato plant. Return the JSON response with all text fields translated into ${lang}.` }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION(lang),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isHealthy: { type: Type.BOOLEAN },
              name: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              severity: { type: Type.STRING },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              organicSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
              chemicalSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["isHealthy", "name", "scientificName", "confidence", "severity", "symptoms", "immediateActions", "organicSolutions", "chemicalSolutions", "preventionTips"],
          }
        },
      });

      const text = response.text;
      if (!text) throw new Error("The AI provided an empty analysis. Please try a different photo.");

      // If successful, return immediately
      return JSON.parse(text) as PestDiagnosis;

    } catch (error: any) {
      console.warn(`Gemini API failed with key ending in ...${key.slice(-4)}:`, error.message);
      lastError = error;

      // Continue to next key if it's a quote/rate limit or typical API error
      // If it's the last key, the loop will finish and we'll throw
    }
  }

  // If we get here, all keys failed
  console.error("All Gemini API keys failed.");

  if (lastError?.message?.includes("not found") || lastError?.message?.includes("API key")) {
    throw new Error("AI service error. Please check your API keys in the environment file.");
  }

  throw new Error(lastError?.message || "All fallback keys failed. Please ensure the plant is clearly visible or try again later.");
};
