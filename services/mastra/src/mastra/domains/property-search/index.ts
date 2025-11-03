/**
 * Property Search Domain
 * Barrel exports for property search functionality
 */

// Tools
export { getPropertyDetailsTool } from "./tools/get-property-details-tool";
export { searchPropertiesTool } from "./tools/search-properties-tool";

// Services
export { getPropertyById, searchProperties } from "./services/search-service";

// Utilities
export {
  formatPropertiesForWhatsApp,
  formatPropertyDetailsForWhatsApp,
} from "./utils/whatsapp-formatter";

// Types
export type * from "./types";

