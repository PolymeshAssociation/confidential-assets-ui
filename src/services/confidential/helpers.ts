/**
 * Confidential Service Helpers
 *
 * Common utilities shared across confidential services
 */

import type { ApiPromise } from '@polkadot/api';
import type { EventRecord } from '@polkadot/types/interfaces';
import { base64Decode, base64Encode } from '@polkadot/util-crypto';
import { AccountAssetState } from '@polymesh/polymesh-dart-wasm';

// ============================================================================
// State Management
// ============================================================================

/**
 * Restore account asset state from base64-encoded bytes
 * @param stateBytes - Base64-encoded state bytes
 * @returns Restored AccountAssetState instance
 */
export function restoreAccountAssetState(
  stateBytes: string,
): AccountAssetState {
  const stateData = base64Decode(stateBytes);
  return AccountAssetState.fromBytes(stateData);
}

/**
 * Commit state changes and export updated state bytes
 * @param accountAssetState - Account asset state to commit
 * @param newLeafIndex - New leaf index from transaction events
 * @returns Base64-encoded updated state bytes
 */
export function commitAndExportState(
  accountAssetState: AccountAssetState,
  newLeafIndex: bigint,
): string {
  accountAssetState.commitPendingState(newLeafIndex);
  const updatedStateBytes = accountAssetState.toBytes();
  return base64Encode(updatedStateBytes);
}

// ============================================================================
// Transaction Finalization
// ============================================================================

/**
 * Extract new leaf index from transaction events and validate
 * @param events - Transaction events
 * @param polkadotApi - Polkadot API instance
 * @returns New leaf index
 * @throws Error if leaf index cannot be extracted
 */
export function extractAndValidateLeafIndex(
  events: EventRecord[],
  polkadotApi: ApiPromise,
): bigint {
  for (const record of events) {
    const { event } = record;

    // Check for ConfidentialAssets.AccountStateLeafInserted event
    if (
      polkadotApi.events.confidentialAssets.AccountStateLeafInserted.is(event)
    ) {
      const leafIndexRaw = event.data.leafIndex;

      try {
        // Convert to bigint
        return BigInt(leafIndexRaw.toString());
      } catch (error) {
        throw new Error(
          `Failed to parse leaf index: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  }

  throw new Error('Failed to extract new leaf index from transaction events');
}
