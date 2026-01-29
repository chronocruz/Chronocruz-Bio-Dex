import { Animal, AnimalDetail, FilterType, TAXON_IDS } from '../types';

const INAT_API_BASE = 'https://api.inaturalist.org/v1';
// const GBIF_API_BASE = 'https://api.gbif.org/v1'; // Used implicitly via specific endpoints if needed

// Helper to standardise iNaturalist results into our Animal type
const mapInatToAnimal = (result: any): Animal => {
  return {
    id: String(result.id),
    commonName: result.preferred_common_name || result.name,
    scientificName: result.name,
    imageUrl: result.default_photo?.medium_url || result.default_photo?.url,
    family: result.ancestors?.find((a: any) => a.rank === 'family')?.name,
    order: result.ancestors?.find((a: any) => a.rank === 'order')?.name,
    source: 'INATURALIST',
  };
};

/**
 * Searches iNaturalist for species.
 * This effectively acts as our "Search" and "Filter" backend.
 */
export const searchSpecies = async (query: string, filterType: FilterType = FilterType.ALL): Promise<Animal[]> => {
  try {
    const taxonId = TAXON_IDS[filterType];
    let url = `${INAT_API_BASE}/taxa?q=${encodeURIComponent(query)}&per_page=20&is_active=true`;
    
    // 1 is the taxon ID for "Animalia" in iNaturalist to ensure we only get animals
    url += `&taxon_id=${taxonId || 1}`; 
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from iNaturalist');
    
    const data = await response.json();
    return data.results.map(mapInatToAnimal);
  } catch (error) {
    console.error("Error searching species:", error);
    return [];
  }
};

/**
 * Fetches specific details for a species using iNaturalist ID.
 * It also attempts to cross-reference GBIF for checking if needed, but iNat usually has richer media.
 */
export const getSpeciesDetails = async (id: string): Promise<AnimalDetail | null> => {
  try {
    const response = await fetch(`${INAT_API_BASE}/taxa/${id}`);
    if (!response.ok) throw new Error('Failed to fetch details');
    
    const data = await response.json();
    const result = data.results[0];

    if (!result) return null;

    // Extract images
    const photos = result.taxon_photos?.map((tp: any) => tp.photo.medium_url) || [];

    // Extract taxonomy
    const taxonomy = {
      kingdom: 'Animalia',
      phylum: result.ancestors?.find((a: any) => a.rank === 'phylum')?.name,
      class: result.ancestors?.find((a: any) => a.rank === 'class')?.name,
      order: result.ancestors?.find((a: any) => a.rank === 'order')?.name,
      family: result.ancestors?.find((a: any) => a.rank === 'family')?.name,
      genus: result.ancestors?.find((a: any) => a.rank === 'genus')?.name,
    };

    return {
      id: String(result.id),
      commonName: result.preferred_common_name || result.name,
      scientificName: result.name,
      imageUrl: result.default_photo?.medium_url,
      source: 'INATURALIST',
      description: result.wikipedia_summary, // iNaturalist often includes a summary
      habitat: 'Varied', // Hard to get structured habitat data from free APIs without complex text mining
      conservationStatus: result.conservation_status?.status_name || 'Not Evaluated',
      inaturalistId: result.id,
      gbifKey: undefined, // Would need a separate GBIF lookup match
      taxonomy,
      imageGallery: photos
    };
  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
};

/**
 * Used to hydrate the "Pre-cached" list.
 * Since the pre-cached list only has names, we perform a quick lookup to get their images.
 */
export const fetchPreviewForList = async (names: string[]): Promise<Animal[]> => {
    // We will fire multiple requests in parallel.
    // Increased limit to 50 to accommodate larger alphabetical categories (like S) without cutting off.
    const limitedNames = names.slice(0, 50); 
    
    const promises = limitedNames.map(async (name) => {
        const results = await searchSpecies(name);
        const match = results[0];
        if (match) {
            // Force the commonName to match the requested list name.
            // iNaturalist might return "Tubenoses" for "Albatross", or "Bovids" for "Antelope".
            // To maintain the strict alphabetical sorting of our list, we overwrite the display name
            // with the one from our constant list.
            return { ...match, commonName: name };
        }
        return null;
    });

    const results = await Promise.all(promises);
    return results.filter((r): r is Animal => r !== null);
}