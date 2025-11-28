/**
 * Validation utilities for confidential key storage
 */

import type { AnyConfidentialKeyRecord } from '@/types/storage';

/**
 * Type guard to validate if data matches the expected key record format
 * Performs comprehensive validation of all required fields and structure
 */
export function isValidKeyRecord(
  data: unknown,
): data is AnyConfidentialKeyRecord {
  if (!data || typeof data !== 'object') return false;

  const record = data as Partial<AnyConfidentialKeyRecord>;

  // Check required top-level fields
  if (
    !record.version ||
    !record.name ||
    !record.public ||
    !record.private ||
    !record.metadata
  ) {
    return false;
  }

  // Validate version
  if (record.version !== 1 && record.version !== 2) {
    return false;
  }

  // Validate public keys
  if (
    typeof record.public.account !== 'string' ||
    typeof record.public.encryption !== 'string' ||
    !record.public.account.startsWith('0x') ||
    !record.public.encryption.startsWith('0x')
  ) {
    return false;
  }

  // Validate private key structure
  if (
    record.private.format !== 'scale-base64' ||
    typeof record.private.data !== 'string'
  ) {
    return false;
  }

  // Validate encryption type
  if (
    record.private.encryption !== 'none' &&
    record.private.encryption !== 'scrypt-xsalsa20-poly1305'
  ) {
    return false;
  }

  // For encrypted keys, validate additional fields
  if (record.private.encryption === 'scrypt-xsalsa20-poly1305') {
    const encPrivate = record.private as {
      encryption: 'scrypt-xsalsa20-poly1305';
      kdf?: { function?: string };
      cipher?: { algorithm?: string };
    };
    if (
      !encPrivate.kdf ||
      !encPrivate.cipher ||
      encPrivate.kdf.function !== 'scrypt' ||
      encPrivate.cipher.algorithm !== 'xsalsa20-poly1305'
    ) {
      return false;
    }
  }

  // Validate metadata
  if (typeof record.metadata.created !== 'number') {
    return false;
  }

  return true;
}
