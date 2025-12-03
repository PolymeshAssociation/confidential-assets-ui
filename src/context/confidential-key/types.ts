import type { ApiPromise } from '@polkadot/api';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';

export interface ConfidentialKey {
  alias: string;
  /** Account public key (hex) */
  publicKey: string;
  /** Encryption public key (hex) */
  encryptionPublicKey: string;
  isUnlocked: boolean;
  /** DID this key is registered to on-chain (if any) */
  registeredDid?: string | null;
  createdAt: number;
}

export interface ConfidentialKeyContextValue {
  keys: ConfidentialKey[];
  isInitialized: boolean;
  isGenerating: boolean;

  selectedKey: ConfidentialKey | null;
  keepUnlocked: boolean;
  setKeepUnlocked: (value: boolean) => void;

  initializeWasm: () => Promise<void>;
  generateKey: (params: {
    alias: string;
    seed?: string;
    password: string;
  }) => Promise<void>;

  selectKey: (params: { publicKey: string }) => void;

  executeWithKey: <T>(params: {
    operation: (accountKeys: AccountKeys) => Promise<T>;
  }) => Promise<T>;

  lockKey: () => Promise<void>;
  deleteKey: (params: { publicKey: string }) => Promise<void>;
  renameKey: (params: { publicKey: string; newAlias: string }) => Promise<void>;
  refreshKeys: () => void;
  updateRegistrationStatus: (params: {
    publicKey: string;
    registeredDid: string | null;
  }) => void;
  checkAllRegistrations: (params: { polkadotApi: ApiPromise }) => Promise<void>;
  changeKeyPassword: (params: { publicKey: string }) => Promise<void>;
  isKeyEncrypted: (params: { publicKey: string }) => boolean;
  exportKey: (params: { publicKey: string }) => string;
  importKey: (params: { jsonData: string; password: string }) => Promise<void>;
}
