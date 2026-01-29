export interface ChatHistoryEntry {
  role: 'user' | 'model';
  text: string;
}

export interface AIProvider {
  readonly name: string;
  isAvailable(): boolean;
  generateAnimalSummary(animalName: string): Promise<string>;
  generateFunFact(animalName: string): Promise<string>;
  chatWithNaturalist(history: ChatHistoryEntry[], message: string, animalContext: string): Promise<string>;
}
