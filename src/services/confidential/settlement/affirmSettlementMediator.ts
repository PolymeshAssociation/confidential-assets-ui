/**
 * Affirm Settlement as Mediator Service
 *
 * Handles mediator affirmation of settlement legs
 */

import type { TransactionState } from '@/context/transaction/types';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import { queryEncryptedLeg } from './settlementHelpers';

// ============================================================================
// Types
// ============================================================================

export interface AffirmSettlementMediatorParams {
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
   * Whether to accept (affirm) or reject the settlement leg.
   * Defaults to true (affirm).
   */
  accept?: boolean;

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

export interface AffirmSettlementMediatorResult {
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
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Affirm settlement as mediator
 *
 * @param params - Affirmation parameters
 * @returns Transaction result
 */
export async function affirmSettlementMediator(
  params: AffirmSettlementMediatorParams,
): Promise<AffirmSettlementMediatorResult> {
  const {
    settlementId,
    legId,
    assetId,
    amount,
    polkadotApi,
    accountKeys,
    submitTransaction,
    onBuildingProof,
    onSubmitting,
  } = params;

  const encryptionKeyPair = accountKeys.encryptionKeyPair();

  // Query encrypted leg from chain
  const encryptedLeg = await queryEncryptedLeg(
    polkadotApi,
    settlementId,
    legId,
  );

  // Generate mediator affirmation proof
  onBuildingProof?.();

  // Default to true if not specified
  const accept = params.accept ?? true;

  const affirmationProof = encryptionKeyPair.mediatorAffirmationProof(
    settlementId,
    legId,
    encryptedLeg,
    accept,
    parseInt(assetId, 10),
    amount ?? null,
  );

  const proofBytes = affirmationProof.toBytes();

  // Submit transaction
  onSubmitting?.();
  const tx = polkadotApi.tx.confidentialAssets.mediatorAffirmation(proofBytes);
  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.mediatorAffirmation',
  });

  return {
    txHash: result.txHash,
    blockHash: result.blockHash,
    blockNumber: result.blockNumber,
    txIndex: result.txIndex,
  };
}
