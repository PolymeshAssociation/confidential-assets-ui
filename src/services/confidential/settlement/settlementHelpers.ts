/**
 * Settlement Service Helpers
 *
 * Common utilities shared across settlement services
 */

import type { ApiPromise } from '@polkadot/api';
import { SettlementLegEncrypted } from '@polymesh/polymesh-dart-wasm';

// // Re-export shared helpers
// export {
//   validateAndGetAccountKeys,
//   restoreAccountAssetState,
//   commitAndExportState,
//   extractAndValidateLeafIndex,
// } from '../helpers';

// ============================================================================
// Leg Queries
// ============================================================================

/**
 * Query encrypted settlement leg from chain
 * @param polkadotApi - Polkadot API instance
 * @param settlementId - Settlement ID (hex string)
 * @param legId - Leg ID (0-indexed)
 * @returns Encrypted settlement leg
 * @throws Error if leg not found
 */
export async function queryEncryptedLeg(
  polkadotApi: ApiPromise,
  settlementId: string,
  legId: number,
): Promise<SettlementLegEncrypted> {
  const encryptedLegDataOption =
    await polkadotApi.query.confidentialAssets.settlementLegs(
      settlementId,
      legId,
    );

  if (encryptedLegDataOption.isNone) {
    throw new Error(`Settlement leg not found: ${settlementId}/${legId}`);
  }

  const encryptedLegData = encryptedLegDataOption.unwrap();
  const legBytesArray = encryptedLegData.toU8a();
  return SettlementLegEncrypted.fromBytes(legBytesArray);
}

// ============================================================================
// Common Result Type
// ============================================================================

/**
 * Standard result returned by settlement operations that update account state
 */
export interface SettlementOperationResult {
  txHash: string;
  blockHash: string;
  blockNumber: number;
  txIndex: number;
  updatedStateBytes: string;
  newLeafIndex: string;
}
