/**
 * Settlement Storage Service
 *
 * Manages settlement records in localStorage
 * Stores minimal data (settlement ID, role, created date)
 * Additional details should be queried from chain
 */

import type { SettlementRecord } from '@/types/settlement';

const SETTLEMENT_PREFIX = 'polymesh_settlement_';

// ============================================================================
// Settlement Record Storage
// ============================================================================

/**
 * Generate storage key for settlement record
 * Format: polymesh_settlement_{settlementId}_{accountPublicKey}
 */
const getSettlementStorageKey = (
  settlementId: string,
  accountPublicKey: string,
): string => {
  return `${SETTLEMENT_PREFIX}${accountPublicKey}_${settlementId}_`;
};

/**
 * Save settlement record
 */
export const saveSettlement = (record: SettlementRecord): void => {
  const storageKey = getSettlementStorageKey(
    record.settlementId,
    record.accountPublicKey,
  );

  try {
    localStorage.setItem(storageKey, JSON.stringify(record));
  } catch (error) {
    console.error('Failed to save settlement record:', error);
    throw new Error('Failed to save settlement record. Storage may be full.');
  }
};

/**
 * Get settlement record
 */
export const getSettlement = (
  settlementId: string,
  accountPublicKey: string,
): SettlementRecord | null => {
  const storageKey = getSettlementStorageKey(settlementId, accountPublicKey);

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as SettlementRecord;
  } catch (error) {
    console.error('Failed to retrieve settlement record:', error);
    return null;
  }
};

/**
 * Delete settlement record
 */
export const deleteSettlement = (
  settlementId: string,
  accountPublicKey: string,
): boolean => {
  const storageKey = getSettlementStorageKey(settlementId, accountPublicKey);

  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Failed to delete settlement record:', error);
    return false;
  }
};

/**
 * List all settlement records for a specific account
 * Returns sorted by createdAt (newest first)
 */
export const listSettlementsByAccount = (
  accountPublicKey: string,
): SettlementRecord[] => {
  const settlements: SettlementRecord[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key?.startsWith(`${SETTLEMENT_PREFIX}${accountPublicKey}_`) &&
        key.includes(accountPublicKey)
      ) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const settlement = JSON.parse(stored) as SettlementRecord;
          settlements.push(settlement);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list settlement records:', error);
  }

  // Sort by createdAt descending (newest first)
  return settlements.sort((a, b) => b.createdAt - a.createdAt);
};

/**
 * Update settlement record
 */
export const updateSettlement = (record: SettlementRecord): boolean => {
  try {
    saveSettlement(record);
    return true;
  } catch (error) {
    console.error('Failed to update settlement record:', error);
    return false;
  }
};

/**
 * Clear all settlement records (use with caution!)
 */
export const clearAllSettlements = (): void => {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(SETTLEMENT_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
