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
  senderPublicKey: string;
  receiverPublicKey: string;
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
  roles: SettlementRole[]; // Roles of the account in this settlement
  createdAt: number; // Timestamp when record was created
}

// ============================================================================
// Settlement Chain Data
// ============================================================================

/**
 * Settlement details queried from chain
 */
export interface SettlementChainData {
  settlementId: string;
  status: SettlementStatus;
  memo: string;
  assetRootBlock: number;
  legs: unknown[]; // Encrypted leg data from chain
  pendingAffirmations: number;
  pendingFinalizations: number;
}

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
