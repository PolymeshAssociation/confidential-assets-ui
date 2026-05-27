/**
 * Settlement Types
 *
 * Type definitions for confidential asset settlement instructions
 */

// ============================================================================
// Settlement Status
// ============================================================================

/**
 * Settlement status as defined in pallet
 * Maps to: pallet_confidential_assets::settlement::SettlementStatus
 */
export type SettlementStatus =
  | 'Pending'
  | 'Executed'
  | 'Rejected'
  | 'Finalized';

/**
 * Affirmation status for each party in a leg
 */
export type AffirmationStatus =
  | 'Pending'
  | 'Affirmed'
  | 'Rejected'
  | 'Finalized';

/**
 * Role in a settlement leg
 */
export type SettlementRole = 'sender' | 'receiver' | 'mediator' | 'auditor';

// ============================================================================
// Settlement Leg Details
// ============================================================================

/**
 * Decrypted details of a settlement leg
 */
export interface SettlementLegDetails {
  legId: number;
  assetId: string;
  amount: string;
  senderEncryptionKey: string;
  receiverEncryptionKey: string;
}

// ============================================================================
// Settlement Reference
// ============================================================================

/**
 * Settlement reference (unique identifier)
 * This is the on-chain settlement ID
 *
 * On-chain type: [u8;32] (32-byte array)
 * In TypeScript: stored and passed as hex string (with or without 0x prefix)
 */
export interface SettlementRef {
  id: string; // Hex string representing 32-byte array
}

// ============================================================================
// Settlement Storage Record
// ============================================================================

/**
 * Minimal settlement record stored in localStorage
 * Additional details should be queried from chain
 */
export interface SettlementRecord {
  version: 1;
  settlementId: string; // SettlementRef as string
  accountPublicKey: string; // Account that stored this record
  genesisHash: string; // Chain genesis hash - scopes record to a specific chain
  roles: SettlementRole[]; // Roles of the account in this settlement
  createdAt: number; // Timestamp when record was created
}

// ============================================================================
// Leg Affirmation Party (for queries)
// ============================================================================

/**
 * Party type for leg affirmation queries
 * Maps to: pallet_confidential_assets::settlement::LegAffirmParty
 */
export type LegAffirmParty =
  | { Sender: null }
  | { Receiver: null }
  | { Mediator: number };

/**
 * Leg status as returned from chain queries
 */
export type LegStatus = 'Pending' | 'Affirmed' | 'Rejected' | 'Finalized';

/**
 * Affirmation status for a single leg
 */
export interface LegAffirmationStatus {
  sender: LegStatus;
  receiver: LegStatus;
  mediators: Map<number, LegStatus>;
}

// ============================================================================
// Settlement Chain Data
// ============================================================================

/**
 * Complete settlement details from chain queries
 * Includes status, legs, affirmations, and memo
 */
export interface SettlementDetailsChainData {
  settlementId: string;
  status: string;
  pendingAffirmations: number;
  pendingFinalizations: number;
  legIds: number[];
  legAffirmations: Map<number, LegAffirmationStatus>;
  memo?: string;
}

/**
 * Settlement chain data for UI display
 * Simplified version without settlementId (used when ID is already known)
 */
export type SettlementChainData = Omit<
  SettlementDetailsChainData,
  'settlementId' | 'legIds'
> & {
  legCount: number;
};

/**
 * Complete settlement details with decrypted legs
 */
export interface SettlementDetails {
  settlementId: string;
  status: SettlementStatus;
  memo?: string;
  legs: SettlementLegDetails[];
  createdAt?: number;
  role?: SettlementRole;
}

// ============================================================================
// Batch Decryption Results
// ============================================================================

/**
 * Result of decrypting a single leg (success case)
 */
export interface DecryptedLegSuccess {
  status: 'success';
  legId: number;
  leg: SettlementLegDetails;
  roles: SettlementRole[];
}

/**
 * Result of decrypting a single leg (failure case)
 */
export interface DecryptedLegFailure {
  status: 'failed';
  legId: number;
  error: string;
}

/**
 * Result of decrypting a single leg (not involved case)
 */
export interface DecryptedLegNotInvolved {
  status: 'not-involved';
  legId: number;
}

/**
 * Union type for decryption results
 */
export type DecryptedLegResult =
  | DecryptedLegSuccess
  | DecryptedLegFailure
  | DecryptedLegNotInvolved;
