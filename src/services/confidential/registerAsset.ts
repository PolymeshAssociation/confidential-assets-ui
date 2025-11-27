/**
 * Confidential Asset Registration Service
 *
 * Handles registration of account keys with confidential assets
 */

import type { TransactionState } from '@/context/transaction';
import { confidentialKeyManager } from '@/services/confidential/keyManager';
import type { AccountAssetStateRecord } from '@/types/asset';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { base64Encode } from '@polkadot/util-crypto';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import { extractAndValidateLeafIndex } from './helpers';

export interface RegisterAssetParams {
  /**
   * Asset ID to register with
   */
  assetId: number;
  /**
   * User's on-chain Polymesh identity (DID) as 0x-prefixed hex string
   */
  did: string;
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
    events: EventRecord[];
  }>;

  /**
   * Optional callbacks for proof generation status
   */
  onProofGenerating?: () => void;
  onProofGenerated?: () => void;
}

export interface RegisterAssetResult {
  /**
   * Transaction hash
   */
  txHash: string;
  /**
   * Block hash
   */
  blockHash: string;
  /**
   * Block number
   */
  blockNumber: number;
  /**
   * Transaction index
   */
  txIndex: number;
  /**
   * Account asset state record to be saved
   */
  accountAssetState: AccountAssetStateRecord;
  /**
   * Leaf index from registration
   */
  leafIndex: string;
}

/**
 * Register a confidential account with an asset
 *
 * Generates a SCALE-encoded account asset registration proof and submits it
 * to the chain to link the account keys with the asset.
 *
 * @param params - Registration parameters
 * @returns Transaction result with account asset state
 */
export async function registerConfidentialAsset(
  params: RegisterAssetParams,
): Promise<RegisterAssetResult> {
  const {
    assetId,
    did,
    polkadotApi,
    accountKeys,
    submitTransaction,
    onProofGenerating,
    onProofGenerated,
  } = params;

  // Get public keys for return value
  const publicKeys = await confidentialKeyManager.getPublicKeys();

  // Generate the account asset registration proof
  onProofGenerating?.();

  let proofBytes: Uint8Array;

  // Re-doing the try-catch block to properly scope the WASM objects
  let registration;
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

    // Generate the account asset registration proof
    // Returns AccountAssetRegistration object
    registration = accountKeys.registerAccountAssetProof(assetId, didBytes);
    proofBytes = registration.getProofBytes();
  } catch (error) {
    console.error(
      'Failed to generate account asset registration proof:',
      error,
    );
    throw new Error(
      `Failed to generate account asset registration proof: ${error}`,
    );
  }

  onProofGenerated?.();

  // Submit transaction
  const tx = polkadotApi.tx.confidentialAssets.registerAccountAssets({
    proofs: [proofBytes],
  });

  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.registerAccountAssets',
  });

  // Extract leaf index and commit state
  const leafIndex = extractAndValidateLeafIndex(result.events, polkadotApi);

  // Get the account asset state object
  const accountAssetStateObj = registration.getAccountAssetState();

  // Commit the pending state with the leaf index from the chain
  accountAssetStateObj.commitPendingState(leafIndex);

  // Export the finalized state
  const stateBytes = accountAssetStateObj.toBytes();

  // Create account asset state record for storage
  const accountAssetStateRecord: AccountAssetStateRecord = {
    version: 1,
    accountPublicKey: publicKeys.accountPublicKey.hex,
    assetId: assetId.toString(),
    stateBytes: base64Encode(stateBytes),
    leafIndex: leafIndex.toString(),
    updatedAt: Date.now(),
  };

  return {
    ...result,
    accountAssetState: accountAssetStateRecord,
    leafIndex: leafIndex.toString(),
  };
}
