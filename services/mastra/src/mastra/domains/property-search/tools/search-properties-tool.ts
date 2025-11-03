/**
 * Search Properties Tool
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { searchProperties } from "../services/search-service";
import { formatPropertiesForWhatsApp } from "../utils/whatsapp-formatter";

export const searchPropertiesTool = createTool({
  id: "search-properties-concierge",
  description:
    "Search for luxury real estate properties in Balneário Camboriú based on user criteria",
  inputSchema: z.object({
    userId: z.string().describe("User ID (WhatsApp phone number) - REQUIRED"),
    location: z.string().optional().describe("Location filter (street name or area)"),
    priceMin: z.number().optional().describe("Minimum price in BRL"),
    priceMax: z.number().optional().describe("Maximum price in BRL"),
    bedrooms: z.number().optional().describe("Number of bedrooms"),
    view: z.enum(["ocean", "city"]).optional().describe("View type preference"),
    minFloor: z.number().optional().describe("Minimum floor number"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    totalFound: z.number(),
    properties: z.array(z.any()),
    formattedMessage: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { userId, ...filters } = context;

      if (!userId) {
        throw new Error("userId é obrigatório");
      }

      console.log(`🔍 Searching properties for user ${userId} with filters:`, filters);

      const results = await searchProperties(filters);

      console.log(`✅ Found ${results.length} properties`);

      return {
        success: true,
        totalFound: results.length,
        properties: results.slice(0, 4),
        formattedMessage: formatPropertiesForWhatsApp(results),
      };
    } catch (error) {
      console.error("❌ Error in search-properties-tool:", error);
      return {
        success: false,
        totalFound: 0,
        properties: [],
        formattedMessage: "❌ Erro ao buscar imóveis. Por favor, tente novamente.",
      };
    }
  },
});

