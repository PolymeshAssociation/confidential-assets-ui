/**
 * Confidential Asset Minting Service
 *
 * Handles minting of confidential asset tokens
 */

import type { TransactionState } from '@/context/transaction/types';
import { buildAccountLeafPathWithRoot } from '@/utils/curveTreeQueries';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import {
  commitAndExportState,
  extractAndValidateLeafIndex,
  restoreAccountAssetState,
} from './helpers';

export interface MintAssetParams {
  /**
   * Amount to mint (as string to handle big numbers)
   */
  amount: number;
  /**
   * Base64-encoded account asset state bytes from storage
   */
  stateBytes: string;
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
   * Progress callbacks for each step
   */
  onGeneratingProof?: () => void;
  onSubmittingTransaction?: () => void;
}

export interface MintAssetResult {
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
   * Updated account asset state bytes (base64)
   */
  updatedStateBytes: string;

  /**
   * New leaf index from transaction events
   */
  newLeafIndex: string;
}

/**
 * Mint confidential asset tokens
 *
 * Multi-step process:
 * 1. Restore account asset state from storage
 * 2. Generate zero-knowledge proof (includes fetching curve tree and building leaf path)
 * 3. Submit transaction to blockchain
 * 4. Extract new leaf index from events and update state
 *
 * @param params - Minting parameters
 * @returns Transaction result with updated state
 */
export async function mintConfidentialAsset(
  params: MintAssetParams,
): Promise<MintAssetResult> {
  const {
    amount,
    stateBytes,
    polkadotApi,
    accountKeys,
    submitTransaction,
    onGeneratingProof,
    onSubmittingTransaction,
  } = params;

  // Restore account asset state
  const accountAssetState = restoreAccountAssetState(stateBytes);
  const currentLeafIndex = accountAssetState.leafIndex();

  // Build account leaf path
  onGeneratingProof?.();
  const accountLeafPath = await buildAccountLeafPathWithRoot({
    currentLeafIndex,
    polkadotApi,
  });

  // Generate minting proof
  const mintingProof = accountAssetState.assetMintingProof(
    accountKeys,
    accountLeafPath,
    amount,
  );

  const proofBytes = mintingProof.toBytes();

  // Submit transaction
  onSubmittingTransaction?.();
  const tx = polkadotApi.tx.confidentialAssets.mintAsset(proofBytes);
  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.mintAsset',
  });

  // Extract new leaf index and commit state
  const newLeafIndex = extractAndValidateLeafIndex(result.events, polkadotApi);
  const updatedStateBytes = commitAndExportState(
    accountAssetState,
    newLeafIndex,
  );

  return {
    txHash: result.txHash,
    blockHash: result.blockHash,
    blockNumber: result.blockNumber,
    txIndex: result.txIndex,
    updatedStateBytes,
    newLeafIndex: newLeafIndex.toString(),
  };
}
