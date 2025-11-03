/**
 * Mock User Data
 */

import type { UserProfile } from "../types";

export const mockUsers: Map<string, UserProfile> = new Map([
  [
    "+554899981001",
    {
      userId: "+554899981001",
      name: "Maria Silva",
      phone: "+554899981001",
      subscription: {
        tier: "free",
        searchesUsedToday: 0,
      },
    },
  ],
  [
    "+554899981002",
    {
      userId: "+554899981002",
      name: "João Santos",
      phone: "+554899981002",
      subscription: {
        tier: "investor",
        searchesUsedToday: 0,
      },
    },
  ],
]);

