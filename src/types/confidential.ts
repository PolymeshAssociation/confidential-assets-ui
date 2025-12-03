/**
 * Polymesh Confidential Asset Type Definitions
 *
 * Types for managing Polymesh confidential account keys using WASM.
 */

import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';

/**
 * Stored Confidential keys structure
 */
export interface StoredConfidentialKeys {
  /** 64-character hexadecimal seed used to generate the AccountKeys */
  seed: string;
  /** Version of the storage format for future compatibility */
  version: number;
}

/**
 * Public keys for display (both hex and JSON formats)
 */
export interface ConfidentialAccountPublicKeys {
  accountPublicKey: {
    /** 0x-prefixed hex representation */
    hex: string;
    /** JSON string from .toJson() */
    json: string;
  };
  encryptionPublicKey: {
    /** 0x-prefixed hex representation */
    hex: string;
    /** JSON string from .toJson() */
    json: string;
  };
}

/**
 * Interface for the Confidential Key Manager
 */
export interface ConfidentialKeyManager {
  /**
   * Initialize the WASM module
   * Must be called before any other operations
   */
  initWasm(): Promise<void>;

  /**
   * Check if WASM module is initialized
   */
  isInitialized(): boolean;

  /**
   * Generate new random account keys
   * @returns The seed and public keys
   */
  generateKeys(): Promise<{
    seed: string;
    publicKeys: ConfidentialAccountPublicKeys;
  }>;

  /**
   * Generate account keys from a specific seed (advanced mode)
   * @param seed - 64-character hex string
   * @returns The seed and public keys
   */
  generateKeysFromSeed(seed: string): Promise<{
    seed: string;
    publicKeys: ConfidentialAccountPublicKeys;
  }>;

  /**
   * Load account keys from stored seed
   * @param seed - 64-character hexadecimal seed
   */
  loadKeys(seed: string): Promise<void>;

  /**
   * Get public keys of the currently loaded keys
   * @returns Public keys in hex and JSON format
   */
  getPublicKeys(): Promise<ConfidentialAccountPublicKeys>;

  /**
   * Get the currently loaded AccountKeys object
   * @returns The loaded AccountKeys object
   * @throws ConfidentialError if no keys are loaded
   */
  getCurrentKeys(): AccountKeys;

  /**
   * Clear the currently loaded keys from memory
   */
  clearKeys(): void;

  /**
   * Check if an operation is currently in progress
   */
  isOperationInProgress(): boolean;
}

/**
 * Error types that can be thrown by the Confidential key manager
 */
export const ConfidentialErrorType = {
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  INVALID_BYTES: 'INVALID_BYTES',
  INVALID_SEED: 'INVALID_SEED',
  INVALID_DID: 'INVALID_DID',
  KEY_NOT_LOADED: 'KEY_NOT_LOADED',
  OPERATION_IN_PROGRESS: 'OPERATION_IN_PROGRESS',
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
  WASM_ERROR: 'WASM_ERROR',
} as const;

export type ConfidentialErrorType =
  (typeof ConfidentialErrorType)[keyof typeof ConfidentialErrorType];

export class ConfidentialError extends Error {
  type: ConfidentialErrorType;

  constructor(type: ConfidentialErrorType, message: string, cause?: unknown) {
    super(message);
    this.name = 'ConfidentialError';
    this.type = type;
    if (cause) {
      this.cause = cause;
    }
  }
}
