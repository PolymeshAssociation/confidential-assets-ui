import type { ApiPromise } from '@polkadot/api';
import type { BrowserExtensionSigningManager as SigningManagerType } from '@polymeshassociation/browser-extension-signing-manager';
import type { Polymesh as PolymeshType } from '@polymeshassociation/polymesh-sdk';

export interface Account {
  address: string;
  name?: string;
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
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (account: Account) => Promise<void>;
}

export const NODE_URL = import.meta.env.VITE_POLYMESH_NODE_URL;

// Priority wallet extensions
export const PRIORITY_EXTENSIONS = ['polywallet', 'polkadot-js'];

// LocalStorage keys
export const STORAGE_KEYS = {
  WALLET_CONNECTED: 'polymesh_wallet_connected',
  SELECTED_ACCOUNT: 'polymesh_selected_account',
};
