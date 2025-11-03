/**
 * Check Subscription Tool
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getSubscriptionDisplay } from "../services/subscription-service";

export const checkSubscriptionTool = createTool({
  id: "check-subscription-concierge",
  description: "Check user's subscription tier and usage limits",
  inputSchema: z.object({
    userId: z.string().describe("User ID - REQUIRED"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { userId } = context;

      if (!userId) {
        throw new Error("userId é obrigatório");
      }

      const display = await getSubscriptionDisplay(userId);

      return {
        success: true,
        message: display,
      };
    } catch (error) {
      console.error("❌ Error in check-subscription-tool:", error);
      return {
        success: false,
        message: "❌ Erro ao verificar assinatura.",
      };
    }
  },
});

