/**
 * User Profile Service
 * Stub implementation for MVP
 */

import { mockUsers } from "../data/mock-users";
import type { UserProfile } from "../types";

export async function getOrCreateUser(
  userId: string,
  name?: string,
  email?: string
): Promise<UserProfile> {
  let user = mockUsers.get(userId);

  if (!user) {
    user = {
      userId,
      name,
      email,
      phone: userId,
      subscription: {
        tier: "free",
        searchesUsedToday: 0,
      },
    };
    mockUsers.set(userId, user);
    console.log(`✅ Created new user: ${userId}`);
  }

  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return mockUsers.get(userId) || null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const user = await getOrCreateUser(userId);
  Object.assign(user, updates);
  mockUsers.set(userId, user);
  return user;
}

export async function updateUserPreferences(
  userId: string,
  preferences: any
): Promise<UserProfile> {
  const user = await getOrCreateUser(userId);
  user.preferences = { ...user.preferences, ...preferences };
  mockUsers.set(userId, user);
  return user;
}

export async function createUserProfile(
  userId: string,
  name?: string,
  email?: string
): Promise<UserProfile> {
  return getOrCreateUser(userId, name, email);
}

