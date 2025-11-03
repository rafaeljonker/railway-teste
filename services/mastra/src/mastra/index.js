/**
 * Mastra Configuration
 * ConciergeAI Platform
 */
import { Mastra } from "@mastra/core";
// Import concierge agent and workflow
import { conciergeAgent, conciergeMainWorkflow } from "./domains/concierge";
export const mastra = new Mastra({
    agents: {
        conciergeAgent,
    },
    workflows: {
        conciergeMainWorkflow,
    },
});
