import type {
  AssetMetadataKnownFields,
  AssetTemplateType,
} from '@/types/asset';

export interface CustomField {
  key: string;
  value: string;
}

export interface FormValues extends AssetMetadataKnownFields {
  // Template selection
  template: AssetTemplateType;

  // Asset name
  name: string;
  // Asset symbol
  symbol: string;
  // Number of decimal places for divisibility - 0 to 8 (max)
  decimals: number;

  // Custom fields
  customFields: CustomField[];

  // Mediators and auditors (from account selection)
  selectedMediatorKeys: string[];
  selectedAuditorKeys: string[];
  // Manual inputs
  mediators: string[];
  auditors: string[];
}
