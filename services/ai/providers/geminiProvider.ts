import { GoogleGenAI, Type } from '@google/genai';
import { AIProvider, ChatHistoryEntry } from '../types';

export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini';
  private client: GoogleGenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0 && this.apiKey !== 'PLACEHOLDER_API_KEY';
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
    return this.client;
  }

  async generateAnimalSummary(animalName: string): Promise<string> {
    const client = this.getClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a captivating, 2-sentence summary about the ${animalName} that highlights a unique evolutionary trait or behavior. Keep it accessible but educational.`,
    });
    return response.text || 'Information currently unavailable.';
  }

  async generateFunFact(animalName: string): Promise<string> {
    const client = this.getClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tell me one mind-blowing fun fact about ${animalName}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING },
          },
        },
      },
    });
    const jsonText = response.text;
    if (!jsonText) return '';
    return JSON.parse(jsonText).fact;
  }

  async chatWithNaturalist(
    history: ChatHistoryEntry[],
    message: string,
    animalContext: string
  ): Promise<string> {
    const client = this.getClient();
    const chat = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an expert biologist and nature guide. You are currently discussing the animal: "${animalContext}". Answer the user's questions about this animal accurately, using scientific knowledge but maintaining a sense of wonder. Keep answers concise (under 100 words) unless asked for detail.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });
    const response = await chat.sendMessage({ message });
    return response.text || 'No response received.';
  }
}
