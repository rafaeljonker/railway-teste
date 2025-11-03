import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const CONVEX_URL = process.env.CONVEX_URL;
const CONVEX_WEBHOOK_SECRET = process.env.CONVEX_WEBHOOK_SECRET;

if (!CONVEX_URL) {
  throw new Error('CONVEX_URL environment variable is required');
}

if (!CONVEX_WEBHOOK_SECRET) {
  logger.warn('⚠️ CONVEX_WEBHOOK_SECRET not set. Requests may be rejected by Convex.');
}

export interface MessagePayload {
  from: string;
  text: string;
  messageId?: string;
  timestamp: number;
}

export interface ConvexResponse {
  response: string;
  error?: string;
}

/**
 * Send message to Convex backend
 * Convex will call Mastra server and return AI response
 */
export async function sendMessageToConvex(
  payload: MessagePayload
): Promise<ConvexResponse> {
  try {
    logger.debug({ payload }, 'Sending message to Convex');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if configured
    if (CONVEX_WEBHOOK_SECRET) {
      headers['X-API-Key'] = CONVEX_WEBHOOK_SECRET;
    }

    const response = await fetch(`${CONVEX_URL}/webhook`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Convex returned ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as ConvexResponse;

    logger.info(
      { responseLength: data.response?.length },
      'Received response from Convex'
    );

    return data;
  } catch (error) {
    logger.error({ error }, 'Failed to send message to Convex');
    throw error;
  }
}
