/**
 * Subscription Domain Types
 */

export interface UpgradeRequest {
  userId: string;
  newTier: "investor" | "corretor" | "agencia";
  paymentMethod: "pix" | "card";
  billingPeriod: "monthly" | "annual";
}

export interface UpgradeResponse {
  success: boolean;
  transactionId?: string;
  qrCode?: string;
  message: string;
}

