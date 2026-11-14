/**
 * Settlement Service Helpers
 *
 * Common utilities shared across settlement services
 */

import type { ApiPromise } from '@polkadot/api';
import { SettlementLegEncrypted } from '@polymesh/polymesh-dart-wasm';

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

/**
 * Query the mediator account keys recorded for a settlement leg
 * (`confidentialAssets.legMediators`, added in v8.2.0).
 *
 * The chain fixes a leg's mediators when the settlement is created, so they can differ
 * from the asset's current mediators. The order matches the mediator index used in
 * `legAffirmationStatus`.
 *
 * The chain does not always write this entry. An empty result means "not recorded", and
 * callers should fall back to the asset's current mediators.
 *
 * @returns Mediator account public keys as hex strings. Empty if none are recorded.
 */
export async function queryLegMediators(
  polkadotApi: ApiPromise,
  settlementId: string,
  legId: number,
): Promise<string[]> {
  const legMediatorsOption =
    await polkadotApi.query.confidentialAssets.legMediators(
      settlementId,
      legId,
    );

  if (legMediatorsOption.isNone) {
    return [];
  }

  return [...legMediatorsOption.unwrap().mediators].map((accountKey) =>
    accountKey.toHex(),
  );
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
