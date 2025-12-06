import { ChangePasswordModal, PasswordModal } from '@/components';
import { checkAccountRegistration } from '@/services/confidential';
import {
  changePassword,
  decryptKey,
  encryptKey,
} from '@/services/confidential/encryption';
import { confidentialKeyManager } from '@/services/confidential/keyManager';
import * as keyStorage from '@/services/storage/keyStorage';
import { ConfidentialError } from '@/types/confidential';
import type { EncryptedConfidentialKeyRecord } from '@/types/storage';
import type { ApiPromise } from '@polkadot/api';
import type { AccountKeys } from '@polymesh/polymesh-dart-wasm';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfidentialKeyContext } from './ConfidentialKeyContext';
import type { ConfidentialKey } from './types';

export function ConfidentialKeyProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<ConfidentialKey[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedKey, setSelectedKey] = useState<ConfidentialKey | null>(null);
  const [keepUnlocked, setKeepUnlocked] = useState(false);
  const [unlockTimeout, setUnlockTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Use ref to track current keepUnlocked value for executeWithKey
  // This ensures we always use the latest value, even if user checks the box during password entry
  const keepUnlockedRef = useRef(keepUnlocked);
  useEffect(() => {
    keepUnlockedRef.current = keepUnlocked;
  }, [keepUnlocked]);

  // Password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingKeyAlias, setPendingKeyAlias] = useState<string | null>(null);
  const [encryptedKeyToUnlock, setEncryptedKeyToUnlock] = useState<
    EncryptedConfidentialKeyRecord['private'] | null
  >(null);
  const [passwordResolver, setPasswordResolver] = useState<{
    resolve: (result: { password: string; keepUnlocked: boolean }) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [changePasswordKeyPublicKey, setChangePasswordKeyPublicKey] = useState<
    string | null
  >(null);

  // WASM initialization function
  const initializeWasm = useCallback(async () => {
    if (isInitialized) {
      return;
    }
    try {
      await confidentialKeyManager.initWasm();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Confidential WASM:', error);
      throw error;
    }
  }, [isInitialized]);

  // Auto-initialize WASM on mount
  useEffect(() => {
    initializeWasm();
  }, [initializeWasm]);

  // Load keys from storage
  const loadKeys = useCallback(() => {
    setKeys((prevKeys) => {
      const storedKeys = keyStorage.listKeys();
      const confidentialKeys: ConfidentialKey[] = storedKeys.map((stored) => {
        // Preserve registration status from previous state if it exists
        const existingKey = prevKeys.find(
          (k) => k.publicKey === stored.public.account,
        );
        return {
          alias: stored.name,
          publicKey: stored.public.account,
          encryptionPublicKey: stored.public.encryption,
          createdAt: stored.metadata.created,
          registeredDid: existingKey?.registeredDid,
        };
      });
      return confidentialKeys;
    });
  }, []);

  // Load keys on mount
  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const selectKey = useCallback(
    ({ publicKey }: { publicKey: string }) => {
      const key = keys.find((k) => k.publicKey === publicKey);
      if (!key) {
        throw new Error(`Key not found: ${publicKey}`);
      }

      // SECURITY: Clear any previously loaded keys from WASM
      // This prevents using the wrong key if switching selection
      confidentialKeyManager.clearKeys();

      // Cancel any pending unlock timeout
      if (unlockTimeout) {
        clearTimeout(unlockTimeout);
        setUnlockTimeout(null);
      }

      // Reset keepUnlocked when changing keys
      setKeepUnlocked(false);

      setSelectedKey(key);

      // Save selection to localStorage
      localStorage.setItem('polymesh_selected_key_pubkey', key.publicKey);
    },
    [keys, unlockTimeout],
  );

  const generateKey = useCallback(
    async ({
      alias,
      seed,
      password,
    }: {
      alias: string;
      seed?: string;
      password: string;
    }) => {
      if (!isInitialized) {
        throw new Error('Confidential WASM module not initialized');
      }

      // Check if alias already exists
      if (keyStorage.keyExists(alias)) {
        throw new Error(`Key with alias "${alias}" already exists`);
      }

      try {
        setIsGenerating(true);

        // Generate Confidential keys - now returns both seed and public keys
        const result = seed
          ? await confidentialKeyManager.generateKeysFromSeed(seed)
          : await confidentialKeyManager.generateKeys();

        // Encrypt with password (required)
        const encryptedData = await encryptKey({
          seedHex: result.seed,
          password,
        });
        const privateData: EncryptedConfidentialKeyRecord['private'] = {
          ...encryptedData,
          format: 'seed-hex',
        };

        // Create storage record with public keys cached
        const keyRecord: EncryptedConfidentialKeyRecord = {
          version: 1,
          name: alias,
          public: {
            account: result.publicKeys.accountPublicKey.hex,
            encryption: result.publicKeys.encryptionPublicKey.hex,
          },
          private: privateData,
          metadata: {
            created: Date.now(),
          },
        };

        // Save to storage
        keyStorage.saveKey(keyRecord);

        // Refresh keys list
        loadKeys();
      } catch (error) {
        if (error instanceof ConfidentialError) {
          throw error;
        }
        console.error('Error generating key:', error);
        throw new Error(
          `Failed to generate Confidential key: ${error instanceof Error ? error.message : String(error)}`,
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [isInitialized, loadKeys],
  );

  const requestPassword = useCallback(
    (
      alias: string,
      encryptedKey: EncryptedConfidentialKeyRecord['private'],
    ): Promise<{ password: string; keepUnlocked: boolean }> => {
      return new Promise((resolve, reject) => {
        setPendingKeyAlias(alias);
        setEncryptedKeyToUnlock(encryptedKey);
        setPasswordResolver({ resolve, reject });
        setPasswordModalOpen(true);
      });
    },
    [],
  );

  const handlePasswordSubmit = useCallback(
    async (password: string, shouldKeepUnlocked: boolean) => {
      if (!encryptedKeyToUnlock || !passwordResolver) return;

      // Verify password by attempting to decrypt
      // We don't need the result, just to know it works
      await decryptKey({ encryptedKey: encryptedKeyToUnlock, password });

      // If successful, update keepUnlocked state if requested
      if (shouldKeepUnlocked) {
        setKeepUnlocked(true);
      }

      setPasswordModalOpen(false);
      setPendingKeyAlias(null);
      setEncryptedKeyToUnlock(null);

      // Give React time to render the closed modal before unblocking the caller
      // This prevents the UI from freezing while the modal is still open if the caller
      // immediately starts a heavy WASM operation (like proof generation)
      setTimeout(() => {
        passwordResolver.resolve({
          password,
          keepUnlocked: shouldKeepUnlocked,
        });
        setPasswordResolver(null);
      }, 100);
    },
    [passwordResolver, encryptedKeyToUnlock],
  );

  const handlePasswordCancel = useCallback(() => {
    if (passwordResolver) {
      passwordResolver.reject(new Error('Password entry cancelled'));
      setPasswordModalOpen(false);
      setPendingKeyAlias(null);
      setEncryptedKeyToUnlock(null);
      setPasswordResolver(null);
    }
  }, [passwordResolver]);

  const lockKey = useCallback(async () => {
    if (!isInitialized) {
      throw new Error('Confidential WASM module not initialized');
    }

    try {
      // Clear key from WASM memory
      confidentialKeyManager.clearKeys();

      // Clear keep unlocked state
      setKeepUnlocked(false);
      if (unlockTimeout) {
        clearTimeout(unlockTimeout);
        setUnlockTimeout(null);
      }


    } catch (error) {
      if (error instanceof ConfidentialError) {
        throw error;
      }
      throw new Error('Failed to lock Confidential key');
    }
  }, [isInitialized, unlockTimeout]);

  const deleteKey = useCallback(
    async ({ publicKey }: { publicKey: string }) => {
      const storedKey = keyStorage.getKey(publicKey);
      if (!storedKey) {
        throw new Error(`Key with public key "${publicKey}" not found`);
      }

      // If this is the selected key, deselect it first
      if (selectedKey?.publicKey === publicKey) {
        await lockKey();
        setSelectedKey(null);

        // Only clear localStorage if it matches the deleted key
        const savedPublicKey = localStorage.getItem(
          'polymesh_selected_key_pubkey',
        );
        if (savedPublicKey === publicKey) {
          localStorage.removeItem('polymesh_selected_key_pubkey');
        }
      }

      // Delete from storage
      const success = keyStorage.deleteKey(publicKey);

      if (!success) {
        throw new Error(`Failed to delete key: ${publicKey}`);
      }

      // Refresh keys list
      loadKeys();
    },
    [selectedKey, lockKey, loadKeys],
  );

  const renameKey = useCallback(
    async ({
      publicKey,
      newAlias,
    }: {
      publicKey: string;
      newAlias: string;
    }) => {
      const storedKey = keyStorage.getKey(publicKey);
      if (!storedKey) {
        throw new Error(`Key with public key "${publicKey}" not found`);
      }

      // Update in storage
      const success = keyStorage.updateName(publicKey, newAlias);
      if (!success) {
        throw new Error('Failed to rename key');
      }

      // Update selected key alias if it's the one being renamed
      if (selectedKey?.publicKey === publicKey) {
        setSelectedKey({ ...selectedKey, alias: newAlias });
      }

      // Refresh keys list
      loadKeys();
    },
    [loadKeys, selectedKey],
  );

  const changeKeyPassword = useCallback(
    async ({ publicKey }: { publicKey: string }) => {
      const storedKey = keyStorage.getKey(publicKey);
      if (!storedKey) {
        throw new Error(`Key with public key "${publicKey}" not found`);
      }

      // Only support changing password for encrypted keys
      if (storedKey.private.encryption !== 'scrypt-xsalsa20-poly1305') {
        throw new Error('Key is not encrypted');
      }

      // Open the change password modal with the public key
      setChangePasswordKeyPublicKey(publicKey);
      setChangePasswordModalOpen(true);
    },
    [],
  );

  const handleChangePasswordSubmit = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!changePasswordKeyPublicKey) return;

      // Get the stored key by public key
      const storedKey = keyStorage.getKey(changePasswordKeyPublicKey);
      if (!storedKey) {
        throw new Error(
          `Key with public key "${changePasswordKeyPublicKey}" not found`,
        );
      }

      // Verify old password by trying to decrypt
      await decryptKey({
        encryptedKey:
          storedKey.private as EncryptedConfidentialKeyRecord['private'],
        password: oldPassword,
      });

      // Change password
      const updatedRecord = await changePassword({
        record: storedKey as EncryptedConfidentialKeyRecord,
        oldPassword,
        newPassword,
      });

      keyStorage.updateKey(updatedRecord);

      // Close modal on success
      setChangePasswordModalOpen(false);
      setChangePasswordKeyPublicKey(null);
    },
    [changePasswordKeyPublicKey],
  );

  const handleChangePasswordCancel = useCallback(() => {
    setChangePasswordModalOpen(false);
    setChangePasswordKeyPublicKey(null);
  }, []);

  const isKeyEncrypted = useCallback(
    ({ publicKey }: { publicKey: string }): boolean => {
      const key = keyStorage.getKey(publicKey);
      return key?.private.encryption === 'scrypt-xsalsa20-poly1305';
    },
    [],
  );

  const scheduleKeyClear = useCallback(
    (timeoutMs: number) => {
      // Clear any existing timeout
      if (unlockTimeout) {
        clearTimeout(unlockTimeout);
      }

      // Schedule new clear
      const timeout = setTimeout(() => {
        confidentialKeyManager.clearKeys();
        setKeepUnlocked(false);
        setUnlockTimeout(null);
      }, timeoutMs);

      setUnlockTimeout(timeout);
    },
    [unlockTimeout],
  );

  const executeWithKey = useCallback(
    async <T,>({
      operation,
    }: {
      operation: (accountKeys: AccountKeys) => Promise<T>;
    }): Promise<T> => {
      if (!selectedKey) {
        throw new Error('No key selected');
      }

      // Track if we should keep unlocked based on THIS operation's user choice
      // or existing state if keys were already loaded
      let shouldKeepUnlocked = keepUnlockedRef.current;

      try {
        // Check if keys are already loaded (for keepUnlocked feature)
        let accountKeys: AccountKeys | null = null;
        try {
          accountKeys = confidentialKeyManager.getCurrentKeys();
        } catch {
          // Keys not loaded, need to load them
        }

        // If keys aren't loaded, load them now
        if (!accountKeys) {
          // Get key from storage
          const storedKey = keyStorage.getKey(selectedKey.publicKey);
          if (!storedKey) {
            throw new Error(`Key not found: ${selectedKey.publicKey}`);
          }

          let seed = storedKey.private.data;

          // Decrypt if encrypted
          if (storedKey.private.encryption === 'scrypt-xsalsa20-poly1305') {
            const { password, keepUnlocked: userWantsToKeepUnlocked } =
              await requestPassword(storedKey.name, storedKey.private);

            // Update our local flag based on user's choice in this specific interaction
            shouldKeepUnlocked = userWantsToKeepUnlocked;

            // Note: setKeepUnlocked(true) is called in handlePasswordSubmit if userWantsToKeepUnlocked is true
            // but we need this local variable for the finally block below because state updates are async

            seed = await decryptKey({
              encryptedKey:
                storedKey.private as EncryptedConfidentialKeyRecord['private'],
              password,
            });
          }

          // Load into WASM (recreates AccountKeys from seed)
          await confidentialKeyManager.loadKeys(seed);
          accountKeys = confidentialKeyManager.getCurrentKeys();
        }

        // Execute operation (keeps keys loaded for entire async operation)
        const result = await operation(accountKeys);

        return result;
      } finally {
        // CRITICAL: Always clear keys, even on error
        // Use the local variable which captures either:
        // 1. The existing state (if keys were already loaded)
        // 2. The user's choice from the password modal (if we just unlocked)
        if (shouldKeepUnlocked) {
          scheduleKeyClear(10 * 60 * 1000); // 10 minutes
        } else {
          confidentialKeyManager.clearKeys();
        }
      }
    },
    [selectedKey, requestPassword, scheduleKeyClear],
  );

  const refreshKeys = useCallback(() => {
    loadKeys();
  }, [loadKeys]);

  const updateRegistrationStatus = useCallback(
    ({
      publicKey,
      registeredDid,
    }: {
      publicKey: string;
      registeredDid: string | null;
    }) => {
      // Update selected key if it matches
      setSelectedKey((prev) =>
        prev && prev.publicKey === publicKey
          ? { ...prev, registeredDid }
          : prev,
      );

      // Update in keys list
      setKeys((prevKeys) =>
        prevKeys.map((key) =>
          key.publicKey === publicKey ? { ...key, registeredDid } : key,
        ),
      );
    },
    [],
  );

  const checkAllRegistrations = useCallback(
    async ({ polkadotApi }: { polkadotApi: ApiPromise }) => {
      if (!polkadotApi) return;

      try {
        // Get current keys to avoid dependency on keys state
        const currentKeys = keyStorage.listKeys().map((stored) => ({
          alias: stored.name,
          publicKey: stored.public.account,
        }));

        // Check registration for all keys in parallel
        const registrationChecks = currentKeys.map(async (key) => {
          try {
            const registeredDid = await checkAccountRegistration({
              accountPublicKey: key.publicKey,
              polkadotApi,
            });
            return { alias: key.alias, registeredDid };
          } catch (error) {
            console.error(
              `Failed to check registration for ${key.alias}:`,
              error,
            );
            return { alias: key.alias, registeredDid: null };
          }
        });

        const results = await Promise.all(registrationChecks);

        // Update all registration statuses
        setKeys((prevKeys) =>
          prevKeys.map((key) => {
            const result = results.find((r) => r.alias === key.alias);
            return result
              ? { ...key, registeredDid: result.registeredDid }
              : key;
          }),
        );

        // Also update selected key if present
        setSelectedKey((prev) => {
          if (!prev) return prev;
          const result = results.find((r) => r.alias === prev.alias);
          return result
            ? { ...prev, registeredDid: result.registeredDid }
            : prev;
        });
      } catch (error) {
        console.error('Failed to check registrations:', error);
      }
    },
    [],
  );

  // Auto-restore selected key on page load
  useEffect(() => {
    const restoreSelectedKey = () => {
      if (!isInitialized) return;
      if (selectedKey) return; // Already selected

      const savedPublicKey = localStorage.getItem(
        'polymesh_selected_key_pubkey',
      );
      if (!savedPublicKey) return;

      // Find the key
      const key = keys.find((k) => k.publicKey === savedPublicKey);

      if (!key) {
        // Key no longer exists, clean up
        localStorage.removeItem('polymesh_selected_key_pubkey');
        return;
      }

      // Restore selection (no unlock)
      setSelectedKey(key);
    };

    restoreSelectedKey();
  }, [isInitialized, selectedKey, keys]);

  // Auto-lock key on page unload/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (selectedKey) {
        try {
          confidentialKeyManager.clearKeys();
        } catch (error) {
          console.error('Failed to clear keys on unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedKey]);

  const exportKey = useCallback(
    ({ publicKey }: { publicKey: string }): string => {
      const storedKey = keyStorage.getKey(publicKey);
      if (!storedKey) {
        throw new Error(`Key with public key "${publicKey}" not found`);
      }
      return JSON.stringify(storedKey, null, 2);
    },
    [],
  );

  const importKey = useCallback(
    async ({ jsonData, password }: { jsonData: string; password: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let keyRecord: any;
      try {
        keyRecord = JSON.parse(jsonData);
      } catch {
        throw new Error('Invalid JSON format');
      }

      // Basic validation
      if (
        !keyRecord.version ||
        !keyRecord.name ||
        !keyRecord.public?.account ||
        !keyRecord.private
      ) {
        throw new Error('Invalid key file format');
      }

      // Check for duplicate
      if (keyStorage.keyExistsByPublicKey(keyRecord.public.account)) {
        throw new Error(
          `Key with public key "${keyRecord.public.account}" already exists`,
        );
      }

      // Verify password / Decrypt
      if (keyRecord.private.encryption !== 'scrypt-xsalsa20-poly1305') {
        throw new Error(
          `Unsupported encryption type: ${keyRecord.private.encryption}`,
        );
      }

      try {
        await decryptKey({
          encryptedKey: keyRecord.private,
          password,
        });
      } catch {
        throw new Error('Incorrect password');
      }

      // Check if name exists and append suffix if needed
      let name = keyRecord.name;
      let counter = 1;
      while (keyStorage.keyExists(name)) {
        name = `${keyRecord.name} (${counter})`;
        counter++;
      }
      keyRecord.name = name;

      // Save
      keyStorage.saveKey(keyRecord);
      loadKeys();
    },
    [loadKeys],
  );

  const value = {
    keys,
    isInitialized,
    isGenerating,
    selectedKey,
    keepUnlocked,
    setKeepUnlocked,
    initializeWasm,
    generateKey,
    selectKey,
    executeWithKey,
    lockKey,
    deleteKey,
    renameKey,
    refreshKeys,
    updateRegistrationStatus,
    checkAllRegistrations,
    changeKeyPassword,
    isKeyEncrypted,
    passwordModalOpen,
    pendingKeyAlias,
    handlePasswordSubmit,
    handlePasswordCancel,
    exportKey,
    importKey,
  };

  return (
    <ConfidentialKeyContext.Provider value={value}>
      {children}
      <PasswordModal
        opened={passwordModalOpen}
        keyAlias={pendingKeyAlias}
        onSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
      />
      <ChangePasswordModal
        opened={changePasswordModalOpen}
        keyAlias={
          changePasswordKeyPublicKey
            ? keyStorage.getKey(changePasswordKeyPublicKey)?.name || null
            : null
        }
        onSubmit={handleChangePasswordSubmit}
        onCancel={handleChangePasswordCancel}
      />
    </ConfidentialKeyContext.Provider>
  );
}
