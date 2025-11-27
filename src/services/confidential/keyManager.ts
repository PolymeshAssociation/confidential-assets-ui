/**
 * Polymesh Confidential Key Manager Implementation
 *
 * Manages confidential account keys using the Polymesh DART WASM library.
 */

import type {
  ConfidentialAccountPublicKeys,
  ConfidentialKeyManager,
} from '@/types/confidential';
import { ConfidentialError, ConfidentialErrorType } from '@/types/confidential';
import { u8aToHex } from '@polkadot/util';
import { base64Decode, base64Encode } from '@polkadot/util-crypto';
import {
  AccountKeys,
  generateRandomSeed,
  init,
} from '@polymesh/polymesh-dart-wasm';

class ConfidentialKeyManagerImpl implements ConfidentialKeyManager {
  private initialized = false;
  private currentKeys: AccountKeys | null = null;
  private operationInProgress = false;

  async initWasm(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      init();
      this.initialized = true;
    } catch (error) {
      console.error(
        '[Confidential Key Manager] WASM initialization failed:',
        error,
      );
      throw new ConfidentialError(
        ConfidentialErrorType.INITIALIZATION_FAILED,
        'Failed to initialize WASM module. Your browser may not support WebAssembly.',
        error,
      );
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async generateKeys(): Promise<{
    scaleBytes: string;
    publicKeys: ConfidentialAccountPublicKeys;
  }> {
    if (!this.initialized) {
      throw new ConfidentialError(
        ConfidentialErrorType.NOT_INITIALIZED,
        'WASM module not initialized. Call initWasm() first.',
      );
    }
    if (this.operationInProgress) {
      throw new ConfidentialError(
        ConfidentialErrorType.OPERATION_IN_PROGRESS,
        'Another operation is already in progress.',
      );
    }

    try {
      this.operationInProgress = true;

      // Generate random seed
      const seed = generateRandomSeed();

      // Create account keys from seed
      const keys = new AccountKeys(seed);

      // Export as SCALE-encoded bytes
      const scaleBytes = keys.toBytes();
      const base64Bytes = base64Encode(scaleBytes);

      // Extract public keys
      const publicKeys = keys.publicKeys();
      const accountPubKey = publicKeys.accountPublicKey();
      const encryptionPubKey = publicKeys.encryptionPublicKey();

      return {
        scaleBytes: base64Bytes,
        publicKeys: {
          accountPublicKey: {
            hex: u8aToHex(accountPubKey.toBytes()),
            json: accountPubKey.toJson(),
          },
          encryptionPublicKey: {
            hex: u8aToHex(encryptionPubKey.toBytes()),
            json: encryptionPubKey.toJson(),
          },
        },
      };
    } catch (error) {
      console.error('[Confidential Key Manager] Key generation failed:', error);
      throw new ConfidentialError(
        ConfidentialErrorType.WASM_ERROR,
        'Failed to generate keys.',
        error,
      );
    } finally {
      this.operationInProgress = false;
    }
  }

  async generateKeysFromSeed(seed: string): Promise<{
    scaleBytes: string;
    publicKeys: ConfidentialAccountPublicKeys;
  }> {
    if (!this.initialized) {
      throw new ConfidentialError(
        ConfidentialErrorType.NOT_INITIALIZED,
        'WASM module not initialized. Call initWasm() first.',
      );
    }

    if (this.operationInProgress) {
      throw new ConfidentialError(
        ConfidentialErrorType.OPERATION_IN_PROGRESS,
        'Another operation is already in progress.',
      );
    }

    // Validate seed format (should be 64 hex characters)
    if (!/^[0-9a-fA-F]{64}$/.test(seed)) {
      throw new ConfidentialError(
        ConfidentialErrorType.INVALID_SEED,
        'Seed must be exactly 64 hexadecimal characters.',
      );
    }

    try {
      this.operationInProgress = true;

      // Create account keys from seed
      const keys = new AccountKeys(seed);

      // Export as SCALE-encoded bytes
      const scaleBytes = keys.toBytes();
      const base64Bytes = base64Encode(scaleBytes);

      // Extract public keys
      const publicKeys = keys.publicKeys();
      const accountPubKey = publicKeys.accountPublicKey();
      const encryptionPubKey = publicKeys.encryptionPublicKey();

      return {
        scaleBytes: base64Bytes,
        publicKeys: {
          accountPublicKey: {
            hex: u8aToHex(accountPubKey.toBytes()),
            json: accountPubKey.toJson(),
          },
          encryptionPublicKey: {
            hex: u8aToHex(encryptionPubKey.toBytes()),
            json: encryptionPubKey.toJson(),
          },
        },
      };
    } catch (error) {
      console.error(
        '[Confidential Key Manager] Key generation from seed failed:',
        error,
      );
      throw new ConfidentialError(
        ConfidentialErrorType.WASM_ERROR,
        'Failed to generate keys from seed.',
        error,
      );
    } finally {
      this.operationInProgress = false;
    }
  }

  async loadKeys(scaleBase64: string): Promise<void> {
    if (!this.initialized) {
      throw new ConfidentialError(
        ConfidentialErrorType.NOT_INITIALIZED,
        'WASM module not initialized. Call initWasm() first.',
      );
    }

    if (this.operationInProgress) {
      throw new ConfidentialError(
        ConfidentialErrorType.OPERATION_IN_PROGRESS,
        'Another operation is already in progress.',
      );
    }

    try {
      this.operationInProgress = true;

      // Decode base64 to bytes
      const scaleBytes = base64Decode(scaleBase64);

      // Import AccountKeys from SCALE bytes
      const keys = AccountKeys.fromBytes(scaleBytes);
      this.currentKeys = keys;
    } catch (error) {
      console.error('[Confidential Key Manager] Failed to load keys:', error);
      throw new ConfidentialError(
        ConfidentialErrorType.INVALID_BYTES,
        'Failed to load keys. The stored data may be corrupted.',
        error,
      );
    } finally {
      this.operationInProgress = false;
    }
  }

  getCurrentKeys(): AccountKeys {
    if (!this.initialized) {
      throw new ConfidentialError(
        ConfidentialErrorType.NOT_INITIALIZED,
        'WASM module not initialized. Call initWasm() first.',
      );
    }

    if (!this.currentKeys) {
      throw new ConfidentialError(
        ConfidentialErrorType.KEY_NOT_LOADED,
        'No keys are currently loaded. Call loadKeys() first.',
      );
    }

    return this.currentKeys;
  }

  async getPublicKeys(): Promise<ConfidentialAccountPublicKeys> {
    if (!this.initialized) {
      throw new ConfidentialError(
        ConfidentialErrorType.NOT_INITIALIZED,
        'WASM module not initialized. Call initWasm() first.',
      );
    }

    if (!this.currentKeys) {
      throw new ConfidentialError(
        ConfidentialErrorType.KEY_NOT_LOADED,
        'No keys are currently loaded. Call loadKeys() first.',
      );
    }

    try {
      // Get public keys
      const publicKeys = this.currentKeys.publicKeys();

      // Extract account public key
      const accountPubKey = publicKeys.accountPublicKey();
      const accountBytes = accountPubKey.toBytes();
      const accountHex = u8aToHex(accountBytes);
      const accountJson = accountPubKey.toJson();

      // Extract encryption public key
      const encryptionPubKey = publicKeys.encryptionPublicKey();
      const encryptionBytes = encryptionPubKey.toBytes();
      const encryptionHex = u8aToHex(encryptionBytes);
      const encryptionJson = encryptionPubKey.toJson();

      return {
        accountPublicKey: {
          hex: accountHex,
          json: accountJson,
        },
        encryptionPublicKey: {
          hex: encryptionHex,
          json: encryptionJson,
        },
      };
    } catch (error) {
      console.error(
        '[Confidential Key Manager] Failed to get public keys:',
        error,
      );
      throw new ConfidentialError(
        ConfidentialErrorType.WASM_ERROR,
        'Failed to extract public keys.',
        error,
      );
    }
  }

  clearKeys(): void {
    if (this.operationInProgress) {
      throw new ConfidentialError(
        ConfidentialErrorType.OPERATION_IN_PROGRESS,
        'Cannot clear keys while an operation is in progress.',
      );
    }

    this.currentKeys = null;
  }

  isOperationInProgress(): boolean {
    return this.operationInProgress;
  }
}

// Export singleton instance
export const confidentialKeyManager: ConfidentialKeyManager =
  new ConfidentialKeyManagerImpl();
