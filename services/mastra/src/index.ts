import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import { chatRouter } from './routes/chat';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(
    {
      method: req.method,
      path: req.path,
      ip: req.ip,
    },
    'Incoming request'
  );
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mastra-server',
    timestamp: new Date().toISOString(),
  });
});

// Chat API routes
app.use('/api/chat', chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 Mastra HTTP Server started');
  logger.info(`📡 Health check: http://localhost:${PORT}/health`);
  logger.info(`🤖 Chat endpoint: http://localhost:${PORT}/api/chat`);

  // Log AI provider
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  logger.info(`🧠 AI Provider: ${aiProvider.toUpperCase()}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});
