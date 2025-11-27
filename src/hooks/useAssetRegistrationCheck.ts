/**
 * useAssetRegistrationCheck Hook
 *
 * Checks if an account is registered for a specific confidential asset.
 */

import type { ApiPromise } from '@polkadot/api';
import { useCallback, useEffect, useState } from 'react';

interface UseAssetRegistrationCheckReturn {
  isRegistered: boolean;
  isChecking: boolean;
  checkRegistration: () => Promise<void>;
}

/**
 * Hook for checking asset registration status
 *
 * @param polkadotApi - Polkadot API instance
 * @param accountKey - Account public key (with or without 0x prefix)
 * @param assetId - Asset ID to check registration for
 * @returns Registration status and checking state
 */
export function useAssetRegistrationCheck(
  polkadotApi: ApiPromise | null,
  accountKey: string,
  assetId: string,
): UseAssetRegistrationCheckReturn {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkRegistration = useCallback(async () => {
    // Reset state
    setIsRegistered(false);

    // Only check if we have all required inputs
    if (!accountKey || !assetId || !polkadotApi) {
      return;
    }

    // Validate asset ID is numeric
    if (!/^\d+$/.test(assetId)) {
      return;
    }

    setIsChecking(true);

    try {
      const accountKeyWithPrefix = accountKey.startsWith('0x')
        ? accountKey
        : `0x${accountKey}`;

      // Query if account is registered for this asset
      const registrationStatus =
        await polkadotApi.query.confidentialAssets.accountAssetRegistrations(
          accountKeyWithPrefix,
          parseInt(assetId, 10),
        );

      setIsRegistered(registrationStatus.isTrue);
    } catch (err) {
      console.error(
        '[useAssetRegistrationCheck] Failed to check registration:',
        err,
      );
      setIsRegistered(false);
    } finally {
      setIsChecking(false);
    }
  }, [accountKey, assetId, polkadotApi]);

  // Auto-check when inputs change
  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  return {
    isRegistered,
    isChecking,
    checkRegistration,
  };
}
