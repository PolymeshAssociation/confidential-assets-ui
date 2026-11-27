/**
 * Decrypt Settlement Instruction Service
 *
 * Handles decryption of settlement legs to view transfer details
 */

import type { SettlementLegDetails } from '@/types/settlement';
import type { ApiPromise } from '@polkadot/api';
import type {
  AccountKeys,
  SettlementLeg,
  SettlementLegEncrypted,
} from '@polymesh/polymesh-dart-wasm';
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
  let mediatorIndex: number | undefined;

  if (!decryptedLeg) {
    decryptedLeg = tryDecryptAsMediatorOrAuditor(encryptedLeg, accountKeys);

    if (!decryptedLeg) {
      throw new Error(
        'Failed to decrypt leg. You are not involved in this transfer leg.',
      );
    }

    mediatorIndex = mediatorIndexOf(decryptedLeg);
    decryptedAs = mediatorIndex !== undefined ? 'mediator' : 'auditor';
  }

  // Extract leg details
  const senderEncryptionKey = decryptedLeg.sender.toJs() as string;
  const receiverEncryptionKey = decryptedLeg.receiver.toJs() as string;
  const assetId = decryptedLeg.assetId.toString();

  // `legMediators` is not always written (testnet v8.2.0 leaves it empty for a settlement
  // created with the asset's current keys). Fall back to the asset's current mediators.
  if (mediators.length === 0) {
    const assetKeys = await polkadotApi.query.confidentialAssets.keys(assetId);
    if (assetKeys.isSome) {
      for (const accountKey of assetKeys.unwrap().mediators) {
        mediators.push(accountKey.toHex());
      }
    }
  }

  // A sender or receiver can also mediate the leg. `tryDecrypt` reports only the participant
  // role, so look up the mediator index from the leg's mediator entries.
  if (decryptedAs === 'participant') {
    mediatorIndex = accountMediatorIndex(encryptedLeg, accountKeys);
  }

  const legDetails: SettlementLegDetails = {
    legId,
    assetId,
    amount: decryptedLeg.amount.toString(),
    senderEncryptionKey,
    receiverEncryptionKey,
    mediators,
    mediatorIndex,
  };

  return {
    leg: legDetails,
    decryptedAs,
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Decrypt a leg with the account's encryption key as a mediator or auditor. The account public
 * key is passed as the affirmation key, so DART reports `Mediator` with `roleIndex` set when the
 * account mediates the leg, and `Auditor` otherwise.
 */
function tryDecryptAsMediatorOrAuditor(
  encryptedLeg: SettlementLegEncrypted,
  accountKeys: AccountKeys,
): SettlementLeg | undefined {
  const encryptionKeyPair = accountKeys.encryptionKeyPair();
  const publicKeys = accountKeys.publicKeys();
  const accountPublicKey = publicKeys.accountPublicKey();
  try {
    return encryptedLeg.tryDecryptAsMediatorOrAuditor(
      encryptionKeyPair,
      null,
      accountPublicKey,
      null,
    );
  } finally {
    // SECURITY: Clear encryption key pair after use
    encryptionKeyPair.clear();
    accountPublicKey.free();
    publicKeys.free();
  }
}

/**
 * The mediator index DART reports for a leg decrypted as `Mediator`, otherwise `undefined`.
 */
function mediatorIndexOf(leg: SettlementLeg): number | undefined {
  return leg.role.toLowerCase() === 'mediator' ? leg.roleIndex : undefined;
}

/**
 * The account's mediator index in the leg, from the leg's mediator entries without decrypting the
 * leg, otherwise `undefined`.
 */
function accountMediatorIndex(
  encryptedLeg: SettlementLegEncrypted,
  accountKeys: AccountKeys,
): number | undefined {
  const encryptionKeyPair = accountKeys.encryptionKeyPair();
  const publicKeys = accountKeys.publicKeys();
  const accountPublicKey = publicKeys.accountPublicKey();
  try {
    return encryptedLeg.mediatorIndex(encryptionKeyPair, accountPublicKey);
  } finally {
    // SECURITY: Clear encryption key pair after use
    encryptionKeyPair.clear();
    accountPublicKey.free();
    publicKeys.free();
  }
}
