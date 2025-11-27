/**
 * Confidential Account Registration Service
 *
 * Handles registration of confidential DART account keys on-chain,
 * linking them to the user's Polymesh identity.
 */

import type { TransactionState } from '@/context/transaction';
import { confidentialKeyManager } from '@/services/confidential/keyManager';
import type { ConfidentialAccountPublicKeys } from '@/types/confidential';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';

export interface RegisterAccountParams {
  /**
   * User's on-chain Polymesh identity (DID) as 0x-prefixed hex string
   */
  did: string | Uint8Array;

  /**
   * Polkadot API instance from SDK
   */
  polkadotApi: ApiPromise;

  /**
   * The AccountKeys instance for the confidential account.
   */
  accountKeys: AccountKeys;

  /**
   * Transaction submission function from useTransaction hook
   */
  submitTransaction: (params: {
    tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
    tag: string;
    onStatusChange?: (state: TransactionState) => void;
  }) => Promise<{
    txHash: string;
    blockHash: string;
    blockNumber: number;
    txIndex: number;
  }>;

  /**
   * Optional callback for status updates during proof generation
   */
  onProofGenerating?: () => void;
  onProofGenerated?: () => void;
}

export interface RegisterAccountResult {
  txHash: string;
  blockHash: string;
  blockNumber: number;
  txIndex: number;
  publicKeys: ConfidentialAccountPublicKeys;
}

/**
 * Register confidential account on-chain
 *
 * Generates a SCALE-encoded account registration proof (which includes the public keys
 * and zero-knowledge proof) and submits it to the chain to link DART keys with a DID.
 *
 * @param params - Registration parameters
 * @returns Transaction result with public keys
 */
export async function registerConfidentialAccount(
  params: RegisterAccountParams,
): Promise<RegisterAccountResult> {
  const {
    did,
    polkadotApi,
    accountKeys,
    submitTransaction,
    onProofGenerating,
    onProofGenerated,
  } = params;

  // Get public keys for return value
  const publicKeys = await confidentialKeyManager.getPublicKeys();

  // Generate the account registration proof
  onProofGenerating?.();

  let proofBytes: Uint8Array;
  try {
    // Convert DID to Uint8Array if it's a string
    let didBytes: Uint8Array;
    if (typeof did === 'string') {
      // Remove '0x' prefix if present and convert hex to bytes
      didBytes = hexToU8a(did);
    } else {
      didBytes = did;
    }

    // Validate DID is 32 bytes
    if (didBytes.length !== 32) {
      throw new Error(
        `DID must be exactly 32 bytes, got ${
          didBytes.length
        } bytes. DID hex: ${u8aToHex(didBytes)}`,
      );
    }

    // Generate the SCALE-encoded proof (includes public keys and ZK proof)
    const proof = accountKeys.registerAccountProof(didBytes);
    proofBytes = proof.toBytes();
  } catch (error) {
    console.error('Failed to generate account registration proof:', error);
    throw new Error(
      `Failed to generate account registration proof: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  onProofGenerated?.();

  // Submit transaction
  const tx = polkadotApi.tx.confidentialAssets.registerAccounts(proofBytes);

  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.registerAccounts',
  });

  return {
    ...result,
    publicKeys,
  };
}
