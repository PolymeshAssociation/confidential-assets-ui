/**
 * Local Storage Key Management Service
 *
 * Manages DART confidential key storage in browser localStorage.
 * Uses account public key as the unique identifier.
 */

import type { AnyConfidentialKeyRecord } from '@/types/storage';

const STORAGE_PREFIX = 'polymesh_confidential_key_';

/**
 * Save DART key to localStorage
 */
export const saveKey = (keyRecord: AnyConfidentialKeyRecord): void => {
  const storageKey = `${STORAGE_PREFIX}${keyRecord.public.account}`;

  try {
    localStorage.setItem(storageKey, JSON.stringify(keyRecord));
  } catch (error) {
    console.error('Failed to save key to localStorage:', error);
    throw new Error('Failed to save confidential key. Storage may be full.');
  }
};

/**
 * Update an existing key in localStorage
 * Used for password changes or metadata updates
 */
export const updateKey = (keyRecord: AnyConfidentialKeyRecord): void => {
  const storageKey = `${STORAGE_PREFIX}${keyRecord.public.account}`;

  if (!localStorage.getItem(storageKey)) {
    throw new Error('Key not found for update');
  }

  saveKey(keyRecord);
};

/**
 * Get a key from localStorage by account public key
 */
export const getKey = (
  accountPublicKey: string,
): AnyConfidentialKeyRecord | null => {
  const storageKey = `${STORAGE_PREFIX}${accountPublicKey}`;

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as AnyConfidentialKeyRecord;
  } catch (error) {
    console.error('Failed to retrieve key from localStorage:', error);
    return null;
  }
};

/**
 * Get a key from localStorage by name
 */
export const getKeyByName = (name: string): AnyConfidentialKeyRecord | null => {
  const keys = listKeys();
  return keys.find((k) => k.name === name) || null;
};

/**
 * Delete a key from localStorage by account public key
 */
export const deleteKey = (accountPublicKey: string): boolean => {
  const storageKey = `${STORAGE_PREFIX}${accountPublicKey}`;

  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Failed to delete key from localStorage:', error);
    return false;
  }
};

/**
 * Get all stored keys by iterating through localStorage
 */
/**
 * Get all stored keys by iterating through localStorage
 */
export const listKeys = (): AnyConfidentialKeyRecord[] => {
  const keys: AnyConfidentialKeyRecord[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const record = JSON.parse(stored) as AnyConfidentialKeyRecord;
          keys.push(record);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list keys from localStorage:', error);
  }

  return keys;
};

/**
 * Update the name of an existing key
 */
export const updateName = (
  accountPublicKey: string,
  newName: string,
): boolean => {
  const key = getKey(accountPublicKey);
  if (!key) {
    return false;
  }

  // Check if new name already exists
  if (getKeyByName(newName)) {
    throw new Error(`Key with name "${newName}" already exists`);
  }

  try {
    // Update the record
    key.name = newName;
    saveKey(key);

    return true;
  } catch (error) {
    console.error('Failed to update key name:', error);
    return false;
  }
};

/**
 * Check if a key with the given name exists
 */
export const keyExists = (name: string): boolean => {
  return getKeyByName(name) !== null;
};

/**
 * Check if a key with the given public key exists
 */
export const keyExistsByPublicKey = (accountPublicKey: string): boolean => {
  return getKey(accountPublicKey) !== null;
};

/**
 * Clear all confidential keys from storage (use with caution!)
 */
export const clearAllKeys = (): void => {
  const keysToRemove: string[] = [];

  // Collect all keys with our prefix
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  // Remove them
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
