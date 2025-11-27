/**
 * useAccountKeyValidation Hook
 *
 * Shared validation logic for account public keys across settlement modals.
 * Validates hex format and fetches encryption keys from chain.
 */

import type { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';

interface UseAccountKeyValidationReturn {
  accountKey: string;
  setAccountKey: (key: string) => void;
  encryptionKey: string;
  isValidating: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Hook for validating account public keys and fetching encryption keys
 *
 * @param polkadotApi - Polkadot API instance
 * @returns Account validation state and setters
 */
export function useAccountKeyValidation(
  polkadotApi: ApiPromise | null,
): UseAccountKeyValidationReturn {
  const [accountKey, setAccountKey] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  // Validate account key and fetch encryption key from chain
  useEffect(() => {
    const validateAndFetchKey = async () => {
      const trimmedKey = accountKey.trim();

      // Clear previous state
      setEncryptionKey('');
      setError('');

      // Only validate if we have exactly 64 hex characters (32 bytes)
      const cleanKey = trimmedKey.startsWith('0x')
        ? trimmedKey.slice(2)
        : trimmedKey;

      if (cleanKey.length === 0) {
        // Empty is valid (not required yet)
        return;
      }

      if (cleanKey.length !== 64) {
        setError('Account key must be exactly 64 hex characters');
        return;
      }

      // Validate hex format
      if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
        setError('Invalid hex format');
        return;
      }

      setIsValidating(true);

      try {
        if (!polkadotApi) {
          setError('API not connected');
          return;
        }

        // Query the encryption key from chain
        const accountKeyWithPrefix = trimmedKey.startsWith('0x')
          ? trimmedKey
          : `0x${trimmedKey}`;

        const encryptionKeyOption =
          await polkadotApi.query.confidentialAssets.accountEncryptionKey(
            accountKeyWithPrefix,
          );

        if (encryptionKeyOption.isNone || encryptionKeyOption.isEmpty) {
          setError('Account is not registered on-chain');
          return;
        }

        // Extract encryption key
        const fetchedEncryptionKey = encryptionKeyOption.unwrap();
        setEncryptionKey(fetchedEncryptionKey.toHex());
      } catch (err) {
        console.error('[useAccountKeyValidation] Validation error:', err);
        setError('Failed to validate account');
      } finally {
        setIsValidating(false);
      }
    };

    validateAndFetchKey();
  }, [accountKey, polkadotApi]);

  const clearError = () => setError('');

  return {
    accountKey,
    setAccountKey,
    encryptionKey,
    isValidating,
    error,
    clearError,
  };
}
