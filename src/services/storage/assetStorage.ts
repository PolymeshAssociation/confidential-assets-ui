/**
 * Asset Storage Service
 *
 * Manages account asset states in localStorage
 */

import type { AccountAssetStateRecord } from '@/types/asset';

const STATE_PREFIX = 'polymesh_account_asset_state_';

// ============================================================================
// Account Asset State Storage
// ============================================================================

/**
 * Generate storage key for account asset state
 */
const getStateStorageKey = (
  accountPublicKey: string,
  assetId: string,
): string => {
  return `${STATE_PREFIX}${accountPublicKey}_${assetId}`;
};

/**
 * Save account asset state
 */
export const saveAccountAssetState = (state: AccountAssetStateRecord): void => {
  const storageKey = getStateStorageKey(state.accountPublicKey, state.assetId);

  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save account asset state:', error);
    throw new Error('Failed to save account asset state. Storage may be full.');
  }
};

/**
 * Get account asset state
 */
export const getAccountAssetState = (
  accountPublicKey: string,
  assetId: string,
): AccountAssetStateRecord | null => {
  const storageKey = getStateStorageKey(accountPublicKey, assetId);

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as AccountAssetStateRecord;
  } catch (error) {
    console.error('Failed to retrieve account asset state:', error);
    return null;
  }
};

/**
 * Delete account asset state
 */
export const deleteAccountAssetState = (
  accountPublicKey: string,
  assetId: string,
): boolean => {
  const storageKey = getStateStorageKey(accountPublicKey, assetId);

  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Failed to delete account asset state:', error);
    return false;
  }
};

/**
 * List all account asset states for a specific account
 */
export const listAccountAssetStates = (
  accountPublicKey: string,
): AccountAssetStateRecord[] => {
  const states: AccountAssetStateRecord[] = [];
  const prefix = `${STATE_PREFIX}${accountPublicKey}_`;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const state = JSON.parse(stored) as AccountAssetStateRecord;
          states.push(state);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list account asset states:', error);
  }

  return states;
};

/**
 * Update leaf index for an account asset state
 */
export const updateAccountAssetStateLeafIndex = (
  accountPublicKey: string,
  assetId: string,
  leafIndex: bigint,
): boolean => {
  const state = getAccountAssetState(accountPublicKey, assetId);
  if (!state) {
    return false;
  }

  state.leafIndex = leafIndex.toString();
  state.updatedAt = Date.now();

  try {
    saveAccountAssetState(state);
    return true;
  } catch (error) {
    console.error('Failed to update leaf index:', error);
    return false;
  }
};

/**
 * Clear all account asset states (use with caution!)
 */
export const clearAllAccountAssetStates = (): void => {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
