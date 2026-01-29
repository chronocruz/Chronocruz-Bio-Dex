import { AIProvider, ChatHistoryEntry } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0;
  }

  private async callChat(messages: Array<{ role: string; content: string }>): Promise<string> {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  async generateAnimalSummary(animalName: string): Promise<string> {
    return this.callChat([
      {
        role: 'system',
        content: 'You are a concise biology expert. Respond with exactly 2 sentences.',
      },
      {
        role: 'user',
        content: `Provide a captivating, 2-sentence summary about the ${animalName} that highlights a unique evolutionary trait or behavior. Keep it accessible but educational.`,
      },
    ]);
  }

  async generateFunFact(animalName: string): Promise<string> {
    const raw = await this.callChat([
      {
        role: 'system',
        content: 'You are a biology expert. Respond with ONLY a JSON object in this exact format: {"fact": "your fun fact here"}',
      },
      {
        role: 'user',
        content: `Tell me one mind-blowing fun fact about ${animalName}.`,
      },
    ]);

    try {
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned).fact;
    } catch {
      return raw;
    }
  }

  async chatWithNaturalist(
    history: ChatHistoryEntry[],
    message: string,
    animalContext: string
  ): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: `You are an expert biologist and nature guide. You are currently discussing the animal: "${animalContext}". Answer the user's questions about this animal accurately, using scientific knowledge but maintaining a sense of wonder. Keep answers concise (under 100 words) unless asked for detail.`,
      },
      ...history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.text,
      })),
      { role: 'user', content: message },
    ];

    return this.callChat(messages);
  }
}
