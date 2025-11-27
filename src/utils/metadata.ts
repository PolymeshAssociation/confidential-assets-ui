/**
 * Asset Metadata Utilities
 *
 * Handles metadata encoding/decoding for confidential assets
 */

import type { AssetMetadata, AssetTemplateType } from '@/types/asset';

/**
 * Metadata template presets with all 12 templates
 */
export const METADATA_TEMPLATES: Record<
  AssetTemplateType,
  { label: string; description: string; value: string; subTypes: string[] }
> = {
  basic: {
    label: 'Digital Asset / Token',
    description: 'General purpose digital assets and tokens',
    value: 'Digital Asset',
    subTypes: [
      'Utility Token',
      'Governance Token',
      'Loyalty Point',
      'Community Token',
      'Gaming Token',
      'Platform Credit',
      'Metaverse Currency',
      'Reward Token',
      'Other',
    ],
  },
  currency: {
    label: 'Currency',
    description: 'Stablecoins, CBDCs, and payment tokens',
    value: 'Currency',
    subTypes: [
      'Stablecoin',
      'CBDC',
      'Wrapped Currency',
      'Tokenized Cash',
      'Other',
    ],
  },
  equity: {
    label: 'Equity',
    description: 'Common stock, preferred shares, equity tokens',
    value: 'Equity',
    subTypes: [
      'Common Stock',
      'Preferred Stock',
      'Depositary Receipt',
      'Equity Pool Token',
      'Restricted Stock',
      'Other',
    ],
  },
  debt: {
    label: 'Debt',
    description: 'Bonds, notes, and debt instruments',
    value: 'Debt',
    subTypes: [
      'Corporate Bond',
      'Government Bond',
      'Municipal Bond',
      'Treasury Bill',
      'Commercial Paper',
      'Asset-Backed Security',
      'Convertible Bond',
      'Other',
    ],
  },
  fund: {
    label: 'Fund',
    description: 'Investment funds and collective schemes',
    value: 'Fund',
    subTypes: [
      'ETF',
      'Mutual Fund',
      'Index Fund',
      'Hedge Fund',
      'Private Equity Fund',
      'Venture Fund',
      'Money Market Fund',
      'REIT',
      'Other',
    ],
  },
  commodity: {
    label: 'Commodity',
    description: 'Physical commodities or commodity-backed tokens',
    value: 'Commodity',
    subTypes: [
      'Gold',
      'Silver',
      'Platinum',
      'Crude Oil',
      'Natural Gas',
      'Wheat',
      'Corn',
      'Copper',
      'Other',
    ],
  },
  'real-estate': {
    label: 'Real Estate',
    description: 'Tokenized real estate and property investments',
    value: 'Real Estate',
    subTypes: [
      'Fractional Property',
      'REIT Unit',
      'Real Estate Fund',
      'Property Development Token',
      'Other',
    ],
  },
  derivative: {
    label: 'Derivative',
    description: 'Options, futures, swaps, perpetual contracts',
    value: 'Derivative',
    subTypes: [
      'Call Option',
      'Put Option',
      'Futures Contract',
      'Swap',
      'Perpetual Contract',
      'Forward',
      'Other',
    ],
  },
  'structured-product': {
    label: 'Structured Product',
    description: 'Complex structured instruments and notes',
    value: 'Structured Product',
    subTypes: [
      'Reverse Convertible',
      'Autocall',
      'Barrier Note',
      'Principal Protected Note',
      'Yield Enhancement',
      'Other',
    ],
  },
  'credit-entitlement': {
    label: 'Credit/Entitlement',
    description: 'Carbon credits, RECs, loyalty programs',
    value: 'Credit/Entitlement',
    subTypes: [
      'Carbon Offset',
      'Renewable Energy Certificate',
      'Emission Allowance',
      'Loyalty Points',
      'Airline Miles',
      'Service Credits',
      'Other',
    ],
  },
  custom: {
    label: 'Custom',
    description: 'Fully customizable asset definition',
    value: '',
    subTypes: [],
  },
};

/**
 * Encode metadata to JSON string (no abbreviations)
 */
export function encodeMetadata(metadata: AssetMetadata): string {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }

  return JSON.stringify(cleaned);
}

/**
 * Decode metadata from JSON string
 */
export function decodeMetadata(encoded: string): AssetMetadata {
  try {
    const metadata = JSON.parse(encoded) as Record<string, unknown>;
    return metadata as AssetMetadata;
  } catch (error) {
    console.error('Failed to decode metadata:', error);
    throw new Error('Invalid metadata format');
  }
}

/**
 * Validate metadata size (must be under ~8KB)
 */
export function validateMetadataSize(metadata: AssetMetadata): {
  valid: boolean;
  size: number;
  maxSize: number;
} {
  const encoded = encodeMetadata(metadata);
  const size = new Blob([encoded]).size;
  const maxSize = 8191; // ~8KB limit

  return {
    valid: size <= maxSize,
    size,
    maxSize,
  };
}

/**
 * Get template for a specific asset type
 */
export function getTemplate(type: AssetTemplateType) {
  return METADATA_TEMPLATES[type];
}

/**
 * Get all available templates
 */
export function getAllTemplates() {
  return METADATA_TEMPLATES;
}
