/**
 * Decrypt Settlement Instruction Service
 *
 * Handles decryption of settlement legs to view transfer details
 */

import type { SettlementLegDetails } from '@/types/settlement';
import type { ApiPromise } from '@polkadot/api';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import { queryEncryptedLeg } from './settlementHelpers';

// ============================================================================
// Types
// ============================================================================

export interface DecryptSettlementParams {
  /**
   * Settlement ID (SettlementRef - 32-byte array as hex string)
   */
  settlementId: string;

  /**
   * Leg ID to decrypt (0-indexed)
   */
  legId: number;

  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;

  /**
   * The AccountKeys instance for the confidential account.
   */
  accountKeys: AccountKeys;
}

export interface DecryptSettlementResult {
  /**
   * Decrypted leg details
   */
  leg: SettlementLegDetails;
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Decrypt a settlement leg to view its details
 *
 * @param params - Decryption parameters
 * @returns Decrypted leg details
 */
export async function decryptSettlement(
  params: DecryptSettlementParams,
): Promise<DecryptSettlementResult> {
  const { settlementId, legId, polkadotApi, accountKeys } = params;

  // Query encrypted leg from chain
  const encryptedLeg = await queryEncryptedLeg(
    polkadotApi,
    settlementId,
    legId,
  );

  // Try to decrypt as sender/receiver first
  let decryptedLeg = encryptedLeg.tryDecrypt(accountKeys);

  if (!decryptedLeg) {
    // Try to decrypt as mediator/auditor
    const encryptionKeyPair = accountKeys.encryptionKeyPair();
    decryptedLeg =
      encryptedLeg.tryDecryptAsMediatorOrAuditor(encryptionKeyPair);

    if (!decryptedLeg) {
      throw new Error(
        'Failed to decrypt settlement leg. You are not involved in this settlement.',
      );
    }
  }

  // Extract leg details
  const senderKeyHex = decryptedLeg.sender.toJs() as string;
  const receiverKeyHex = decryptedLeg.receiver.toJs() as string;
  const assetId = decryptedLeg.assetId.toString();

  const legDetails: SettlementLegDetails = {
    legId,
    assetId,
    amount: decryptedLeg.amount.toString(),
    senderPublicKey: senderKeyHex,
    receiverPublicKey: receiverKeyHex,
  };

  return {
    leg: legDetails,
  };
}
