import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

export const TransactionStatus = {
  Idle: 'Idle',
  Unapproved: 'Unapproved',
  Running: 'Running',
  Succeeded: 'Succeeded',
  Finalized: 'Finalized',
  Failed: 'Failed',
  Rejected: 'Rejected',
  Aborted: 'Aborted',
} as const;

export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export interface TransactionState {
  id: string;
  status: TransactionStatus;
  tag: string; // e.g., 'confidentialAssets.registerAccounts'
  txHash?: string;
  blockHash?: string;
  blockNumber?: number;
  txIndex?: number;
  finalizedBlockHash?: string;
  finalizedBlockNumber?: number;
  error?: string;
  events?: EventRecord[]; // Events from the transaction result
}

export interface TransactionContextValue {
  transactions: Map<string, TransactionState>;
  submitTransaction: (
    params: SubmitTransactionParams,
  ) => Promise<TransactionResult>;
  getTransaction: (id: string) => TransactionState | undefined;
  clearTransaction: (id: string) => void;
}

export interface SubmitTransactionParams {
  tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
  tag: string;
  onStatusChange?: (state: TransactionState) => void;
}

export interface TransactionResult {
  txHash: string;
  blockHash: string;
  blockNumber: number;
  txIndex: number;
  events: EventRecord[]; // Events from finalized transaction
}
