import express from 'express';
import pino from 'pino';
import { mastra } from '../mastra';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export const chatRouter = express.Router();

// API Key for authentication
const MASTRA_API_SECRET = process.env.MASTRA_API_SECRET;

// Middleware: API Key validation
chatRouter.use((req, res, next) => {
  if (!MASTRA_API_SECRET) {
    logger.warn('⚠️ MASTRA_API_SECRET not set! API is unprotected!');
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== MASTRA_API_SECRET) {
    logger.warn('❌ Unauthorized API access attempt', {
      hasApiKey: !!apiKey,
      ip: req.ip,
      path: req.path,
    });

    return res.status(401).json({
      error: 'Unauthorized - Invalid or missing API key',
    });
  }

  next();
});

interface ChatRequest {
  userId: string;
  message: string;
  messageId?: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

/**
 * POST /api/chat
 * Process user message with Mastra AI agent and return response
 */
chatRouter.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { userId, message, messageId }: ChatRequest = req.body;

    // Validate input
    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required fields: userId, message',
      });
    }

    logger.info(
      {
        userId,
        messageId,
        message: message.substring(0, 50),
      },
      'Processing chat message with Mastra'
    );

    // Get the concierge agent
    const agent = mastra.getAgent('conciergeAgent');

    // Generate response using Mastra agent with conversation memory
    // Using generateLegacy() for AI SDK v1 models (OpenAI v1.x, Anthropic v1.x)
    const response = await agent.generateLegacy(
      [{ role: 'user', content: message }],
      {
        resourceId: userId,
        threadId: userId, // Use userId as threadId for conversation continuity
      }
    );

    const responseText =
      response.text || 'Desculpe, não consegui processar sua mensagem.';

    logger.info(
      {
        userId,
        messageId,
        responseLength: responseText.length,
      },
      'Mastra response generated'
    );

    const chatResponse: ChatResponse = {
      response: responseText,
    };

    res.json(chatResponse);
  } catch (error: any) {
    logger.error({ error }, 'Failed to process chat message');

    const errorResponse: ChatResponse = {
      response: '',
      error: error.message || 'Failed to process message',
    };

    res.status(500).json(errorResponse);
  }
});
