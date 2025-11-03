/**
 * WhatsApp Client Helpers
 * Stub implementation for MVP
 */

export function extractPhoneNumber(webhookPayload: any): string | null {
  try {
    return webhookPayload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || null;
  } catch {
    return null;
  }
}

export function extractMessageText(webhookPayload: any): string | null {
  try {
    return webhookPayload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || null;
  } catch {
    return null;
  }
}

export function hasMessage(webhookPayload: any): boolean {
  return !!(extractPhoneNumber(webhookPayload) && extractMessageText(webhookPayload));
}

export async function sendWhatsAppMessage(params: {
  to: string;
  message: string;
  preview_url?: boolean;
}): Promise<boolean> {
  console.log(`📤 [STUB] Sending WhatsApp message to ${params.to}:`);
  console.log(`   ${params.message.substring(0, 100)}...`);
  
  // Stub: always succeed
  return true;
}

