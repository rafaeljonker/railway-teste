/**
 * User Profile Service
 * Stub implementation for MVP
 */
import { mockUsers } from "../data/mock-users";
export async function getOrCreateUser(userId, name, email) {
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
export async function getUserProfile(userId) {
    return mockUsers.get(userId) || null;
}
export async function updateUserProfile(userId, updates) {
    const user = await getOrCreateUser(userId);
    Object.assign(user, updates);
    mockUsers.set(userId, user);
    return user;
}
export async function updateUserPreferences(userId, preferences) {
    const user = await getOrCreateUser(userId);
    user.preferences = { ...user.preferences, ...preferences };
    mockUsers.set(userId, user);
    return user;
}
export async function createUserProfile(userId, name, email) {
    return getOrCreateUser(userId, name, email);
}
