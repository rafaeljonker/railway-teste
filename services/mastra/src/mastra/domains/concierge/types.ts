/**
 * Concierge Domain Types
 * Types for main orchestration and conversation routing
 */

export interface ConciergeContext {
  userId: string;
  message: string;
  intent?: string;
  webhookPayload?: any;
}

export interface ConciergeResponse {
  success: boolean;
  sentCount: number;
  error?: string;
}

