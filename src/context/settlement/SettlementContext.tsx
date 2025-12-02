/**
 * Settlement Context
 *
 * Defines the settlement context interface
 */

import type { SettlementRecord, SettlementRole } from '@/types/settlement';
import type { AccountPublicKeys } from '@polymesh/polymesh-dart-wasm';
import { createContext } from 'react';

export interface SettlementContextValue {
  // ============================================================================
  // State
  // ============================================================================

  /**
   * Map of settlement IDs to their records
   */
  settlements: Map<string, SettlementRecord>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error: string | null;

  // ============================================================================
  // Operations
  // ============================================================================

  /**
   * Create a new settlement instruction
   */
  createSettlement: (params: {
    legs: {
      assetId: string;
      amount: string;
      receiverPublicKeys: AccountPublicKeys;
      senderPublicKeys: AccountPublicKeys;
    }[];
    memo?: string;
    onProgress?: (step: string) => void;
  }) => Promise<{
    settlementId: string;
    txHash: string;
    blockNumber: number;
  }>;

  /**
   * Decrypt a settlement leg
   */
  decryptSettlement: (params: {
    settlementId: string;
    legId: number;
  }) => Promise<{
    leg: {
      legId: number;
      assetId: string;
      amount: string;
      senderPublicKey: string;
      receiverPublicKey: string;
    };
    roles: SettlementRole[];
  }>;

  /**
   * Affirm settlement as sender
   */
  affirmAsSender: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Affirm settlement as receiver
   */
  affirmAsReceiver: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Affirm settlement as mediator
   */
  affirmAsMediator: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    accept?: boolean;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Claim assets as receiver
   */
  claimAssets: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Update sender counter after settlement execution
   */
  updateSenderCounter: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Revert (cancel) sender affirmation
   */
  revertSenderAffirmation: (params: {
    settlementId: string;
    legId: number;
    assetId: string;
    amount?: string | number | bigint;
    onProgress?: (step: string) => void;
  }) => Promise<void>;

  /**
   * Query settlement status from chain
   */
  querySettlementStatus: (settlementId: string) => Promise<{
    status: string;
    pendingAffirmations: number;
    pendingFinalizations: number;
  }>;

  /**
   * Refresh settlements from localStorage
   */
  refreshSettlements: () => void;
}

export const SettlementContext = createContext<
  SettlementContextValue | undefined
>(undefined);
