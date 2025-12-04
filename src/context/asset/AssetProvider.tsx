/**
 * Asset Provider
 *
 * Manages confidential asset state and operations
 */

import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useTransaction } from '@/hooks/useTransaction';
import {
  createConfidentialAsset,
  mintConfidentialAsset,
  registerConfidentialAsset,
} from '@/services/confidential';
import {
  getAccountAssetState,
  saveAccountAssetState,
} from '@/services/storage/assetStorage';
import type { AssetDetails, AssetMetadata } from '@/types/asset';
import { decodeMetadata } from '@/utils/metadata';
import { notifications } from '@mantine/notifications';
import { base64Decode } from '@polkadot/util-crypto';
import { AccountAssetState } from '@polymesh/polymesh-dart-wasm';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AssetContext } from './AssetContext';
import type {
  CreateAssetParams,
  MintAssetParams,
  MintAssetResult,
  RegisterAssetParams,
} from './types';

export function AssetProvider({ children }: { children: ReactNode }) {
  const { polkadotApi, selectedAccount, accountIdentity, sdk } = usePolymesh();
  const { selectedKey, executeWithKey } = useConfidentialKey();
  const { submitTransaction } = useTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single source of truth for asset details from chain - using ref to avoid re-renders
  const assetDetailsMapRef = useRef<Map<string, AssetDetails>>(new Map());

  // Asset IDs owned by current DID
  const [ownedAssetIds, setOwnedAssetIds] = useState<string[]>([]);

  // Balances for assets registered to selected confidential account
  const [registeredAssetBalances, setRegisteredAssetBalances] = useState<
    Map<string, string>
  >(new Map());

  const [ownedAssets, setOwnedAssets] = useState<AssetDetails[]>([]);
  const [registeredAssets, setRegisteredAssets] = useState<
    (AssetDetails & { balance?: string })[]
  >([]);

  // Fetch asset details from chain and update the map
  // Set forceRefresh=true to skip cache check (e.g., after minting to get updated totalSupply)
  const fetchAssetDetails = useCallback(
    async (
      assetId: string,
      forceRefresh = false,
    ): Promise<AssetDetails | null> => {
      if (!polkadotApi) return null;

      // Return cached if available and not force refresh
      if (!forceRefresh && assetDetailsMapRef.current.has(assetId)) {
        return assetDetailsMapRef.current.get(assetId)!;
      }

      try {
        // Query all asset details in parallel
        const [details, nameOption, symbolOption, decimalsOption] =
          await Promise.all([
            polkadotApi.query.confidentialAssets.dartAssetDetails(assetId),
            polkadotApi.query.confidentialAssets.confidentialAssetNames(
              assetId,
            ),
            polkadotApi.query.confidentialAssets.confidentialAssetSymbols(
              assetId,
            ),
            polkadotApi.query.confidentialAssets.confidentialAssetDecimals(
              assetId,
            ),
          ]);

        if (details.isSome) {
          const assetDetail = details.unwrap();
          const totalSupply = assetDetail.totalSupply.toString();
          const ownerDid = assetDetail.ownerDid.toString();
          const dataBytes = assetDetail.data;

          // Extract name, symbol, and decimals from separate storage queries
          const name = nameOption.isSome ? nameOption.unwrap().toString() : '';
          const symbol = symbolOption.isSome
            ? symbolOption.unwrap().toString()
            : '';
          const decimals = decimalsOption.isSome
            ? decimalsOption.unwrap().toNumber()
            : 0;

          // Extract mediators
          const mediators: string[] = [];
          for (const mediator of assetDetail.mediators) {
            mediators.push(mediator.toString());
          }

          // Extract auditors
          const auditors: string[] = [];
          for (const auditor of assetDetail.auditors) {
            auditors.push(auditor.toString());
          }

          // Try to decode metadata from chain data
          let metadata: AssetMetadata | undefined;
          if (dataBytes && dataBytes.length > 0) {
            try {
              const dataStr = new TextDecoder().decode(dataBytes);
              metadata = decodeMetadata(dataStr);
            } catch (err) {
              console.error(
                '[Asset Provider] Could not parse metadata for asset',
                assetId,
                err,
              );
            }
          }

          // Update the asset details map
          const assetDetails: AssetDetails = {
            assetId,
            name,
            symbol,
            decimals,
            totalSupply,
            ownerDid,
            metadata,
            mediators,
            auditors,
            fetchedAt: Date.now(),
          };

          // Update cache directly via ref
          assetDetailsMapRef.current.set(assetId, assetDetails);

          return assetDetails;
        } else {
          return null;
        }
      } catch (err) {
        console.error(
          '[Asset Provider] Failed to fetch asset details for',
          assetId,
          err,
        );
        return null;
      }
    },
    [polkadotApi],
  );

  // Public method to get asset details (fetches if not cached)
  const getAssetDetails = useCallback(
    async (assetId: string): Promise<AssetDetails | null> => {
      return fetchAssetDetails(assetId, false);
    },
    [fetchAssetDetails],
  );

  // Load owned assets - query chain for asset IDs owned by current DID
  const refreshOwnedAssets = useCallback(async () => {
    if (!polkadotApi || !sdk || !accountIdentity) {
      setOwnedAssetIds([]);
      setOwnedAssets([]);
      return;
    }

    try {
      setIsLoading(true);

      // Query assets owned by this DID
      const ownedAssetsKeys =
        await polkadotApi.query.confidentialAssets.ownerAssets.keys(
          accountIdentity,
        );
      const assetIds = ownedAssetsKeys.map(({ args: [, id] }) => id.toString());

      // Update owned asset IDs
      setOwnedAssetIds(assetIds);

      // Fetch details for each asset (will skip if already cached)
      for (const assetId of assetIds) {
        await fetchAssetDetails(assetId);
      }

      // Compute owned assets array from fetched details
      const owned = assetIds
        .map((id) => assetDetailsMapRef.current.get(id))
        .filter((details): details is AssetDetails => details !== undefined);
      setOwnedAssets(owned);
    } catch (err) {
      console.error('[Asset Provider] Failed to refresh owned assets:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load owned assets',
      );
    } finally {
      setIsLoading(false);
    }
  }, [polkadotApi, sdk, accountIdentity, fetchAssetDetails]);

  // Load registered assets - query chain for registered assets and their balances
  const refreshRegisteredAssets = useCallback(async () => {
    if (!polkadotApi || !selectedKey) {
      setRegisteredAssetBalances(new Map());
      return;
    }

    try {
      setIsLoading(true);

      // Query assets registered to this confidential account
      const entries =
        await polkadotApi.query.confidentialAssets.accountAssetRegistrations.entries(
          selectedKey.publicKey,
        );

      const balances = new Map<string, string>();

      for (const [key] of entries) {
        const assetId = key.args[1].toString();

        // Fetch asset details (will skip if already cached)
        await fetchAssetDetails(assetId);

        // Get balance from stored state
        const storedState = getAccountAssetState(
          selectedKey.publicKey,
          assetId,
        );
        if (storedState) {
          try {
            const stateData = base64Decode(storedState.stateBytes);
            const accountAssetState = AccountAssetState.fromBytes(stateData);
            const balance = accountAssetState.balance().toString();
            balances.set(assetId, balance);
          } catch (err) {
            console.error(
              '[Asset Provider] Failed to decode account state for',
              assetId,
              err,
            );
          }
        }
      }

      setRegisteredAssetBalances(balances);

      // Compute registered assets array from fetched details and balances
      const registered = Array.from(balances.entries())
        .map(([assetId, balance]) => {
          const details = assetDetailsMapRef.current.get(assetId);
          if (!details) return null;
          return { ...details, balance };
        })
        .filter(
          (asset): asset is AssetDetails & { balance: string } =>
            asset !== null,
        );
      setRegisteredAssets(registered);
    } catch (err) {
      console.error(
        '[Asset Provider] Failed to refresh registered assets:',
        err,
      );
      setError(
        err instanceof Error ? err.message : 'Failed to load registered assets',
      );
    } finally {
      setIsLoading(false);
    }
  }, [polkadotApi, selectedKey, fetchAssetDetails]);

  // Refresh owned assets when selected account identity changes
  useEffect(() => {
    if (polkadotApi && sdk) {
      refreshOwnedAssets();
    }
  }, [polkadotApi, sdk, refreshOwnedAssets]);

  // Refresh registered assets when selected key changes
  useEffect(() => {
    if (selectedKey && polkadotApi) {
      refreshRegisteredAssets();
    }
  }, [selectedKey, polkadotApi, refreshRegisteredAssets]);

  // Create asset operation
  const createAsset = useCallback(
    async (params: CreateAssetParams): Promise<string> => {
      if (!polkadotApi) throw new Error('Not connected to Polymesh');
      if (!selectedAccount) throw new Error('No account selected');
      const notificationId = `create-asset-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Creating Asset',
        message: 'Encoding metadata and building transaction...',
        autoClose: false,
      });

      try {
        const result = await createConfidentialAsset({
          name: params.name,
          symbol: params.symbol,
          decimals: params.decimals,
          metadata: params.metadata,
          mediators: params.mediators,
          auditors: params.auditors,
          polkadotApi,
          submitTransaction,
        });

        // Refresh owned assets
        await refreshOwnedAssets();

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Asset Created',
          message: `Asset ${params.name} created successfully!`,
          color: 'green',
          autoClose: 5000,
        });

        return result.assetId;
      } catch (err) {
        console.error('[Asset Provider] Failed to create asset:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Asset Creation Failed',
          message: err instanceof Error ? err.message : 'Unknown error',
          color: 'red',
          autoClose: false,
        });
        throw err;
      }
    },
    [polkadotApi, selectedAccount, submitTransaction, refreshOwnedAssets],
  );

  // Register asset operation
  const registerAsset = useCallback(
    async (params: RegisterAssetParams): Promise<void> => {
      if (!polkadotApi) throw new Error('Not connected to Polymesh');
      if (!selectedKey) throw new Error('No confidential account selected');
      if (!sdk) throw new Error('SDK not initialized');

      const identity = await sdk.getSigningIdentity();
      if (!identity) throw new Error('No signing identity found');
      const did = identity.did;

      const notificationId = `register-asset-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Registering Asset',
        message: 'Generating registration proof...',
        autoClose: false,
      });

      try {
        await executeWithKey({
          operation: async (accountKeys) => {
            const result = await registerConfidentialAsset({
              assetId: parseInt(params.assetId, 10),
              did,
              polkadotApi,
              accountKeys,
              submitTransaction,
              onProofGenerating: () => {
                params.onProgress?.('Generating proof...');
                notifications.update({
                  id: notificationId,
                  message: 'Generating zero-knowledge proof...',
                });
              },
              onProofGenerated: () => {
                params.onProgress?.('Submitting transaction...');
                notifications.update({
                  id: notificationId,
                  message: 'Proof generated, submitting transaction...',
                });
              },
            });

            // Save account asset state
            saveAccountAssetState(result.accountAssetState);
          },
        });

        // Refresh registered assets
        await refreshRegisteredAssets();

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Asset Registered',
          message: 'Successfully registered with asset!',
          color: 'green',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');
      } catch (err) {
        console.error('[Asset Provider] Failed to register asset:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Registration Failed',
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
      sdk,
      executeWithKey,
      refreshRegisteredAssets,
      submitTransaction,
    ],
  );

  // Mint asset operation
  const mintAsset = useCallback(
    async (params: MintAssetParams): Promise<MintAssetResult> => {
      if (!polkadotApi) {
        throw new Error('Not connected to Polymesh');
      }

      const notificationId = `mint-asset-${Date.now()}`;
      notifications.show({
        id: notificationId,
        loading: true,
        title: 'Minting Asset',
        message: 'Preparing to mint...',
        autoClose: false,
      });

      try {
        const result = await executeWithKey({
          operation: async (accountKeys) => {
            if (!selectedKey) {
              throw new Error('No key selected');
            }

            const storedState = getAccountAssetState(
              selectedKey.publicKey,
              params.assetId,
            );

            if (!storedState) {
              throw new Error(
                'Account not registered with this asset. Please register first.',
              );
            }

            const mintResult = await mintConfidentialAsset({
              amount: parseInt(params.amount, 10),
              stateBytes: storedState.stateBytes,
              polkadotApi,
              accountKeys,
              submitTransaction,
              onGeneratingProof: () => {
                params.onProgress?.('Generating proof...');
                notifications.update({
                  id: notificationId,
                  message:
                    'Generating zero-knowledge proof (including curve tree leaf path construction)...',
                });
              },
              onSubmittingTransaction: () => {
                params.onProgress?.('Submitting transaction...');
                notifications.update({
                  id: notificationId,
                  message:
                    'Broadcasting transaction and awaiting confirmation...',
                });
              },
            });

            // Update stored state
            saveAccountAssetState({
              ...storedState,
              stateBytes: mintResult.updatedStateBytes,
              leafIndex: mintResult.newLeafIndex,
              updatedAt: Date.now(),
            });

            return mintResult;
          },
        });

        // Update the balance for this specific asset
        try {
          const stateData = base64Decode(result.updatedStateBytes);
          const accountAssetState = AccountAssetState.fromBytes(stateData);
          const newBalance = accountAssetState.balance().toString();

          setRegisteredAssetBalances((prev) => {
            const newBalances = new Map(prev);
            newBalances.set(params.assetId, newBalance);
            return newBalances;
          });
        } catch (err) {
          console.error(
            '[Asset Provider] Failed to decode updated balance:',
            err,
          );
        }

        // Force refresh asset details to get updated totalSupply
        await fetchAssetDetails(params.assetId, true);

        // Fetch asset details to get decimals
        const assetDetails = assetDetailsMapRef.current.get(params.assetId);
        const decimals = assetDetails?.decimals ?? 0;
        const displayAmount =
          decimals > 0
            ? (parseInt(params.amount, 10) / Math.pow(10, decimals)).toString()
            : params.amount;

        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Asset Minted',
          message: `Successfully minted ${displayAmount} tokens!`,
          color: 'green',
          autoClose: 5000,
        });

        params.onProgress?.('Complete');

        return result;
      } catch (err) {
        console.error('[Asset Provider] Failed to mint asset:', err);
        notifications.update({
          id: notificationId,
          loading: false,
          title: 'Minting Failed',
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
      fetchAssetDetails,
      executeWithKey,
    ],
  );

  const value = {
    assetDetailsMap: assetDetailsMapRef.current,
    ownedAssetIds,
    registeredAssetBalances,
    ownedAssets,
    registeredAssets,
    isLoading,
    error,
    createAsset,
    registerAsset,
    mintAsset,
    getAssetDetails,
    refreshOwnedAssets,
    refreshRegisteredAssets,
  };

  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
}
