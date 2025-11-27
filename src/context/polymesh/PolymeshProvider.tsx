import { apolloClient } from '@/services/apollo';
import { ApolloProvider } from '@apollo/client/react';
import type { ApiPromise } from '@polkadot/api';
import type { BrowserExtensionSigningManager as SigningManagerType } from '@polymeshassociation/browser-extension-signing-manager';
import { BrowserExtensionSigningManager } from '@polymeshassociation/browser-extension-signing-manager';
import type { Polymesh as PolymeshType } from '@polymeshassociation/polymesh-sdk';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PolymeshContext } from './PolymeshContext';
import type { Account } from './types';
import { NETWORK, NODE_URL, PRIORITY_EXTENSIONS, STORAGE_KEYS } from './types';

export function PolymeshProvider({ children }: { children: ReactNode }) {
  const [sdk, setSdk] = useState<PolymeshType | null>(null);
  const [polkadotApi, setPolkadotApi] = useState<ApiPromise | null>(null);
  const [signingManager, setSigningManager] =
    useState<SigningManagerType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const disconnect = useCallback(() => {
    if (sdk) {
      sdk.disconnect();
    }
    setSdk(null);
    setPolkadotApi(null);
    setSigningManager(null);
    setIsConnected(false);
    setAccounts([]);
    setSelectedAccount(null);
    setError(null);
    // Clear persistence
    localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
  }, [sdk]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get available extensions
      const extensions = BrowserExtensionSigningManager.getExtensionList();

      if (extensions.length === 0) {
        throw new Error(
          'No Polymesh-compatible wallet extensions found. Please install Polymesh Wallet or Polkadot.js extension.',
        );
      }

      // Filter for priority extensions
      const priorityExtensions = extensions.filter((ext) =>
        PRIORITY_EXTENSIONS.includes(ext.toLowerCase()),
      );

      const availableExtensions =
        priorityExtensions.length > 0 ? priorityExtensions : extensions;

      console.log('Available wallet extensions:', availableExtensions);

      // Create signing manager with the first available priority extension
      const manager = await BrowserExtensionSigningManager.create({
        appName: 'Polymesh Confidential Assets',
        extensionName: availableExtensions[0],
      });

      setSigningManager(manager);

      // Connect to Polymesh first (this sets SS58 format on the signing manager)
      const polymeshSdk = await Polymesh.connect({
        nodeUrl: NODE_URL,
        signingManager: manager,
      });

      setSdk(polymeshSdk);
      // Extract and expose polkadot API
      setPolkadotApi(polymeshSdk._polkadotApi);

      setIsConnected(true);

      // Get accounts with metadata from the extension (after SDK connection sets SS58 format)
      const extensionAccounts = await manager.getAccountsWithMeta();
      const accountList: Account[] = extensionAccounts.map((account) => ({
        address: account.address,
        name: account.meta?.name || account.address.substring(0, 8) + '...',
      }));
      setAccounts(accountList);

      // Try to restore previously selected account
      const savedAccount = localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT);
      const accountToSelect = savedAccount
        ? accountList.find((acc) => acc.address === savedAccount) ||
          accountList[0]
        : accountList[0];

      if (accountToSelect) {
        // Set signing account in SDK - this also updates the polkadot API signer
        await polymeshSdk.setSigningAccount(accountToSelect.address);
        setSelectedAccount(accountToSelect);
        localStorage.setItem(
          STORAGE_KEYS.SELECTED_ACCOUNT,
          accountToSelect.address,
        );
        console.log('Initial signing account set:', accountToSelect.address);
      }

      // Mark wallet as connected
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');

      console.log(`Connected to Polymesh ${NETWORK} network at ${NODE_URL}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to Polymesh';
      setError(errorMessage);
      console.error('Polymesh connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const selectAccount = useCallback(
    async (account: Account) => {
      if (!sdk) {
        console.warn('SDK not available, cannot set signing account');
        return;
      }

      try {
        // Update the SDK's signing account - this also updates the polkadot API signer
        await sdk.setSigningAccount(account.address);
        setSelectedAccount(account);
        // Persist selected account
        localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, account.address);
        console.log('Selected and set signing account:', account.address);
      } catch (err) {
        console.error('Failed to set signing account:', err);
        throw err;
      }
    },
    [sdk],
  );

  // Track if auto-reconnect attempted
  const autoReconnectAttempted = useRef(false);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    if (autoReconnectAttempted.current) return;

    const wasConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED);
    if (wasConnected === 'true' && !isConnected && !isConnecting) {
      console.log('Auto-reconnecting wallet...');
      autoReconnectAttempted.current = true;
      connect();
    }
  }, [isConnected, isConnecting, connect]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sdk) {
        sdk.disconnect();
      }
    };
  }, [sdk]);

  const value = {
    sdk,
    polkadotApi,
    signingManager,
    isConnected,
    isConnecting,
    error,
    accounts,
    selectedAccount,
    connect,
    disconnect,
    selectAccount,
  };

  return (
    <ApolloProvider client={apolloClient}>
      <PolymeshContext.Provider value={value}>
        {children}
      </PolymeshContext.Provider>
    </ApolloProvider>
  );
}
