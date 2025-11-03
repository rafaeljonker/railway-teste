/**
 * Get Property Details Tool
 */
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getPropertyById } from "../services/search-service";
import { formatPropertyDetailsForWhatsApp } from "../utils/whatsapp-formatter";
export const getPropertyDetailsTool = createTool({
    id: "get-property-details-concierge",
    description: "Get detailed information about a specific property by ID",
    inputSchema: z.object({
        userId: z.string().describe("User ID (WhatsApp phone number) - REQUIRED"),
        propertyId: z.string().describe("Property ID (e.g., prop-001)"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        property: z.any().nullable(),
        formattedMessage: z.string(),
    }),
    execute: async ({ context }) => {
        try {
            const { userId, propertyId } = context;
            if (!userId) {
                throw new Error("userId é obrigatório");
            }
            console.log(`🔍 Getting property details for ${propertyId}`);
            const property = await getPropertyById(propertyId);
            if (!property) {
                return {
                    success: false,
                    property: null,
                    formattedMessage: `❌ Imóvel ${propertyId} não encontrado.`,
                };
            }
            return {
                success: true,
                property,
                formattedMessage: formatPropertyDetailsForWhatsApp(property),
            };
        }
        catch (error) {
            console.error("❌ Error in get-property-details-tool:", error);
            return {
                success: false,
                property: null,
                formattedMessage: "❌ Erro ao buscar detalhes do imóvel.",
            };
        }
    },
});
