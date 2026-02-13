import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLovePoem = async (partnerName: string = "My Love"): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Write a short, sweet, and romantic Valentine's Day poem for my partner. 
    Make it rhyming, heartfelt, and about 4-6 lines long. 
    Ending with a sentiment about being my Valentine.
    Tone: Romantic, slightly playful.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Roses are red, violets are blue, I'm just happy I have you!";
  } catch (error) {
    console.error("Error generating poem:", error);
    return "Roses are red, violets are blue, technology failed, but I still love you! (AI unavailable)";
  }
};