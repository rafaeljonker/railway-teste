# Concierge Domain - Agent Guide

## Overview

The **Concierge domain** is the main orchestrator for the ConciergeAI platform. It handles WhatsApp conversations, routes to appropriate tools/domains, and manages the complete user journey.

**Key Features:**
- ✅ Main conversational agent
- ✅ WhatsApp message orchestration
- ✅ Multi-tool routing (search, user management, etc.)
- ✅ Working memory for context
- ✅ Natural conversation flow

## Domain Structure

```
concierge/
├── AGENTS.md
├── agent.ts                      # Main concierge agent
├── workflow.ts                   # Main orchestration workflow
├── index.ts                      # Barrel exports
└── types.ts                      # Domain types
```

## Main Workflow

```
WhatsApp Message → conciergeMainWorkflow →
  1. Extract phone & message
  2. Get/create user profile
  3. Process through conciergeAgent
  4. Break into WhatsApp messages
  5. Send back to user
```

## Agent Capabilities

The concierge agent has access to tools from multiple domains:
- **Property Search**: `searchProperties`, `getPropertyDetails`
- **User Management**: `checkSubscription`, `updateProfile`
- **Property Analysis**: `analyzeComparables`
- **Subscription**: `viewPlans`, `upgradeSubscription`

## Critical Patterns

### userId Propagation

```typescript
// ALWAYS pass userId in runtime context
const response = await agent.generate([{ role: "user", content: message }], {
  runtimeContext: new Map([["userId", userId]]),
});
```

### Working Memory

The agent maintains context about:
- User preferences
- Recent searches
- Subscription status
- Conversation history

### Message Formatting

Long responses are automatically broken into 3-8 short messages for WhatsApp readability.

## Running the Agent

### Development Mode

```bash
# Install dependencies
pnpm install

# Start Mastra playground
pnpm run dev
```

Visit `http://localhost:4111` to access the Mastra playground.

### Testing the Agent

You can test the agent interactively in the playground or programmatically:

```typescript
import { mastra } from "./mastra";

const agent = mastra.getAgent("conciergeAgent");

const response = await agent.generateLegacy([
  { role: "user", content: "Olá! Quero um apartamento com vista mar" }
], {
  runtimeContext: new Map([["userId", "+5548999999999"]])
});

console.log(response.text);
```

---

**Status**: ✅ Implemented (MVP)
**Last Updated**: January 2025

