import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    // API KEY is assumed to be available in process.env.API_KEY
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateAnimalSummary = async (animalName: string): Promise<string> => {
  try {
    const client = getAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a captivating, 2-sentence summary about the ${animalName} that highlights a unique evolutionary trait or behavior. Keep it accessible but educational.`,
    });
    return response.text || "Information currently unavailable.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Could not load AI summary.";
  }
};

export const chatWithNaturalist = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string,
  animalContext: string
) => {
  try {
    const client = getAIClient();
    const chat = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an expert biologist and nature guide. You are currently discussing the animal: "${animalContext}". Answer the user's questions about this animal accurately, using scientific knowledge but maintaining a sense of wonder. Keep answers concise (under 100 words) unless asked for detail.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const generateFunFact = async (animalName: string): Promise<string> => {
    try {
        const client = getAIClient();
        const response = await client.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Tell me one mind-blowing fun fact about ${animalName}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    fact: { type: Type.STRING }
                }
            }
          }
        });
        
        const jsonText = response.text;
        if (!jsonText) return "";
        const data = JSON.parse(jsonText);
        return data.fact;
      } catch (error) {
        return "";
      }
}