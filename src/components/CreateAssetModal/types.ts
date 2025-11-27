import type { AssetMetadataKnownFields, AssetTemplateType } from '@/types/asset';

export interface CustomField {
  key: string;
  value: string;
}

export interface FormValues extends AssetMetadataKnownFields {
  // Template selection
  template: AssetTemplateType;

  // Override decimals to be required (it is optional in AssetMetadataKnownFields)
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
