/**
 * Decrypt Settlement Instruction Service
 *
 * Handles decryption of settlement legs to view transfer details
 */

import type { SettlementLegDetails } from '@/types/settlement';
import type { ApiPromise } from '@polkadot/api';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import { queryEncryptedLeg, queryLegMediators } from './settlementHelpers';

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

  /**
   * How the leg was decrypted: `participant` with the account keys (sender or receiver),
   * otherwise the role DART reports for the encryption key (`mediator` or `auditor`).
   */
  decryptedAs: 'participant' | 'mediator' | 'auditor';
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

  // Query the encrypted leg and its mediators from chain
  const [encryptedLeg, mediators] = await Promise.all([
    queryEncryptedLeg(polkadotApi, settlementId, legId),
    queryLegMediators(polkadotApi, settlementId, legId),
  ]);

  // Try to decrypt as sender/receiver first
  let decryptedLeg = encryptedLeg.tryDecrypt(accountKeys);
  let decryptedAs: DecryptSettlementResult['decryptedAs'] = 'participant';

  if (!decryptedLeg) {
    // Try to decrypt as mediator/auditor. Passing the account public key as the
    // affirmation key lets DART report `Mediator` when this account mediates the leg.
    // Without it, every leg decrypted this way reports `Auditor`.
    const encryptionKeyPair = accountKeys.encryptionKeyPair();
    const publicKeys = accountKeys.publicKeys();
    const accountPublicKey = publicKeys.accountPublicKey();
    try {
      decryptedLeg = encryptedLeg.tryDecryptAsMediatorOrAuditor(
        encryptionKeyPair,
        null,
        accountPublicKey,
      );
    } finally {
      // SECURITY: Clear encryption key pair after use
      encryptionKeyPair.clear();
      accountPublicKey.free();
      publicKeys.free();
    }

    if (!decryptedLeg) {
      throw new Error(
        'Failed to decrypt leg. You are not involved in this transfer leg.',
      );
    }

    decryptedAs =
      decryptedLeg.role.toLowerCase() === 'mediator' ? 'mediator' : 'auditor';
  }

  // Extract leg details
  const senderEncryptionKey = decryptedLeg.sender.toJs() as string;
  const receiverEncryptionKey = decryptedLeg.receiver.toJs() as string;
  const assetId = decryptedLeg.assetId.toString();

  // `legMediators` is not always written (testnet v8.2.0 leaves it empty for a settlement
  // created with the asset's current keys). Fall back to the asset's current mediators,
  // which is what the chain's mediator indices refer to in that case.
  if (mediators.length === 0) {
    const assetKeys = await polkadotApi.query.confidentialAssets.keys(assetId);
    if (assetKeys.isSome) {
      for (const accountKey of assetKeys.unwrap().mediators) {
        mediators.push(accountKey.toHex());
      }
    }
  }

  const legDetails: SettlementLegDetails = {
    legId,
    assetId,
    amount: decryptedLeg.amount.toString(),
    senderEncryptionKey,
    receiverEncryptionKey,
    mediators,
  };

  return {
    leg: legDetails,
    decryptedAs,
  };
}
