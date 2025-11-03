/**
 * Update Profile Tool
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { updateUserPreferences } from "../services/user-profile-service";

export const updateProfileTool = createTool({
  id: "update-profile-concierge",
  description: "Update user profile and preferences",
  inputSchema: z.object({
    userId: z.string().describe("User ID - REQUIRED"),
    preferences: z.any().optional().describe("User preferences to update"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { userId, preferences } = context;

      if (!userId) {
        throw new Error("userId é obrigatório");
      }

      await updateUserPreferences(userId, preferences || {});

      return {
        success: true,
        message: "✅ Preferências atualizadas com sucesso!",
      };
    } catch (error) {
      console.error("❌ Error in update-profile-tool:", error);
      return {
        success: false,
        message: "❌ Erro ao atualizar perfil.",
      };
    }
  },
});

