import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAdvisorResponse = async (prompt: string, context: "management" | "marketing" | "hybrid") => {
  const systemInstructions = {
    management: "You are an expert agricultural project manager. Provide practical, step-by-step advice on farm operations, resource allocation, and seasonal planning.",
    marketing: "You are a specialist in agricultural commodities and marketing. Advise farmers on how to brand their produce, find buyers, understand market trends, and maximize profit.",
    hybrid: "You are an agronomist specializing in crop breeding. Help farmers understand the potential of hybridizing different varieties, focusing on yield, disease resistance, and climate adaptation."
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstructions[context],
    },
  });

  return response.text;
};

export const analyzeDiagnosticImage = async (base64Image: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image.split(',')[1],
          },
        },
        {
          text: "Analyze this image of a crop or livestock. Identify any visible signs of disease, pests, or nutritional deficiencies. Provide a diagnosis and recommended immediate actions for the farmer.",
        },
      ],
    },
  });

  return response.text;
};
