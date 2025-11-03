/**
 * User Management Domain
 * Barrel exports for user profile and subscription management
 */

// Tools
export { checkSubscriptionTool } from "./tools/check-subscription-tool";
export { updateProfileTool } from "./tools/update-profile-tool";

// Services
export {
  createUserProfile,
  getOrCreateUser,
  getUserProfile,
  updateUserPreferences,
  updateUserProfile,
} from "./services/user-profile-service";

export {
  canUserPerformAction,
  cancelSubscription,
  getRemainingSearches,
  getSubscriptionDisplay,
  getSubscriptionLimits,
  hasReachedSearchLimit,
  trackSearch,
  upgradeSubscription,
} from "./services/subscription-service";

// Types
export type * from "./types";

