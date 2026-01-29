import { AIProvider, ChatHistoryEntry } from '../types';

const OFFLINE_FACTS: Record<string, string> = {
  default: 'All living animals belong to one of approximately 35 known phyla, each representing a fundamentally different body plan.',
  mammal: 'Mammals are the only animals that produce milk to feed their young, a trait that evolved over 200 million years ago.',
  bird: 'Birds are the living descendants of dinosaurs, specifically the theropod group, making every sparrow a distant cousin of T. rex.',
  reptile: 'Reptiles were the first vertebrates to evolve amniotic eggs, allowing them to reproduce entirely on land.',
  fish: 'Fish have been swimming in Earth\'s oceans for over 500 million years, making them the oldest vertebrate group.',
  insect: 'Insects make up roughly 80% of all known animal species, with over a million described species and potentially millions more undiscovered.',
  amphibian: 'Amphibians breathe through their skin in addition to their lungs, making them extremely sensitive environmental indicators.',
  arachnid: 'Spiders produce silk that, pound for pound, is stronger than steel and more elastic than nylon.',
  crustacean: 'The mantis shrimp can punch with the force of a .22 caliber bullet, making it one of the strongest strikers in the animal kingdom.',
  mollusk: 'The giant Pacific octopus has three hearts, blue blood, and nine brains — one central brain and one in each arm.',
};

function categorize(animalName: string): string {
  const name = animalName.toLowerCase();
  const categories: [string, string[]][] = [
    ['mammal', ['dog', 'cat', 'whale', 'dolphin', 'bear', 'lion', 'tiger', 'elephant', 'wolf', 'fox', 'deer', 'horse', 'bat', 'monkey', 'ape', 'gorilla', 'panda', 'koala', 'kangaroo', 'hippo', 'rhino', 'seal', 'walrus', 'otter', 'badger', 'weasel', 'mole', 'rat', 'mouse', 'rabbit', 'hare', 'squirrel', 'beaver', 'moose', 'bison', 'buffalo', 'camel', 'llama', 'alpaca', 'sloth', 'armadillo']],
    ['bird', ['eagle', 'hawk', 'owl', 'parrot', 'penguin', 'flamingo', 'robin', 'sparrow', 'hummingbird', 'peacock', 'toucan', 'swan', 'duck', 'goose', 'falcon', 'crow', 'raven', 'pigeon', 'dove', 'stork', 'pelican', 'albatross', 'woodpecker', 'kingfisher']],
    ['reptile', ['snake', 'lizard', 'turtle', 'tortoise', 'crocodile', 'alligator', 'gecko', 'iguana', 'chameleon', 'cobra', 'python', 'monitor']],
    ['fish', ['fish', 'salmon', 'tuna', 'shark', 'ray', 'seahorse', 'goldfish', 'barracuda', 'piranha', 'eel', 'catfish', 'swordfish', 'flounder']],
    ['insect', ['butterfly', 'bee', 'ant', 'beetle', 'dragonfly', 'moth', 'grasshopper', 'ladybug', 'mosquito', 'fly', 'wasp', 'termite', 'mantis', 'cricket', 'firefly', 'cockroach']],
    ['amphibian', ['frog', 'toad', 'salamander', 'newt', 'axolotl']],
    ['arachnid', ['spider', 'scorpion', 'tarantula', 'tick']],
    ['crustacean', ['crab', 'lobster', 'shrimp', 'crawfish', 'barnacle', 'krill']],
    ['mollusk', ['octopus', 'squid', 'snail', 'slug', 'clam', 'oyster', 'mussel', 'nautilus']],
  ];

  for (const [category, keywords] of categories) {
    if (keywords.some(kw => name.includes(kw))) {
      return category;
    }
  }
  return 'default';
}

export class OfflineProvider implements AIProvider {
  readonly name = 'Offline';

  isAvailable(): boolean {
    return true;
  }

  async generateAnimalSummary(animalName: string): Promise<string> {
    return `The ${animalName} is a fascinating creature found in various ecosystems around the world. Configure a GEMINI_API_KEY or OPENAI_API_KEY for detailed AI-generated insights.`;
  }

  async generateFunFact(animalName: string): Promise<string> {
    return OFFLINE_FACTS[categorize(animalName)] || OFFLINE_FACTS.default;
  }

  async chatWithNaturalist(
    _history: ChatHistoryEntry[],
    message: string,
    animalContext: string
  ): Promise<string> {
    return `[OFFLINE MODE] AI chat is unavailable. You asked about "${animalContext}": "${message}". To enable AI-powered responses, add a GEMINI_API_KEY or OPENAI_API_KEY to your environment configuration.`;
  }
}
