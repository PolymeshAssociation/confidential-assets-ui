/**
 * Asset Validation Utilities
 *
 * Validation functions for asset creation
 */

import { STANDARD_FIELDS, TEMPLATE_FIELDS_MAP } from '@/constants/assetFields';
import type { AssetTemplateType } from '@/types/asset';
import type { ApiPromise } from '@polkadot/api';

interface CustomField {
  key: string;
  value: string;
}

/**
 * Validates custom fields for reserved keys and duplicates
 *
 * @param customFields - Array of custom fields to validate
 * @param template - Current asset template type
 * @returns Record<string, string> - Object containing field errors
 */
export function validateCustomFields(
  customFields: CustomField[],
  template: AssetTemplateType,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const reservedKeys = [
    ...STANDARD_FIELDS,
    ...(TEMPLATE_FIELDS_MAP[template] || []),
  ];

  customFields.forEach((field, index) => {
    if (field.key) {
      // Check if key is reserved
      if ((reservedKeys as readonly string[]).includes(field.key)) {
        errors[`customFields.${index}.key`] =
          'This key is reserved. Please use the template field above.';
      }

      // Check for duplicates within custom fields
      const duplicateIndex = customFields.findIndex(
        (f, i) => i !== index && f.key === field.key,
      );
      if (duplicateIndex !== -1) {
        errors[`customFields.${index}.key`] =
          'Duplicate key. Keys must be unique.';
      }
    }
  });

  return errors;
}

/**
 * Validates encryption keys for format, uniqueness, and on-chain registration
 *
 * @param keys - Array of encryption keys to validate
 * @param allKeys - All keys (manual + selected) for duplicate checking
 * @param fieldPrefix - Field prefix for error messages ('auditors' | 'mediators')
 * @param setFieldError - Function to set field errors
 * @param polkadotApi - Polkadot API instance for on-chain validation
 * @returns Promise<boolean> - true if there are errors, false otherwise
 */
export async function validateEncryptionKeys(
  keys: string[],
  allKeys: string[],
  fieldPrefix: 'auditors' | 'mediators',
  setFieldError: (field: string, error: string) => void,
  polkadotApi?: ApiPromise | null,
): Promise<boolean> {
  let hasErrors = false;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Check for empty or whitespace-only entries
    if (!key || key.trim() === '') {
      setFieldError(
        `${fieldPrefix}.${i}`,
        'Value cannot be empty. Please enter a key or remove this field',
      );
      hasErrors = true;
      continue;
    }

    // Basic format check
    if (!key.match(/^0x[0-9a-fA-F]{64}$/)) {
      setFieldError(
        `${fieldPrefix}.${i}`,
        'Invalid format (must be 0x + 64 hex characters)',
      );
      hasErrors = true;
      continue;
    }

    // Check for duplicates across all keys (manual + multiselect)
    const duplicateCount = allKeys.filter((k) => k === key).length;
    if (duplicateCount > 1) {
      setFieldError(`${fieldPrefix}.${i}`, 'Duplicate key entered');
      hasErrors = true;
      continue;
    }

    // Check if encryption key is registered on-chain (last check, requires API call)
    if (!polkadotApi) continue;

    const didOption =
      await polkadotApi.query.confidentialAssets.encryptionKeyDid(key);

    if (didOption.isNone || didOption.isEmpty) {
      setFieldError(
        `${fieldPrefix}.${i}`,
        'Encryption key not registered on-chain',
      );
      hasErrors = true;
      continue;
    }
  }

  return hasErrors;
}
