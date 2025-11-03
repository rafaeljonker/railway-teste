/**
 * WhatsApp Domain Types
 */

export interface WhatsAppMessage {
  to: string;
  message: string;
  preview_url?: boolean;
}

export interface WhatsAppWebhook {
  object: string;
  entry: any[];
}

