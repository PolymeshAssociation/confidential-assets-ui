import type { EncryptedConfidentialKeyRecord } from '@/types/storage';
import {
  base64Decode,
  base64Encode,
  naclDecrypt,
  naclEncrypt,
  scryptEncode,
} from '@polkadot/util-crypto';

/**
 * Encrypt key data using Scrypt (KDF) and XSalsa20-Poly1305 (AEAD)
 * Follows Polkadot keyring encryption standard
 */
export async function encryptKey(
  dataBase64: string,
  password: string,
): Promise<EncryptedConfidentialKeyRecord['private']> {
  const dataBytes = base64Decode(dataBase64);

  // Derive encryption key using Scrypt (generates salt automatically)
  const { params, password: derivedKey, salt } = scryptEncode(password);

  // Encrypt data using XSalsa20-Poly1305 (generates nonce automatically)
  const { encrypted, nonce } = naclEncrypt(
    dataBytes,
    derivedKey.subarray(0, 32),
  );

  return {
    format: 'scale-base64' as const,
    encryption: 'scrypt-xsalsa20-poly1305' as const,
    kdf: {
      function: 'scrypt' as const,
      params,
      salt: base64Encode(salt),
    },
    cipher: {
      algorithm: 'xsalsa20-poly1305' as const,
      nonce: base64Encode(nonce),
    },
    data: base64Encode(encrypted),
  };
}

/**
 * Decrypt key data using Scrypt and XSalsa20-Poly1305
 */
export async function decryptKey(
  encryptedKey: EncryptedConfidentialKeyRecord['private'],
  password: string,
): Promise<string> {
  const { kdf, cipher, data } = encryptedKey;

  if (kdf.function !== 'scrypt') {
    throw new Error(`Unsupported KDF: ${kdf.function}`);
  }

  if (cipher.algorithm !== 'xsalsa20-poly1305') {
    throw new Error(`Unsupported cipher: ${cipher.algorithm}`);
  }

  // Derive encryption key using stored Scrypt parameters
  const salt = base64Decode(kdf.salt);
  const { password: derivedKey64 } = scryptEncode(password, salt, kdf.params);
  const derivedKey = new Uint8Array(derivedKey64.subarray(0, 32));

  // Decrypt data
  const nonce = base64Decode(cipher.nonce);
  const ciphertext = base64Decode(data);
  const decrypted = naclDecrypt(ciphertext, nonce, derivedKey);

  if (!decrypted) {
    throw new Error('Decryption failed: Invalid password or corrupted data');
  }

  return base64Encode(decrypted);
}

/**
 * Change password for an encrypted key
 */
export async function changePassword(
  record: EncryptedConfidentialKeyRecord,
  oldPassword: string,
  newPassword: string,
): Promise<EncryptedConfidentialKeyRecord> {
  // Decrypt with old password
  const decryptedData = await decryptKey(record.private, oldPassword);

  // Encrypt with new password
  const newPrivateData = await encryptKey(decryptedData, newPassword);

  // Return updated record
  return {
    ...record,
    private: newPrivateData,
  };
}
