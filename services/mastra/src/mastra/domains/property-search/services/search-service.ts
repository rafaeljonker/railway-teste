/**
 * Property Search Service
 * Stub implementation for MVP
 */

import { mockProperties } from "../data/mock-properties";
import type { Property, SearchFilters } from "../types";

export async function searchProperties(
  filters: SearchFilters
): Promise<Property[]> {
  // Simple filtering based on provided criteria
  let results = [...mockProperties];

  if (filters.priceMin !== undefined) {
    results = results.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    results = results.filter((p) => p.price <= filters.priceMax!);
  }

  if (filters.bedrooms !== undefined) {
    results = results.filter((p) => p.bedrooms === filters.bedrooms);
  }

  if (filters.view) {
    results = results.filter((p) => p.view === filters.view);
  }

  if (filters.minFloor !== undefined) {
    results = results.filter((p) => p.floor >= filters.minFloor!);
  }

  if (filters.location) {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  return results;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return mockProperties.find((p) => p.id === id) || null;
}

