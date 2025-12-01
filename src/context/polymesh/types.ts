import type { ApiPromise } from '@polkadot/api';
import type { BrowserExtensionSigningManager as SigningManagerType } from '@polymeshassociation/browser-extension-signing-manager';
import type { Polymesh as PolymeshType } from '@polymeshassociation/polymesh-sdk';
import type { Balance } from '@polymeshassociation/polymesh-sdk/types';

export interface Account {
  address: string;
  name?: string;
}

export interface Wallet {
  name: string;
  isInstalled: boolean;
}

export interface PolymeshContextValue {
  sdk: PolymeshType | null;
  polkadotApi: ApiPromise | null;
  signingManager: SigningManagerType | null;
  isConnected: boolean;
  isConnecting: boolean;
  isWalletConnected: boolean;
  isWalletConnecting: boolean;
  error: string | null;
  accounts: Account[];
  selectedAccount: Account | null;
  availableWallets: Wallet[];
  connectedWalletId: string | null;
  accountBalance: Balance | null;
  accountIdentity: string | null;
  isAccountLoading: boolean;
  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (account: Account) => Promise<void>;
}

export const NODE_URL = import.meta.env.VITE_POLYMESH_NODE_URL;

// Priority wallet extensions
export const PRIORITY_EXTENSIONS = [
  'polywallet',
  'subwallet-js',
  'talisman',
  'nova-wallet',
  'polkadot-js',
];

// LocalStorage keys
export const STORAGE_KEYS = {
  SELECTED_ACCOUNT: 'polymesh_selected_account',
  LAST_WALLET_ID: 'polymesh_last_wallet_id',
} as const;
