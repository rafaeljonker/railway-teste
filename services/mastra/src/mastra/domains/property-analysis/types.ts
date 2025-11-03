/**
 * Property Analysis Domain Types
 */

export interface ComparableAnalysis {
  success: boolean;
  propertyId: string;
  comparables: any[];
  averagePrice: number;
  estimatedValue: number;
  formattedMessage: string;
}

