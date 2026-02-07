
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, ConfessionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getSuggestions = async (prompt: string, type: ConfessionType): Promise<GeminiResponse> => {
  try {
    const systemPrompt = type === 'music' 
      ? `Suggest 3 real songs. For each, provide title, artist, and one iconic romantic lyric.`
      : `Suggest 3 real books. For each, provide title, author, and one beautiful, short quote about love/longing.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: "${prompt}". ${systemPrompt} Return only as a valid JSON object with a "suggestions" array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  sub: { type: Type.STRING },
                  lines: { type: Type.STRING }
                },
                required: ["title", "sub", "lines"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { suggestions: [] };
  }
};

export const refineConfession = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refine this confession into a poetic, sincere 2-3 sentence note: "${message}"`,
    });
    return response.text?.trim() || message;
  } catch (error) {
    return message;
  }
};
