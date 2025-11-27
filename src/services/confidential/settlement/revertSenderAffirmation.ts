/**
 * Revert Sender Affirmation Service
 *
 * Handles sender reverting (cancelling) their affirmation of a settlement leg which rejects the instruction
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
} from '../helpers';
import { queryEncryptedLeg } from './settlementHelpers';

// ============================================================================
// Types
// ============================================================================

export interface RevertSenderAffirmationParams {
  /**
   * Settlement ID (SettlementRef - 32-byte array as hex string)
   */
  settlementId: string;
  /**
   * Leg ID (0-indexed)
   */
  legId: number;
  /**
   * Asset ID involved in the leg
   */
  assetId: string;
  /**
   * Optional amount for validation (if decrypted beforehand)
   * If provided, WASM will verify it matches the encrypted leg amount
   */
  amount?: string | number | bigint;
  /**
   * Base64-encoded account asset state bytes from storage
   */
  stateBytes: string;
  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;
  /**
   * The AccountKeys instance for the confidential account.
   */
  accountKeys: AccountKeys;
  /**
   * Transaction submission function
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
   * Progress callbacks
   */
  onBuildingProof?: () => void;
  onSubmitting?: () => void;
}

export interface RevertSenderAffirmationResult {
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
   * New leaf index from events
   */
  newLeafIndex: string;
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Revert (cancel) sender affirmation of a settlement leg
 *
 * @param params - Revert parameters
 * @returns Transaction result with updated state
 */
export async function revertSenderAffirmation(
  params: RevertSenderAffirmationParams,
): Promise<RevertSenderAffirmationResult> {
  const {
    settlementId,
    legId,
    assetId,
    amount,
    stateBytes,
    polkadotApi,
    accountKeys,
    submitTransaction,
    onBuildingProof,
    onSubmitting,
  } = params;

  // Restore account asset state
  const accountAssetState = restoreAccountAssetState(stateBytes);
  const currentLeafIndex = accountAssetState.leafIndex();

  // Query encrypted leg from chain
  const encryptedLeg = await queryEncryptedLeg(
    polkadotApi,
    settlementId,
    legId,
  );

  // Build account leaf path
  onBuildingProof?.();
  const accountLeafPath = await buildAccountLeafPathWithRoot({
    currentLeafIndex,
    polkadotApi,
  });

  // Generate sender revert proof
  const revertProof = accountAssetState.senderRevertProof(
    accountKeys,
    accountLeafPath,
    settlementId,
    legId,
    encryptedLeg,
    parseInt(assetId, 10),
    amount ?? null,
  );

  const proofBytes = revertProof.toBytes();

  // Submit transaction
  onSubmitting?.();
  const tx = polkadotApi.tx.confidentialAssets.senderRevert(proofBytes);
  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.senderRevert',
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
