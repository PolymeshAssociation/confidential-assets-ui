import { useNotification } from '@/hooks/useNotification';
import { apolloClient } from '@/services/apollo';
import { ApolloProvider } from '@apollo/client/react';
import type { ApiPromise } from '@polkadot/api';
import type { BrowserExtensionSigningManager as SigningManagerType } from '@polymeshassociation/browser-extension-signing-manager';
import { BrowserExtensionSigningManager } from '@polymeshassociation/browser-extension-signing-manager';
import type { Polymesh as PolymeshType } from '@polymeshassociation/polymesh-sdk';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import type { Balance } from '@polymeshassociation/polymesh-sdk/api/entities/Account/types';
import type { UnsubCallback } from '@polymeshassociation/polymesh-sdk/types';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PolymeshContext } from './PolymeshContext';
import type { Account, Wallet } from './types';
import { NODE_URL, PRIORITY_EXTENSIONS, STORAGE_KEYS } from './types';

export function PolymeshProvider({ children }: { children: ReactNode }) {
  const { showError } = useNotification();
  const [sdk, setSdk] = useState<PolymeshType | null>(null);
  const [polkadotApi, setPolkadotApi] = useState<ApiPromise | null>(null);
  const [signingManager, setSigningManager] =
    useState<SigningManagerType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [connectedWalletId, setConnectedWalletId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.LAST_WALLET_ID),
  );
  const [accountBalance, setAccountBalance] = useState<Balance | null>(null);
  const [accountIdentity, setAccountIdentity] = useState<string | null>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(false);

  const sdkRef = useRef<PolymeshType | null>(null);
  const detectedWalletsRef = useRef<string[]>([]);
  // Track current wallet connection to prevent race conditions when switching wallets
  const currentWalletConnectionRef = useRef<string | null>(null);

  const connectWallet = useCallback(
    async (walletId: string) => {
      setIsWalletConnecting(true);

      try {
        // Check if the wallet is in detected wallets
        if (!detectedWalletsRef.current.includes(walletId)) {
          throw new Error(
            `${walletId} is not installed. Please install it to continue.`,
          );
        }

        // Create signing manager (independent of SDK)
        // Note: For some wallets like Talisman, this may succeed even if authorization is rejected.
        const manager = await BrowserExtensionSigningManager.create({
          appName: 'Polymesh Confidential Assets',
          extensionName: walletId,
          accountTypes: ['sr25519', 'ed25519', 'ecdsa'], // filter out ethereum wallets
        });

        // Set signing manager state
        setSigningManager(manager);

        // Persist the wallet ID optimistically
        // Will be cleared by the useEffect if authorization fails
        localStorage.setItem(STORAGE_KEYS.LAST_WALLET_ID, walletId);
        setConnectedWalletId(walletId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to connect wallet';

        showError(errorMessage);
        console.error('Wallet connection error:', err);

        // Clear state on error
        setSigningManager(null);
        setConnectedWalletId(null);
        setIsWalletConnecting(false);
        currentWalletConnectionRef.current = null;
        localStorage.removeItem(STORAGE_KEYS.LAST_WALLET_ID);

        // Re-throw so callers can handle the error
        throw err;
      }
    },
    [showError],
  );

  const selectAccount = useCallback(
    async (account: Account) => {
      if (!sdk) {
        return;
      }

      try {
        sdk.setSigningAccount(account.address);
        setSelectedAccount(account);
        localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, account.address);
      } catch (err) {
        console.error('Failed to set signing account:', err);
        showError('Failed to select account');
        throw err;
      }
    },
    [sdk, showError],
  );

  const disconnectWallet = useCallback(() => {
    // Clear persistence
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
    localStorage.removeItem(STORAGE_KEYS.LAST_WALLET_ID);

    // Trigger effect to handle SDK and state cleanup
    setSigningManager(null);
  }, []);

  const refreshIdentity = useCallback(async () => {
    if (!sdk || !selectedAccount) {
      return;
    }

    try {
      const account = await sdk.accountManagement.getAccount({
        address: selectedAccount.address,
      });
      const identity = await account.getIdentity();
      if (identity) {
        setAccountIdentity(identity.did);
      } else {
        setAccountIdentity(null);
      }
    } catch (error) {
      console.error('Error refreshing identity:', error);
      throw error;
    }
  }, [sdk, selectedAccount]);

  // Initialize Polymesh SDK (independent of wallet)
  useEffect(() => {
    setIsConnecting(true);

    (async () => {
      try {
        if (!sdkRef.current) {
          const sdkInstance = await Polymesh.connect({
            nodeUrl: NODE_URL,
            polkadot: {
              noInitWarn: true,
            },
          });
          if (!sdkRef.current) {
            sdkRef.current = sdkInstance;
            setSdk(sdkInstance);
            setPolkadotApi(sdkInstance._polkadotApi);
            console.log(`Connected to ${NODE_URL}`);
          }
          setIsConnected(true);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to connect to Polymesh';
        setError(errorMessage);
        console.error('Polymesh SDK connection error:', error);
      } finally {
        setIsConnecting(false);
      }
    })();
  }, []);

  // Detect available wallets and auto-reconnect
  useEffect(() => {
    // Avoid re-detecting wallets if already done
    if (detectedWalletsRef.current.length > 0) {
      return;
    }
    const extensions = BrowserExtensionSigningManager.getExtensionList();
    detectedWalletsRef.current = extensions;

    // Build availableWallets for UI
    const wallets: Wallet[] = PRIORITY_EXTENSIONS.map((extName) => ({
      name: extName,
      isInstalled: extensions.includes(extName),
    }));
    setAvailableWallets(wallets);

    // Auto-reconnect if previously connected
    const lastWalletId = localStorage.getItem(STORAGE_KEYS.LAST_WALLET_ID);
    if (lastWalletId) {
      connectWallet(lastWalletId).catch((err) => {
        console.error('Auto-reconnect failed:', err);
        // Clear localStorage on failed auto-reconnect to prevent infinite retry
        localStorage.removeItem(STORAGE_KEYS.LAST_WALLET_ID);
      });
    }
  }, [connectWallet]);

  // Attach signing manager to SDK and get accounts
  useEffect(() => {
    if (!sdk || !signingManager) {
      // Clear wallet state when signing manager is removed
      if (!signingManager) {
        // Clear signing manager from SDK
        if (sdk) {
          sdk.setSigningManager(null);
        }

        // Clear all wallet state
        setAccounts([]);
        setSelectedAccount(null);
        setAccountBalance(null);
        setAccountIdentity(null);
        setIsAccountLoading(false);
        setIsWalletConnected(false);
        setConnectedWalletId(null);
        currentWalletConnectionRef.current = null;
      }
      return;
    }

    // Track this connection attempt
    const connectionId = `${Date.now()}-${Math.random()}`;
    currentWalletConnectionRef.current = connectionId;

    const attachAndGetAccounts = async () => {
      try {
        // Check if this is still the current connection attempt
        if (currentWalletConnectionRef.current !== connectionId) {
          return;
        }

        // Attach signing manager to SDK
        await sdk.setSigningManager(signingManager);

        // Check again after async operation
        if (currentWalletConnectionRef.current !== connectionId) {
          return;
        }

        // Get accounts with metadata
        const extensionAccounts = await signingManager.getAccountsWithMeta();
        const accountList: Account[] = extensionAccounts.map((account) => ({
          address: account.address,
          name: account.meta?.name || account.address.substring(0, 8) + '...',
        }));

        // Check again after async operation
        if (currentWalletConnectionRef.current !== connectionId) {
          return;
        }

        setAccounts(accountList);

        if (accountList.length === 0) {
          // No accounts - clear storage and show message
          localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
          setSelectedAccount(null);
          showError('No accounts found in wallet');
          setIsWalletConnected(true);
          setIsWalletConnecting(false);
          return;
        }

        // Try to restore last selected account
        const savedAddress = localStorage.getItem(
          STORAGE_KEYS.SELECTED_ACCOUNT,
        );
        const accountToSelect = savedAddress
          ? accountList.find((acc) => acc.address === savedAddress)
          : undefined;

        if (accountToSelect) {
          // Last selected account still exists
          await selectAccount(accountToSelect);
        } else {
          // Last selected not found or no saved account - use first
          if (savedAddress) {
            localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
          }
          await selectAccount(accountList[0]);
        }

        // Final check before completing
        if (currentWalletConnectionRef.current !== connectionId) {
          return;
        }

        setIsWalletConnected(true);
        setIsWalletConnecting(false);
      } catch (error) {
        // Only show error if this is still the current connection
        if (currentWalletConnectionRef.current === connectionId) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';

          // Provide more specific error messages
          if (errorMessage.includes('getAccountsWithMeta')) {
            showError('Failed to retrieve accounts from wallet');
          } else if (errorMessage.includes('setSigningAccount')) {
            showError('Failed to select account');
          } else if (errorMessage.includes('setSigningManager')) {
            showError('Failed to connect wallet to SDK');
          } else if (errorMessage.includes('not been authorised')) {
            showError('Wallet authorization was rejected or not completed');
          } else {
            showError(`Failed to initialize wallet: ${errorMessage}`);
          }

          console.error('Error attaching signing manager:', error);

          // Clear signing manager - this will trigger the effect to clean up all wallet state
          setSigningManager(null);

          // Clear localStorage to prevent auto-reconnect attempts
          localStorage.removeItem(STORAGE_KEYS.LAST_WALLET_ID);
          localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
          setIsWalletConnecting(false);
        }
      }
    };

    attachAndGetAccounts();
  }, [sdk, signingManager, selectAccount, showError]);

  // Subscribe to account balance and identity changes
  useEffect(() => {
    if (!sdk || !selectedAccount) {
      setAccountBalance(null);
      setAccountIdentity(null);
      setIsAccountLoading(false);
      return;
    }

    // Set loading state immediately when account changes
    setIsAccountLoading(true);
    let balanceUnsubscribe: UnsubCallback | undefined;

    const subscribeToAccountData = async () => {
      try {
        // Subscribe to balance updates
        balanceUnsubscribe = await sdk.accountManagement.getAccountBalance(
          { account: selectedAccount.address },
          (balance) => {
            setAccountBalance(balance);
          },
        );

        // Fetch identity once (getIdentity is not a subscription)
        const account = await sdk.accountManagement.getAccount({
          address: selectedAccount.address,
        });
        const identity = await account.getIdentity();
        if (identity) {
          setAccountIdentity(identity.did);
        } else {
          setAccountIdentity(null);
        }

        setIsAccountLoading(false);
      } catch (error) {
        console.error('Error subscribing to account data:', error);
        setAccountBalance(null);
        setAccountIdentity(null);
        setIsAccountLoading(false);
      }
    };

    subscribeToAccountData();

    return () => {
      if (balanceUnsubscribe) {
        balanceUnsubscribe();
      }
    };
  }, [sdk, selectedAccount]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        sdkRef.current.disconnect();
      }
    };
  }, []);

  const value = {
    sdk,
    polkadotApi,
    signingManager,
    isConnected,
    isConnecting,
    isWalletConnected,
    isWalletConnecting,
    error,
    accounts,
    selectedAccount,
    availableWallets,
    connectedWalletId,
    accountBalance,
    accountIdentity,
    isAccountLoading,
    connectWallet,
    disconnectWallet,
    selectAccount,
    refreshIdentity,
  };

  return (
    <ApolloProvider client={apolloClient}>
      <PolymeshContext.Provider value={value}>
        {children}
      </PolymeshContext.Provider>
    </ApolloProvider>
  );
}
