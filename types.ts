export interface Animal {
  id: string; // Unique ID (often from iNaturalist or GBIF)
  commonName: string;
  scientificName: string;
  imageUrl?: string;
  family?: string;
  order?: string;
  source: 'PRE_CACHED' | 'INATURALIST' | 'GBIF';
}

export interface AnimalDetail extends Animal {
  description?: string;
  habitat?: string;
  conservationStatus?: string;
  gbifKey?: number;
  eolId?: number;
  inaturalistId?: number;
  taxonomy: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
  imageGallery: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum FilterType {
  ALL = 'ALL',
  MAMMAL = 'MAMMAL',
  BIRD = 'BIRD',
  REPTILE = 'REPTILE',
  AMPHIBIAN = 'AMPHIBIAN',
  FISH = 'FISH',
  SHARK_RAY = 'SHARK_RAY',
  INSECT = 'INSECT',
  ARACHNID = 'ARACHNID',
  CRUSTACEAN = 'CRUSTACEAN',
  MOLLUSK = 'MOLLUSK',
  CNIDARIAN = 'CNIDARIAN',
  PRIMATE = 'PRIMATE',
  CARNIVORE = 'CARNIVORE',
  CETACEAN = 'CETACEAN',
  RODENT = 'RODENT',
  BEETLE = 'BEETLE',
  BUTTERFLY = 'BUTTERFLY',
  BEE_ANT = 'BEE_ANT',
}

export const TAXON_IDS: Record<FilterType, number | null> = {
  [FilterType.ALL]: null,
  [FilterType.MAMMAL]: 40151,
  [FilterType.BIRD]: 3,
  [FilterType.REPTILE]: 26036,
  [FilterType.AMPHIBIAN]: 20978,
  [FilterType.FISH]: 47178, // Actinopterygii (Ray-finned fishes)
  [FilterType.SHARK_RAY]: 47273, // Chondrichthyes
  [FilterType.INSECT]: 47158,
  [FilterType.ARACHNID]: 47119,
  [FilterType.CRUSTACEAN]: 47129,
  [FilterType.MOLLUSK]: 47115,
  [FilterType.CNIDARIAN]: 47532, // Cnidaria (Jellyfish, Corals)
  [FilterType.PRIMATE]: 43329,
  [FilterType.CARNIVORE]: 41936,
  [FilterType.CETACEAN]: 152871, // Infraorder Cetacea (Whales, Dolphins)
  [FilterType.RODENT]: 43698,
  [FilterType.BEETLE]: 47208, // Coleoptera
  [FilterType.BUTTERFLY]: 47157, // Lepidoptera
  [FilterType.BEE_ANT]: 47201, // Hymenoptera
};