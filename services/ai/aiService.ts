import { AIProvider } from './types';
import { GeminiProvider } from './providers/geminiProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { OfflineProvider } from './providers/offlineProvider';

const providers: AIProvider[] = [
  new GeminiProvider(),
  new OpenAIProvider(),
  new OfflineProvider(),
];

async function withFallback<T>(operation: (provider: AIProvider) => Promise<T>): Promise<T> {
  let lastError: Error | null = null;

  for (const provider of providers) {
    if (!provider.isAvailable()) continue;

    try {
      return await operation(provider);
    } catch (error) {
      console.warn(`[AI] ${provider.name} failed, trying next provider...`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error('All AI providers failed');
}

export const generateAnimalSummary = async (animalName: string): Promise<string> => {
  return withFallback(provider => provider.generateAnimalSummary(animalName));
};

export const generateFunFact = async (animalName: string): Promise<string> => {
  return withFallback(provider => provider.generateFunFact(animalName));
};

export const chatWithNaturalist = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string,
  animalContext: string
): Promise<string> => {
  return withFallback(provider => provider.chatWithNaturalist(history, message, animalContext));
};

export const getActiveProviderName = (): string => {
  for (const provider of providers) {
    if (provider.isAvailable()) return provider.name;
  }
  return 'Offline';
};
