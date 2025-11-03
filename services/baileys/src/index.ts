import 'dotenv/config';
import { proto } from '@whiskeysockets/baileys';
import pino from 'pino';
import { BaileysClient } from './client';
import { sendMessageToConvex } from './convex-client';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

async function main() {
  try {
    logger.info('🚀 Starting Baileys WhatsApp Client...');

    // Validate required env vars
    if (!process.env.CONVEX_URL) {
      throw new Error('CONVEX_URL environment variable is required');
    }

    logger.info(`📡 Convex URL: ${process.env.CONVEX_URL}`);

    // Initialize Baileys client
    const client = new BaileysClient();
    const sock = await client.connect();

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      logger.info(
        { type, messageCount: messages.length },
        '📨 messages.upsert event received'
      );

      // Only process real-time messages
      if (type !== 'notify') {
        logger.debug({ type }, 'Skipping non-notify message type');
        return;
      }

      for (const message of messages) {
        await handleMessage(message, client);
      }
    });

    logger.info('✅ Baileys WhatsApp Client started successfully');
    logger.info('📱 Waiting for QR code scan or existing session...');

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    logger.error({ error }, 'Fatal error starting Baileys client');
    process.exit(1);
  }
}

async function handleMessage(
  message: proto.IWebMessageInfo,
  client: BaileysClient
) {
  try {
    // Skip if no message content
    if (!message.message) return;

    const messageId = message.key.id;
    const from = message.key.remoteJid;
    const isFromMe = message.key.fromMe;
    const timestamp = message.messageTimestamp as number;

    // Skip messages from self
    if (isFromMe) {
      logger.debug({ messageId }, 'Skipping message from self');
      return;
    }

    // Extract text from different message types
    let text = '';
    if (message.message.conversation) {
      text = message.message.conversation;
    } else if (message.message.extendedTextMessage?.text) {
      text = message.message.extendedTextMessage.text;
    } else if (message.message.imageMessage?.caption) {
      text = message.message.imageMessage.caption;
    } else if (message.message.videoMessage?.caption) {
      text = message.message.videoMessage.caption;
    }

    // Skip if no text content
    if (!text) {
      logger.debug({ messageId }, 'Skipping non-text message');
      return;
    }

    if (!from) {
      logger.warn({ messageId }, 'Message has no sender');
      return;
    }

    logger.info(
      {
        messageId,
        from,
        text: text.substring(0, 50),
        timestamp,
      },
      'Processing incoming message'
    );

    // Send to Convex backend
    const convexResponse = await sendMessageToConvex({
      from,
      text,
      messageId: messageId || undefined,
      timestamp,
    });

    // Send AI response back to WhatsApp
    if (convexResponse.response) {
      await client.sendMessage(from, convexResponse.response);
      logger.info({ messageId }, 'Response sent successfully');
    } else if (convexResponse.error) {
      logger.error({ error: convexResponse.error }, 'Convex returned error');
      await client.sendMessage(
        from,
        'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
      );
    }
  } catch (error) {
    logger.error({ error, message }, 'Error processing message');

    // Try to send error message to user
    try {
      const from = message.key.remoteJid;
      if (from) {
        await client.sendMessage(
          from,
          'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
        );
      }
    } catch (sendError) {
      logger.error({ error: sendError }, 'Failed to send error message');
    }
  }
}

// Start the service
main().catch((error) => {
  logger.error({ error }, 'Unhandled error in main');
  process.exit(1);
});
