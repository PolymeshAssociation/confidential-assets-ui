/**
 * Settlement Provider
 *
 * Manages confidential asset settlement state and operations
 */

import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useTransaction } from '@/hooks/useTransaction';
import {
  affirmSettlementMediator,
  affirmSettlementReceiver,
  affirmSettlementSender,
  claimAssets as claimAssetsService,
  createSettlement as createSettlementService,
  decryptSettlement as decryptSettlementService,
  revertSenderAffirmation as revertSenderAffirmationService,
  updateSenderCounter as updateSenderCounterService,
  type ISettlementLeg,
} from '@/services/confidential/settlement';
import {
  getAccountAssetState,
  saveAccountAssetState,
} from '@/services/storage/assetStorage';
import {
  listSettlementsByAccount,
  saveSettlement,
} from '@/services/storage/settlementStorage';
import type {
  DecryptedLegResult,
  LegAffirmationStatus,
  LegStatus,
  SettlementDetailsChainData,
  SettlementRecord,
  SettlementRole,
} from '@/types/settlement';
import { notifications } from '@mantine/notifications';
import { AccountPublicKeys, AssetState } from '@polymesh/polymesh-dart-wasm';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { SettlementContext } from './SettlementContext';

export function SettlementProvider({ children }: { children: ReactNode }) {
  const { polkadotApi } = usePolymesh();
  const { selectedKey, executeWithKey } = useConfidentialKey();
  const { submitTransaction } = useTransaction();
  const { refreshRegisteredAssets, getAssetDetails } = useAsset();

  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Map of settlement IDs to their records
  const [settlements, setSettlements] = useState<Map<string, SettlementRecord>>(
    new Map(),
  );

  // ============================================================================
  // Load settlements from localStorage when account changes
  // ============================================================================

  useEffect(() => {
    if (!selectedKey) {
      setSettlements(new Map());
      return;
    }

    const accountPublicKey = selectedKey.publicKey;
    const records = listSettlementsByAccount(accountPublicKey);

    const newMap = new Map<string, SettlementRecord>();
    records.forEach((record) => {
      newMap.set(record.settlementId, record);
    });

    setSettlements(newMap);
  }, [selectedKey]);

  // ============================================================================
  // Refresh settlements from localStorage
  // ============================================================================

  const refreshSettlements = useCallback(() => {
    if (!selectedKey) {
      setSettlements(new Map());
      return;
    }

    const accountPublicKey = selectedKey.publicKey;
    const records = listSettlementsByAccount(accountPublicKey);

    const newMap = new Map<string, SettlementRecord>();
    records.forEach((record) => {
      newMap.set(record.settlementId, record);
    });

    setSettlements(newMap);
  }, [selectedKey]);

  // ============================================================================
  // Helper: Calculate roles for a settlement leg
  // ============================================================================

  /**
   * Calculate all roles for a user in a settlement leg
   * @param senderPublicKey - Sender's public key
   * @param receiverPublicKey - Receiver's public key
   * @param assetDetails - Asset details (mediators and auditors)
   * @param userPublicKey - User's public key
   * @returns Array of roles the user has in this leg
   */
  const calculateRolesForLeg = useCallback(
    (
      senderPublicKey: string,
      receiverPublicKey: string,
      assetDetails: { mediators: string[]; auditors: string[] } | null,
      userPublicKey: string,
      userEncryptionPublicKey: string,
    ): SettlementRole[] => {
      const roles: SettlementRole[] = [];
      // Check sender role
      if (senderPublicKey === userPublicKey) {
        roles.push('sender');
      }

      // Check receiver role
      if (receiverPublicKey === userPublicKey) {
        roles.push('receiver');
      }

      // Check mediator/auditor roles if asset details available
      if (assetDetails) {
        // Check mediator

        const isMediator = assetDetails.mediators?.some((mediator) => {
          return mediator === userEncryptionPublicKey;
        });
        if (isMediator) {
          roles.push('mediator');
        }

        // Check auditor
        const isAuditor = assetDetails.auditors?.some((auditor) => {
          return auditor === userEncryptionPublicKey;
        });
        if (isAuditor) {
          roles.push('auditor');
        }
      }

      return roles;
    },
    [],
  );

  // ============================================================================
  // Create Settlement
  // ============================================================================

  const createSettlement = useCallback(
    async (params: {
      legs: {
        assetId: string;
        amount: string;
        receiverPublicKeys: AccountPublicKeys;
        senderPublicKeys: AccountPublicKeys;
      }[];
      memo?: string;
      onProgress?: (step: string) => void;
    }): Promise<{
      settlementId: string;
      txHash: string;
      blockNumber: number;
    }> => {
      if (!polkadotApi) throw new Error('Not connected to chain');
      if (!selectedKey) throw new Error('No key selected');

      const notificationId = `settlement-create-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Creating Settlement',
        message: 'Starting...',
        autoClose: false,
      });

      try {
        const serviceLegs = [];
        // Calculate roles across all legs
        const roles = new Set<SettlementRole>();
        const myPublicKey = selectedKey.publicKey;
        const myEncryptionPublicKey = selectedKey.encryptionPublicKey;

        for (const leg of params.legs) {
          const assetDetails = await getAssetDetails(leg.assetId);
          if (!assetDetails) {
            throw new Error(
              `Asset details not found for asset ID: ${leg.assetId}`,
            );
          }

          const mediators = assetDetails.mediators || [];
          const auditors = assetDetails.auditors || [];
          const assetIdNum = parseInt(leg.assetId, 10);

          const assetState = new AssetState(assetIdNum, mediators, auditors);

          serviceLegs.push({
            amount: leg.amount,
            senderPublicKeys: leg.senderPublicKeys,
            receiverPublicKeys: leg.receiverPublicKeys,
            assetState,
          } satisfies ISettlementLeg);

          // Calculate roles for this leg using helper
          const sender = leg.senderPublicKeys
            .accountPublicKey()
            .toJs() as string;
          const receiver = leg.receiverPublicKeys
            .accountPublicKey()
            .toJs() as string;

          const legRoles = calculateRolesForLeg(
            sender,
            receiver,
            { mediators, auditors },
            myPublicKey,
            myEncryptionPublicKey,
          );

          // Add all roles to the set
          legRoles.forEach((role) => roles.add(role));
        }

        const result = await createSettlementService({
          legs: serviceLegs,
          memo: params.memo,
          polkadotApi,
          submitTransaction,
          onBuildingProof: () => {
            params.onProgress?.('Building proof...');
            notifications.update({
              id: notificationId,
              message: 'Generating zero-knowledge proof...',
            });
          },
          onSubmitting: () => {
            params.onProgress?.('Submitting...');
            notifications.update({
              id: notificationId,
              message: 'Broadcasting transaction...',
            });
          },
        });

        const record: SettlementRecord = {
          version: 1,
          settlementId: result.settlementId,
          accountPublicKey: selectedKey.publicKey,
          roles: Array.from(roles),
          createdAt: Date.now(),
        };
        saveSettlement(record);

        // Refresh settlements
        refreshSettlements();

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Settlement Created',
          message: `Settlement ID: ${result.settlementId}`,
          color: 'green',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');

        return {
          settlementId: result.settlementId,
          txHash: result.txHash,
          blockNumber: result.blockNumber,
        };
      } catch (err) {
        console.error('[Settlement Provider] Create failed:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Create Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshSettlements,
      getAssetDetails,
      calculateRolesForLeg,
    ],
  );

  // ============================================================================
  // Decrypt Settlement
  // ============================================================================

  const decryptSettlement = useCallback(
    async (params: { settlementId: string; legId: number }) => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-decrypt-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Decrypting Settlement',
        message: 'Retrieving encrypted leg data...',
        autoClose: false,
      });

      // Small delay to allow toast to render before heavy computation
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const result = await executeWithKey({ operation: async (accountKeys) => {
          const decryptResult = await decryptSettlementService({
            settlementId: params.settlementId,
            legId: params.legId,
            polkadotApi,
            accountKeys,
          });

          return decryptResult;
        }});

        // Fetch asset details to calculate roles
        const assetDetails = await getAssetDetails(result.leg.assetId);

        if (!selectedKey) throw new Error('No active key found');

        // Calculate roles using helper
        const roles = calculateRolesForLeg(
          result.leg.senderPublicKey,
          result.leg.receiverPublicKey,
          assetDetails
            ? {
                mediators: assetDetails.mediators || [],
                auditors: assetDetails.auditors || [],
              }
            : null,
          selectedKey.publicKey,
          selectedKey.encryptionPublicKey,
        );

        // Save/update settlement record
        const existingRecord = settlements.get(params.settlementId);

        if (existingRecord) {
          // Update existing record if new roles found
          const existingRoles = new Set(existingRecord.roles);
          let hasNewRole = false;

          roles.forEach((role) => {
            if (!existingRoles.has(role)) {
              existingRoles.add(role);
              hasNewRole = true;
            }
          });

          if (hasNewRole) {
            const updatedRecord: SettlementRecord = {
              ...existingRecord,
              roles: Array.from(existingRoles),
            };
            saveSettlement(updatedRecord);
            refreshSettlements();
          }
        } else {
          // Create new record
          const record: SettlementRecord = {
            version: 1,
            settlementId: params.settlementId,
            accountPublicKey: selectedKey.publicKey,
            roles,
            createdAt: Date.now(),
          };

          saveSettlement(record);
          refreshSettlements();
        }

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Settlement Decrypted',
          message: `Retrieved encrypted data for leg ${result.leg.legId}`,
          color: 'green',
          autoClose: 5000,
        });

        return {
          ...result,
          roles,
        };
      } catch (err) {
        console.error('[Settlement Provider] Decrypt failed:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Decrypt Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      settlements,
      refreshSettlements,
      getAssetDetails,
      calculateRolesForLeg,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Affirm as Sender
  // ============================================================================

  const affirmAsSender = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      onProgress?: (step: string) => void;
      suppressNotifications?: boolean;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-affirm-sender-${Date.now()}`;
      if (!params.suppressNotifications) {
        notifications.show({
          id: notificationId,
          loading: true,
          title: 'Affirming as Sender',
          message: 'Starting...',
          autoClose: false,
        });
      }

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          if (!selectedKey) throw new Error('No active key found');

          // Get account asset state from storage
          const storedState = getAccountAssetState(
            selectedKey.publicKey,
            params.assetId,
          );
          if (!storedState) {
            throw new Error(
              'Account asset state not found. Please register for this asset first.',
            );
          }

          const result = await affirmSettlementSender({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            stateBytes: storedState.stateBytes,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Generating zero-knowledge proof...',
                });
              }
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Broadcasting transaction...',
                });
              }
            },
          });

          // Update stored state with new leaf index
          storedState.stateBytes = result.updatedStateBytes;
          storedState.leafIndex = result.newLeafIndex;
          storedState.updatedAt = Date.now();

          // Save using the asset storage service
          saveAccountAssetState(storedState);
        }});

        // Refresh asset balances
        await refreshRegisteredAssets();

        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Sender Affirmation Complete',
            message: 'Settlement affirmed successfully',
            color: 'green',
            autoClose: 5000,
          });
        }

        params.onProgress?.('Complete');
      } catch (err) {
        console.error('[Settlement Provider] Sender affirmation failed:', err);
        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Affirmation Failed',
            message: err instanceof Error ? err.message : 'Unknown error',
            color: 'red',
            autoClose: false,
          });
        }
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshRegisteredAssets,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Affirm as Receiver
  // ============================================================================

  const affirmAsReceiver = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      onProgress?: (step: string) => void;
      suppressNotifications?: boolean;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-affirm-receiver-${Date.now()}`;
      if (!params.suppressNotifications) {
        notifications.show({
          id: notificationId,
          loading: true,
          title: 'Affirming as Receiver',
          message: 'Starting...',
          autoClose: false,
        });
      }

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          if (!selectedKey) throw new Error('No active key found');

          // Get account asset state from storage
          const storedState = getAccountAssetState(
            selectedKey.publicKey,
            params.assetId,
          );
          if (!storedState) {
            throw new Error(
              'Account asset state not found. Please register for this asset first.',
            );
          }

          const result = await affirmSettlementReceiver({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            stateBytes: storedState.stateBytes,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Generating zero-knowledge proof...',
                });
              }
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Broadcasting transaction...',
                });
              }
            },
          });

          // Update stored state with new leaf index
          storedState.stateBytes = result.updatedStateBytes;
          storedState.leafIndex = result.newLeafIndex;
          storedState.updatedAt = Date.now();

          // Save using the asset storage service
          saveAccountAssetState(storedState);
        }});

        // Refresh asset balances
        await refreshRegisteredAssets();

        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Receiver Affirmation Complete',
            message: 'Settlement affirmed successfully',
            color: 'green',
            autoClose: 5000,
          });
        }

        params.onProgress?.('Complete');
      } catch (err) {
        console.error(
          '[Settlement Provider] Receiver affirmation failed:',
          err,
        );
        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Affirmation Failed',
            message: err instanceof Error ? err.message : 'Unknown error',
            color: 'red',
            autoClose: false,
          });
        }
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshRegisteredAssets,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Affirm as Mediator
  // ============================================================================

  const affirmAsMediator = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      accept?: boolean;
      onProgress?: (step: string) => void;
      suppressNotifications?: boolean;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const isRejection = params.accept === false;
      const actionName = isRejection ? 'Rejecting' : 'Affirming';
      const actionPast = isRejection ? 'Rejected' : 'Affirmed';

      const notificationId = `settlement-affirm-mediator-${Date.now()}`;
      if (!params.suppressNotifications) {
        notifications.show({
          id: notificationId,
          loading: true,
          title: `${actionName} as Mediator`,
          message: 'Starting...',
          autoClose: false,
        });
      }

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          await affirmSettlementMediator({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            accept: params.accept,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Generating zero-knowledge proof...',
                });
              }
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Broadcasting transaction...',
                });
              }
            },
          });
        }});

        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: `Mediator ${actionName} Complete`,
            message: `Settlement ${actionPast.toLowerCase()} successfully`,
            color: 'green',
            autoClose: 5000,
          });
        }

        params.onProgress?.('Complete');
      } catch (err) {
        console.error(
          `[Settlement Provider] Mediator ${actionName.toLowerCase()} failed:`,
          err,
        );
        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: `${actionName} Failed`,
            message: err instanceof Error ? err.message : 'Unknown error',
            color: 'red',
            autoClose: false,
          });
        }
        throw err;
      }
    },
    [polkadotApi, submitTransaction, executeWithKey],
  );

  // ============================================================================
  // Claim Assets
  // ============================================================================

  const claimAssets = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      onProgress?: (step: string) => void;
      suppressNotifications?: boolean;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-claim-${Date.now()}`;
      if (!params.suppressNotifications) {
        notifications.show({
          id: notificationId,
          loading: true,
          title: 'Claiming Assets',
          message: 'Starting...',
          autoClose: false,
        });
      }

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          if (!selectedKey) throw new Error('No active key found');

          // Get account asset state from storage
          const storedState = getAccountAssetState(
            selectedKey.publicKey,
            params.assetId,
          );
          if (!storedState) {
            throw new Error(
              'Account asset state not found. Please register for this asset first.',
            );
          }

          const result = await claimAssetsService({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            stateBytes: storedState.stateBytes,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Generating zero-knowledge proof...',
                });
              }
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              if (!params.suppressNotifications) {
                notifications.update({
                  id: notificationId,
                  message: 'Broadcasting transaction...',
                });
              }
            },
          });

          // Update stored state with new leaf index
          storedState.stateBytes = result.updatedStateBytes;
          storedState.leafIndex = result.newLeafIndex;
          storedState.updatedAt = Date.now();

          // Save using the asset storage service
          saveAccountAssetState(storedState);
        }});

        // Refresh asset balances to show credited amount
        await refreshRegisteredAssets();

        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Assets Claimed',
            message: 'Assets successfully claimed to your account',
            color: 'green',
            autoClose: 5000,
          });
        }

        params.onProgress?.('Complete');
      } catch (err) {
        console.error('[Settlement Provider] Claim failed:', err);
        if (!params.suppressNotifications) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'Claim Failed',
            message: err instanceof Error ? err.message : 'Unknown error',
            color: 'red',
            autoClose: false,
          });
        }
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshRegisteredAssets,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Update Sender Counter
  // ============================================================================

  const updateSenderCounter = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      onProgress?: (step: string) => void;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-update-counter-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Updating Counter',
        message: 'Starting...',
        autoClose: false,
      });

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          if (!selectedKey) throw new Error('No active key found');

          const storedState = getAccountAssetState(
            selectedKey.publicKey,
            params.assetId,
          );
          if (!storedState) {
            throw new Error(
              'Account asset state not found. Please register for this asset first.',
            );
          }

          const result = await updateSenderCounterService({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            stateBytes: storedState.stateBytes,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              notifications.update({
                id: notificationId,
                message: 'Generating zero-knowledge proof...',
              });
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              notifications.update({
                id: notificationId,
                message: 'Broadcasting transaction...',
              });
            },
          });

          storedState.stateBytes = result.updatedStateBytes;
          storedState.leafIndex = result.newLeafIndex;
          storedState.updatedAt = Date.now();

          saveAccountAssetState(storedState);
        }});

        await refreshRegisteredAssets();

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Counter Updated',
          message: 'Transaction counter updated successfully',
          color: 'green',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');
      } catch (err) {
        console.error('[Settlement Provider] Update counter failed:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Update Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshRegisteredAssets,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Revert Sender Affirmation
  // ============================================================================

  const revertSenderAffirmation = useCallback(
    async (params: {
      settlementId: string;
      legId: number;
      assetId: string;
      amount?: string | number | bigint;
      onProgress?: (step: string) => void;
    }): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      const notificationId = `settlement-revert-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Reverting Affirmation',
        message: 'Starting...',
        autoClose: false,
      });

      try {
        await executeWithKey({ operation: async (accountKeys) => {
          if (!selectedKey) throw new Error('No active key found');

          const storedState = getAccountAssetState(
            selectedKey.publicKey,
            params.assetId,
          );
          if (!storedState) {
            throw new Error(
              'Account asset state not found. Please register for this asset first.',
            );
          }

          const result = await revertSenderAffirmationService({
            settlementId: params.settlementId,
            legId: params.legId,
            assetId: params.assetId,
            amount: params.amount,
            stateBytes: storedState.stateBytes,
            polkadotApi,
            accountKeys,
            submitTransaction,
            onBuildingProof: () => {
              params.onProgress?.('Building proof...');
              notifications.update({
                id: notificationId,
                message: 'Generating zero-knowledge proof...',
              });
            },
            onSubmitting: () => {
              params.onProgress?.('Submitting...');
              notifications.update({
                id: notificationId,
                message: 'Broadcasting transaction...',
              });
            },
          });

          storedState.stateBytes = result.updatedStateBytes;
          storedState.leafIndex = result.newLeafIndex;
          storedState.updatedAt = Date.now();

          saveAccountAssetState(storedState);
        }});

        await refreshRegisteredAssets();

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Affirmation Reverted',
          message: 'Assets unlocked and available again',
          color: 'green',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');
      } catch (err) {
        console.error('[Settlement Provider] Revert failed:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Revert Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      submitTransaction,
      refreshRegisteredAssets,
      executeWithKey,
    ],
  );

  // ============================================================================
  // Query Settlement Status
  // ============================================================================

  const querySettlementStatus = useCallback(
    async (settlementId: string) => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      // Use settlementId directly (API handles the type)
      // settlementId is expected to be a hex string representing the 32-byte SettlementRef

      // Query settlement status
      const statusOption =
        await polkadotApi.query.confidentialAssets.settlementState(
          settlementId,
        );

      if (statusOption.isNone) {
        throw new Error('Settlement not found on chain');
      }

      const status = statusOption.unwrap().toString();

      // Query pending affirmations and finalizations
      const [pendingAffirmations, pendingFinalizations] = await Promise.all([
        polkadotApi.query.confidentialAssets.settlementPendingAffirmations(
          settlementId,
        ),
        polkadotApi.query.confidentialAssets.settlementPendingFinalizations(
          settlementId,
        ),
      ]);

      return {
        status,
        pendingAffirmations: pendingAffirmations.toNumber(),
        pendingFinalizations: pendingFinalizations.toNumber(),
      };
    },
    [polkadotApi],
  );

  // ============================================================================
  // Query Settlement Details (with legs and affirmations)
  // ============================================================================

  const querySettlementDetails = useCallback(
    async (settlementId: string): Promise<SettlementDetailsChainData> => {
      if (!polkadotApi) throw new Error('Not connected to chain');

      // Query settlement status
      const status = await querySettlementStatus(settlementId);

      // Query settlement memo (optional)
      const memoOption =
        await polkadotApi.query.confidentialAssets.settlementMemo(settlementId);
      const memo = memoOption.isSome ? memoOption.unwrap().toUtf8() : undefined;

      // Query all settlement legs
      const legEntries =
        await polkadotApi.query.confidentialAssets.settlementLegs.entries(
          settlementId,
        );

      const legIds = legEntries
        .map(([key]) => key.args[1].toNumber())
        .sort((a, b) => a - b);

      // Query affirmation status for all legs in parallel
      const legAffirmations = new Map<number, LegAffirmationStatus>();

      const affirmationPromises = legIds.map(async (legId) => {
        const affirmEntries =
          await polkadotApi.query.confidentialAssets.legAffirmationStatus.entries(
            settlementId,
            legId,
          );

        const affirmStatus: LegAffirmationStatus = {
          sender: 'Pending',
          receiver: 'Pending',
          mediators: new Map(),
        };

        for (const [key, value] of affirmEntries) {
          const party = key.args[2];

          if (value.isSome) {
            const statusValue = value.unwrap().toString() as LegStatus;

            if (party.isSender) {
              affirmStatus.sender = statusValue;
            } else if (party.isReceiver) {
              affirmStatus.receiver = statusValue;
            } else if (party.isMediator) {
              const mediatorIndex = party.asMediator.toNumber();
              affirmStatus.mediators.set(mediatorIndex, statusValue);
            }
          }
        }

        return { legId, affirmStatus };
      });

      const affirmationResults = await Promise.all(affirmationPromises);
      affirmationResults.forEach(({ legId, affirmStatus }) => {
        legAffirmations.set(legId, affirmStatus);
      });

      return {
        settlementId,
        status: status.status,
        pendingAffirmations: status.pendingAffirmations,
        pendingFinalizations: status.pendingFinalizations,
        legIds,
        legAffirmations,
        memo,
      };
    },
    [polkadotApi, querySettlementStatus],
  );

  // ============================================================================
  // Decrypt All Legs (Batch)
  // ============================================================================

  const decryptAllLegs = useCallback(
    async (params: {
      settlementId: string;
      onLegDecrypted?: (result: DecryptedLegResult) => void;
      onProgress?: (step: string) => void;
      maxConcurrency?: number;
    }): Promise<DecryptedLegResult[]> => {
      if (!polkadotApi) throw new Error('Not connected to chain');
      if (!selectedKey) throw new Error('No key selected');

      const notificationId = `settlement-decrypt-all-${Date.now()}`;
      const maxConcurrency = params.maxConcurrency || 5;

      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Decrypting Settlement Legs',
        message: 'Querying legs...',
        autoClose: false,
      });

      try {
        // Get all leg IDs
        const legEntries =
          await polkadotApi.query.confidentialAssets.settlementLegs.entries(
            params.settlementId,
          );

        const legIds = legEntries
          .map(([key]) => key.args[1].toNumber())
          .sort((a, b) => a - b);

        if (legIds.length === 0) {
          notifications.update({
            id: notificationId,
            loading: false,
            title: 'No Legs Found',
            message: 'This settlement has no legs',
            color: 'yellow',
            autoClose: 5000,
          });
          return [];
        }

        params.onProgress?.(`Found ${legIds.length} legs`);
        notifications.update({
          id: notificationId,
          message: `Decrypting ${legIds.length} legs...`,
        });

        // Decrypt all legs within a single executeWithKey call (one password prompt)
        const results = await executeWithKey({ operation: async (accountKeys) => {
          const allResults: DecryptedLegResult[] = [];
          let successCount = 0;
          let failedCount = 0;
          let notInvolvedCount = 0;

          // Process legs in batches with max concurrency
          for (let i = 0; i < legIds.length; i += maxConcurrency) {
            const batch = legIds.slice(i, i + maxConcurrency);

            const batchPromises = batch.map(async (legId) => {
              try {
                const decryptResult = await decryptSettlementService({
                  settlementId: params.settlementId,
                  legId,
                  polkadotApi,
                  accountKeys,
                });

                // Fetch asset details to calculate roles
                const assetDetails = await getAssetDetails(
                  decryptResult.leg.assetId,
                );

                // Calculate roles using helper
                const roles = calculateRolesForLeg(
                  decryptResult.leg.senderPublicKey,
                  decryptResult.leg.receiverPublicKey,
                  assetDetails
                    ? {
                        mediators: assetDetails.mediators || [],
                        auditors: assetDetails.auditors || [],
                      }
                    : null,
                  selectedKey.publicKey,
                  selectedKey.encryptionPublicKey,
                );

                const result: DecryptedLegResult = {
                  status: 'success',
                  legId,
                  leg: decryptResult.leg,
                  roles,
                };

                successCount++;
                params.onLegDecrypted?.(result);
                params.onProgress?.(
                  `Processed ${successCount + failedCount + notInvolvedCount}/${legIds.length}`,
                );

                return result;
              } catch (err) {
                // Determine if this is a "not involved" case or actual failure
                const errorMsg =
                  err instanceof Error ? err.message : String(err);
                const isNotInvolved = errorMsg.includes(
                  'You are not involved in this transfer leg',
                );

                if (isNotInvolved) {
                  notInvolvedCount++;
                  const result: DecryptedLegResult = {
                    status: 'not-involved',
                    legId,
                  };
                  params.onLegDecrypted?.(result);
                  params.onProgress?.(
                    `Processed ${successCount + failedCount + notInvolvedCount}/${legIds.length}`,
                  );
                  return result;
                } else {
                  failedCount++;
                  const result: DecryptedLegResult = {
                    status: 'failed',
                    legId,
                    error: errorMsg,
                  };
                  params.onLegDecrypted?.(result);
                  params.onProgress?.(
                    `Processed ${successCount + failedCount + notInvolvedCount}/${legIds.length}`,
                  );
                  return result;
                }
              }
            });

            // Wait for batch to complete
            const batchResults = await Promise.all(batchPromises);
            allResults.push(...batchResults);
          }

          // Save/update settlement record with discovered roles
          const allRoles = new Set<SettlementRole>();
          allResults.forEach((result) => {
            if (result.status === 'success') {
              result.roles.forEach((role) => allRoles.add(role));
            }
          });

          if (allRoles.size > 0) {
            const existingRecord = settlements.get(params.settlementId);

            if (existingRecord) {
              // Update existing record if new roles found
              const existingRoles = new Set(existingRecord.roles);
              let hasNewRole = false;

              allRoles.forEach((role) => {
                if (!existingRoles.has(role)) {
                  existingRoles.add(role);
                  hasNewRole = true;
                }
              });

              if (hasNewRole) {
                const updatedRecord: SettlementRecord = {
                  ...existingRecord,
                  roles: Array.from(existingRoles),
                };
                saveSettlement(updatedRecord);
                refreshSettlements();
              }
            } else {
              // Create new record
              const record: SettlementRecord = {
                version: 1,
                settlementId: params.settlementId,
                accountPublicKey: selectedKey.publicKey,
                roles: Array.from(allRoles),
                createdAt: Date.now(),
              };
              saveSettlement(record);
              refreshSettlements();
            }
          }

          return allResults;
        }});

        // Final notification
        const successCount = results.filter(
          (r) => r.status === 'success',
        ).length;
        const notInvolvedCount = results.filter(
          (r) => r.status === 'not-involved',
        ).length;
        const failedCount = results.filter((r) => r.status === 'failed').length;

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Decryption Complete',
          message: `Decrypted ${successCount} of ${legIds.length} legs${notInvolvedCount > 0 ? ` (${notInvolvedCount} not involved)` : ''}${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
          color: successCount > 0 ? 'green' : 'yellow',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');

        return results;
      } catch (err) {
        console.error('[Settlement Provider] Batch decrypt failed:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Decryption Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [
      polkadotApi,
      selectedKey,
      executeWithKey,
      getAssetDetails,
      calculateRolesForLeg,
      settlements,
      refreshSettlements,
    ],
  );

  // ============================================================================
  // Context Value
  // ============================================================================

  const value = {
    settlements,
    isLoading,
    error,
    createSettlement,
    decryptSettlement,
    decryptAllLegs,
    querySettlementStatus,
    querySettlementDetails,
    affirmAsSender,
    affirmAsReceiver,
    affirmAsMediator,
    claimAssets,
    updateSenderCounter,
    revertSenderAffirmation,
    refreshSettlements,
  };

  return (
    <SettlementContext.Provider value={value}>
      {children}
    </SettlementContext.Provider>
  );
}
