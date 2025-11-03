/**
 * Analyze Comparables Tool
 */
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { formatComparablesForWhatsApp } from "../services/comparable-service";
export const analyzeComparablesTool = createTool({
    id: "analyze-comparables-concierge",
    description: "Analyze comparable properties for market intelligence (requires investor tier+)",
    inputSchema: z.object({
        userId: z.string().describe("User ID - REQUIRED"),
        propertyId: z.string().describe("Property ID to analyze"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        formattedMessage: z.string(),
    }),
    execute: async ({ context }) => {
        try {
            const { userId, propertyId } = context;
            if (!userId) {
                throw new Error("userId é obrigatório");
            }
            console.log(`📊 Analyzing comparables for ${propertyId} (stub)`);
            return {
                success: true,
                formattedMessage: formatComparablesForWhatsApp({}),
            };
        }
        catch (error) {
            console.error("❌ Error in analyze-comparables-tool:", error);
            return {
                success: false,
                formattedMessage: "❌ Erro ao analisar comparáveis.",
            };
        }
    },
});
