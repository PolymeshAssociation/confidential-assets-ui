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
  lastUsedAt: number;
}

export interface ConfidentialKeyContextValue {
  keys: ConfidentialKey[];
  isInitialized: boolean;
  isGenerating: boolean;

  selectedKey: ConfidentialKey | null;
  keepUnlocked: boolean;
  setKeepUnlocked: (value: boolean) => void;

  initializeWasm: () => Promise<void>;
  generateKey: (
    alias: string,
    seed?: string,
    password?: string,
  ) => Promise<void>;

  selectKey: (publicKey: string) => void;

  executeWithKey: <T>(
    operation: (accountKeys: AccountKeys) => Promise<T>,
  ) => Promise<T>;

  lockKey: () => Promise<void>;
  deleteKey: (publicKey: string) => Promise<void>;
  renameKey: (publicKey: string, newAlias: string) => Promise<void>;
  refreshKeys: () => void;
  updateRegistrationStatus: (
    publicKey: string,
    registeredDid: string | null,
  ) => void;
  checkAllRegistrations: (polkadotApi: ApiPromise) => Promise<void>;
  changeKeyPassword: (publicKey: string) => Promise<void>;
  isKeyEncrypted: (publicKey: string) => boolean;
}
