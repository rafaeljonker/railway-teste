/**
 * Subscription Service
 * Stub implementation for MVP
 */
import { mockUsers } from "../data/mock-users";
const TIER_LIMITS = {
    free: 5,
    investor: 50,
    corretor: 100,
    agencia: -1, // unlimited
};
export async function hasReachedSearchLimit(userId) {
    const user = mockUsers.get(userId);
    if (!user)
        return false;
    const limit = TIER_LIMITS[user.subscription.tier];
    if (limit === -1)
        return false; // unlimited
    return user.subscription.searchesUsedToday >= limit;
}
export async function trackSearch(userId) {
    const user = mockUsers.get(userId);
    if (user) {
        user.subscription.searchesUsedToday++;
        mockUsers.set(userId, user);
    }
}
export async function getRemainingSearches(userId) {
    const user = mockUsers.get(userId);
    if (!user)
        return 0;
    const limit = TIER_LIMITS[user.subscription.tier];
    if (limit === -1)
        return -1; // unlimited
    return Math.max(0, limit - user.subscription.searchesUsedToday);
}
export async function canUserPerformAction(userId, action) {
    const user = mockUsers.get(userId);
    if (!user)
        return false;
    // Stub: allow all actions for now
    return true;
}
export async function upgradeSubscription(userId, newTier) {
    const user = mockUsers.get(userId);
    if (user) {
        user.subscription.tier = newTier;
        mockUsers.set(userId, user);
        console.log(`✅ Upgraded ${userId} to ${newTier}`);
    }
}
export async function cancelSubscription(userId) {
    const user = mockUsers.get(userId);
    if (user) {
        user.subscription.tier = "free";
        mockUsers.set(userId, user);
    }
}
export async function getSubscriptionLimits(tier) {
    return {
        searchesPerDay: TIER_LIMITS[tier],
        comparablesEnabled: tier !== "free",
        alertsEnabled: tier !== "free",
    };
}
export async function getSubscriptionDisplay(userId) {
    const user = mockUsers.get(userId);
    if (!user)
        return "Plano não encontrado";
    const remaining = await getRemainingSearches(userId);
    return `📊 Plano: ${user.subscription.tier.toUpperCase()}\n💎 Buscas restantes hoje: ${remaining === -1 ? "Ilimitadas" : remaining}`;
}
