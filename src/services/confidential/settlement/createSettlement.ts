/**
 * Create Settlement Instruction Service
 *
 * Handles creation of confidential asset settlement instructions on-chain
 */

import type { TransactionState } from '@/context/transaction';
import {
  buildAssetLeafPath,
  getAssetCurveTreeState,
} from '@/utils/curveTreeQueries';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import {
  AccountPublicKeys,
  AssetState,
  AssetTreeRoot,
  LegBuilder,
  SettlementBuilder,
} from '@polymesh/polymesh-dart-wasm';

// ============================================================================
// Types
// ============================================================================

export interface ISettlementLeg {
  amount: string;
  senderPublicKeys: AccountPublicKeys;
  receiverPublicKeys: AccountPublicKeys;
  assetState: AssetState;
}

export interface ICreateSettlementParams {
  /**
   * Legs for this settlement
   */
  legs: ISettlementLeg[];

  /**
   * Optional memo for the settlement
   */
  memo?: string;

  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;

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
  onEncrypting?: () => void;
  onSubmitting?: () => void;
}

export interface CreateSettlementResult {
  /**
   * Settlement reference (unique identifier)
   */
  settlementId: string;

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
// Helper Functions
// ============================================================================

/**
 * Extract settlement ID from SettlementCreated event
 */
function extractSettlementId(
  events: EventRecord[],
  polkadotApi: ApiPromise,
): string | null {
  for (const record of events) {
    const { event } = record;

    if (polkadotApi.events.confidentialAssets.SettlementCreated.is(event)) {
      // Event structure: SettlementCreated { settlementRef, memo, assetRootBlock, legs }
      // settlementRef is SettlementRef type ([u8;32] - 32-byte array)
      const settlementRef = event.data.settlementRef || event.data[0];

      // Convert to hex string for storage/use
      return settlementRef.toHex();
    }
  }

  return null;
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Create a confidential asset settlement instruction
 *
 * @param params - Settlement creation parameters
 * @returns Transaction result with settlement ID
 */
export async function createSettlement(
  params: ICreateSettlementParams,
): Promise<CreateSettlementResult> {
  const {
    legs,
    memo = '',
    polkadotApi,
    submitTransaction,
    onEncrypting,
    onSubmitting,
  } = params;

  if (legs.length === 0) {
    throw new Error('At least one leg is required');
  }

  // Build encrypted leg data for all parties
  onEncrypting?.();

  // Get the current asset curve tree state (root, block, hash)
  // We use the same state for all assets in the settlement
  const { root, blockHash, blockNumber } =
    await getAssetCurveTreeState(polkadotApi);

  // Create settlement builder
  const settlementBuilder = new SettlementBuilder(
    memo,
    blockNumber,
    AssetTreeRoot.fromBytes(root),
  );

  // Process each leg
  const processedAssets = new Set<number>();

  for (const leg of legs) {
    const assetId = leg.assetState.assetId();

    // Create leg builder
    const legBuilder = new LegBuilder(
      leg.senderPublicKeys,
      leg.receiverPublicKeys,
      leg.assetState,
      BigInt(leg.amount),
    );

    // Add leg to settlement
    settlementBuilder.addLeg(legBuilder);

    // Add asset path to settlement if not already added
    if (!processedAssets.has(assetId)) {
      // Fetch path for the asset using the shared block hash
      const leafPath = await buildAssetLeafPath({
        currentLeafIndex: BigInt(assetId),
        polkadotApi,
        blockHash,
        blockNumber,
      });

      settlementBuilder.addAssetPath(assetId, leafPath);
      processedAssets.add(assetId);
    }
  }

  // Build the settlement with encrypted leg data
  const settlementProof = settlementBuilder.build();
  const proofBytes = settlementProof.toBytes();

  // Submit transaction
  onSubmitting?.();
  const tx = polkadotApi.tx.confidentialAssets.createSettlement(proofBytes);
  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.createSettlement',
  });

  // Extract settlement ID from events

  const settlementId = extractSettlementId(result.events, polkadotApi);

  if (!settlementId) {
    throw new Error('Settlement created but ID not found in events');
  }

  return {
    settlementId,
    txHash: result.txHash,
    blockHash: result.blockHash,
    blockNumber: result.blockNumber,
    txIndex: result.txIndex,
  };
}
