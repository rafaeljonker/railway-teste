/**
 * User Management Domain Types
 */

export type SubscriptionTier = "free" | "investor" | "corretor" | "agencia";

export interface UserProfile {
  userId: string;
  name?: string;
  email?: string;
  phone: string;
  subscription: {
    tier: SubscriptionTier;
    searchesUsedToday: number;
  };
  preferences?: {
    favoriteLocations?: string[];
    priceRange?: { min: number; max: number };
    viewPreference?: "ocean" | "city";
  };
}

