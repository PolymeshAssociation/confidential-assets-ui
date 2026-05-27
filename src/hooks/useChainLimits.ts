import {
  MAX_AUDITORS,
  MAX_ENCRYPTION_KEYS,
  MAX_MEDIATORS,
} from '@/constants/assetFields';
import { useMemo } from 'react';
import { usePolymesh } from './usePolymesh';

export interface ChainLimits {
  maxAuditors: number;
  maxMediators: number;
  maxEncryptionKeys: number;
}

const FALLBACK_LIMITS: ChainLimits = {
  maxAuditors: MAX_AUDITORS,
  maxMediators: MAX_MEDIATORS,
  maxEncryptionKeys: MAX_ENCRYPTION_KEYS,
};

/**
 * Returns the confidential asset limits read from chain constants.
 * Falls back to compile-time defaults when the API is not connected.
 *
 * Chain constants used:
 *  - confidentialAssets.maxAssetAuditors
 *  - confidentialAssets.maxAssetMediators
 *  - confidentialAssets.maxAssetEncryptionKeys  (combined auditors + mediators)
 */
export function useChainLimits(): ChainLimits {
  const { polkadotApi } = usePolymesh();

  return useMemo(() => {
    const consts = polkadotApi?.consts.confidentialAssets;
    if (!consts) return FALLBACK_LIMITS;

    try {
      return {
        maxAuditors: consts.maxAssetAuditors.toNumber(),
        maxMediators: consts.maxAssetMediators.toNumber(),
        maxEncryptionKeys: consts.maxAssetEncryptionKeys.toNumber(),
      };
    } catch {
      return FALLBACK_LIMITS;
    }
  }, [polkadotApi]);
}
