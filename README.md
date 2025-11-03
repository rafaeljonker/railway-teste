# ConciergeAI - Railway Deployment

WhatsApp AI Chatbot com Baileys, Mastra e OpenAI, otimizado para deploy no Railway.

## Estrutura

```
services/
├── baileys/          # WhatsApp Client (Baileys)
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
└── mastra/           # AI Server (Mastra + OpenAI)
    ├── src/
    ├── Dockerfile
    ├── package.json
    └── tsconfig.json
```

## Deploy no Railway

### 1. Criar Serviços

Crie dois serviços no Railway:
- `baileys` - WhatsApp Client
- `mastra` - AI Server

### 2. Configurar cada serviço

**Para o serviço `baileys`:**
- **Root Directory**: `services/baileys`
- **Builder**: Dockerfile
- **Dockerfile Path**: (vazio)

**Para o serviço `mastra`:**
- **Root Directory**: `services/mastra`
- **Builder**: Dockerfile
- **Dockerfile Path**: (vazio)

### 3. Variáveis de Ambiente

**Baileys:**
```
CONVEX_URL=<sua-url-convex>
CONVEX_WEBHOOK_SECRET=<seu-secret>
AUTH_PATH=/app/baileys_auth
LOG_LEVEL=info
NODE_ENV=production
```

**Mastra:**
```
AI_PROVIDER=openai
OPENAI_API_KEY=<sua-key>
MASTRA_API_SECRET=<seu-secret>
DB_PATH=/app/data
PORT=3001
LOG_LEVEL=info
NODE_ENV=production
```

## Deploy

Conecte o repositório GitHub ao Railway e faça deploy automático de cada serviço.
