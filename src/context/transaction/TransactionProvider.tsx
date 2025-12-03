import { TransactionNotification } from '@/components';
import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import { notifications } from '@mantine/notifications';
import type { ApiPromise, SubmittableResult } from '@polkadot/api';
import type { DispatchError } from '@polkadot/types/interfaces';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { TransactionContext } from './TransactionContext';
import type {
  SubmitTransactionParams,
  TransactionResult,
  TransactionState,
  TransactionStatus,
} from './types';
import { TransactionStatus as Status } from './types';

/**
 * Extract human-readable error message from ExtrinsicFailed event data
 */
function extractErrorMessage(
  dispatchError: DispatchError,
  polkadotApi: ApiPromise,
): string {
  if (!dispatchError) {
    return 'Transaction failed on-chain';
  }

  // Handle Module error (most common case)
  if (dispatchError.isModule) {
    try {
      const decoded = polkadotApi.registry.findMetaError(
        dispatchError.asModule as Parameters<
          typeof polkadotApi.registry.findMetaError
        >[0],
      );
      return `${decoded.section}.${decoded.name}: ${decoded.docs
        .join(' ')
        .trim()}`;
    } catch (error) {
      console.error('Failed to decode module error:', error);
      return `Module error: ${String(dispatchError.asModule)}`;
    }
  }

  // Handle other error types
  if (dispatchError.isBadOrigin) {
    return 'Bad origin: The transaction origin is not valid';
  }

  if (dispatchError.isCannotLookup) {
    return 'Cannot lookup: Failed to lookup some data';
  }

  if (dispatchError.isOther) {
    return 'Other error: An unknown error occurred';
  }

  if (dispatchError.isToken) {
    const tokenError =
      dispatchError.asToken?.toString() || 'Unknown token error';
    return `Token error: ${tokenError}`;
  }

  if (dispatchError.isArithmetic) {
    const arithmeticError =
      dispatchError.asArithmetic?.toString() || 'Unknown arithmetic error';
    return `Arithmetic error: ${arithmeticError}`;
  }

  if (dispatchError.isTransactional) {
    const transactionalError =
      dispatchError.asTransactional?.toString() ||
      'Unknown transactional error';
    return `Transactional error: ${transactionalError}`;
  }

  // Fallback to string representation
  return dispatchError.toString() || 'Transaction failed on-chain';
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { selectedAccount, signingManager, polkadotApi } = usePolymesh();
  const { openWalletModal, openKeySelectionModal } = useModal();
  const [transactions, setTransactions] = useState<
    Map<string, TransactionState>
  >(new Map());

  const updateTransaction = useCallback(
    (id: string, updates: Partial<TransactionState>) => {
      setTransactions((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(id);
        if (existing) {
          newMap.set(id, { ...existing, ...updates });
        }
        return newMap;
      });
    },
    [],
  );

  const submitTransaction = useCallback(
    async (params: SubmitTransactionParams): Promise<TransactionResult> => {
      const { tx, tag, onStatusChange } = params;

      if (!signingManager) {
        openWalletModal();
        throw new Error('Please connect your wallet');
      }

      if (!selectedAccount) {
        openKeySelectionModal();
        throw new Error('Please select a signing key');
      }

      if (!polkadotApi) {
        throw new Error('Polkadot API not available');
      }

      // Generate transaction ID
      const txId = `${tag}-${Date.now()}`;

      // Initialize transaction state
      const initialState: TransactionState = {
        id: txId,
        status: Status.Idle,
        tag,
      };

      setTransactions((prev) => new Map(prev).set(txId, initialState));

      // Update to Unapproved - waiting for signature
      const updateStatus = (
        status: TransactionStatus,
        additionalData: Partial<TransactionState> = {},
      ) => {
        const newState: TransactionState = {
          ...initialState,
          status,
          ...additionalData,
        };
        updateTransaction(txId, newState);
        onStatusChange?.(newState);
        return newState;
      };

      updateStatus(Status.Unapproved);

      // Show notification for signing
      const notificationId = notifications.show({
        title: 'Transaction',
        message: 'Please sign transaction in wallet',
        color: 'blue',
        autoClose: false,
        loading: true,
      });

      return new Promise((resolve, reject) => {
        let unsub: (() => void) | undefined;

        // Get the external signer from the signing manager
        const externalSigner = signingManager.getExternalSigner();

        tx.signAndSend(
          selectedAccount.address,
          { signer: externalSigner },
          (result: SubmittableResult) => {
            const { events, status } = result;
            console.log('Transaction status:', status.type);
            const txHash = result.txHash.toString();
            const txIndex = result.txIndex;
            const blockNumber = result.blockNumber?.toNumber();

            try {
              // Transaction approved and ready
              if (status.type === 'Ready') {
                updateStatus(Status.Running, { txHash });
                notifications.update({
                  id: notificationId,
                  title: 'Transaction Submitted',
                  message: `Transaction hash: ${txHash.substring(0, 10)}...`,
                  color: 'blue',
                  autoClose: false,
                  loading: true,
                });
              }

              // Transaction in block
              if (status.isInBlock && status.asInBlock) {
                const blockHash = status.asInBlock.toString();

                // Check for success or failure in events
                let succeeded = false;
                let failed = false;
                let errorMessage = '';
                events.forEach((record) => {
                  const { event } = record;
                  if (polkadotApi.events.system.ExtrinsicSuccess.is(event)) {
                    succeeded = true;
                  } else if (
                    polkadotApi.events.system.ExtrinsicFailed.is(event)
                  ) {
                    failed = true;
                    // Extract human-readable error from DispatchError
                    // data[0] contains the DispatchError
                    const dispatchError = event.data.dispatchError;
                    errorMessage = extractErrorMessage(
                      dispatchError,
                      polkadotApi,
                    );
                  }
                });

                if (succeeded) {
                  updateStatus(Status.Succeeded, {
                    txHash,
                    blockHash,
                    blockNumber,
                    txIndex,
                    events,
                  });

                  notifications.update({
                    id: notificationId,
                    title: 'Transaction In Block',
                    message: (
                      <TransactionNotification
                        tag={tag}
                        txHash={txHash}
                        blockNumber={blockNumber}
                        blockHash={blockHash}
                        txIndex={txIndex}
                      />
                    ),
                    color: 'blue',
                    autoClose: false,
                    loading: true,
                  });
                } else if (failed) {
                  updateStatus(Status.Failed, {
                    txHash,
                    blockHash,
                    blockNumber,
                    txIndex,
                    error: errorMessage,
                  });

                  notifications.update({
                    id: notificationId,
                    title: 'Transaction Failed',
                    message: (
                      <TransactionNotification
                        tag={tag}
                        txHash={txHash}
                        blockNumber={blockNumber}
                        blockHash={blockHash}
                        txIndex={txIndex}
                        error={errorMessage || 'Transaction failed on-chain'}
                      />
                    ),
                    color: 'red',
                    autoClose: false,
                    loading: false,
                  });

                  reject(new Error(errorMessage || 'Transaction failed'));
                  if (unsub) unsub();
                }
              }

              // Transaction finalized
              if (status.isFinalized && status.asFinalized) {
                const finalizedBlockHash = status.asFinalized.toString();
                const currentState = transactions.get(txId);

                updateStatus(Status.Finalized, {
                  ...currentState,
                  finalizedBlockHash,
                  finalizedBlockNumber: blockNumber,
                });

                notifications.update({
                  id: notificationId,
                  title: 'Transaction Finalized',
                  message: (
                    <TransactionNotification
                      tag={tag}
                      txHash={txHash}
                      blockNumber={blockNumber}
                      blockHash={finalizedBlockHash}
                      txIndex={txIndex}
                    />
                  ),
                  color: 'green',
                  autoClose: false, // Persist notification with explorer link
                  loading: false,
                });

                resolve({
                  txHash,
                  blockHash: finalizedBlockHash,
                  blockNumber: blockNumber || 0,
                  txIndex: txIndex || 0,
                  events,
                });

                if (unsub) unsub();
              }
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error('Unknown error');
              updateStatus(Status.Failed, { error: error.message });

              notifications.update({
                id: notificationId,
                title: 'Transaction Error',
                message: error.message,
                color: 'red',
                autoClose: false,
                loading: false,
              });

              reject(error);
              if (unsub) unsub();
            }
          },
        )
          .then((unsubscribe: () => void) => {
            unsub = unsubscribe;
          })
          .catch((err: Error) => {
            // User rejected or other error before submission
            const isRejected =
              err.message?.includes('Cancelled') ||
              err.message?.includes('rejected');

            updateStatus(isRejected ? Status.Rejected : Status.Failed, {
              error: err.message,
            });

            if (isRejected) {
              notifications.hide(notificationId);
              notifications.show({
                title: 'Transaction Rejected',
                message: 'You rejected the transaction',
                color: 'orange',
                autoClose: 3000,
              });
            } else {
              notifications.update({
                id: notificationId,
                title: 'Transaction Error',
                message: err.message || 'Failed to submit transaction',
                color: 'red',
                autoClose: false,
                loading: false,
              });
            }

            reject(err);
          });
      });
    },
    [
      selectedAccount,
      signingManager,
      polkadotApi,
      updateTransaction,
      transactions,
      openWalletModal,
      openKeySelectionModal,
    ],
  );

  const getTransaction = useCallback(
    (id: string): TransactionState | undefined => {
      return transactions.get(id);
    },
    [transactions],
  );

  const clearTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const value = {
    transactions,
    submitTransaction,
    getTransaction,
    clearTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
