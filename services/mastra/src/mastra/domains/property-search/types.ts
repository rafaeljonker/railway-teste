/**
 * Property Search Domain Types
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePerSqm: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parkingSpots: number;
  totalArea: number;
  floor: number;
  view?: "ocean" | "city";
  furnished: boolean;
  amenities: string[];
}

export interface SearchFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  view?: "ocean" | "city";
  minFloor?: number;
}

export interface SearchResult {
  success: boolean;
  totalFound: number;
  properties: Property[];
  formattedMessage: string;
}

