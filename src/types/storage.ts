/**
 * Confidential Key Storage Schema
 *
 * Storage format for DART confidential keys in localStorage.
 */

export interface ConfidentialKeyRecord {
  version: 1;
  name: string;
  public: {
    account: string; // hex string (account public key)
    encryption: string; // hex string (encryption public key)
  };
  private: {
    format: 'scale-base64';
    encryption: 'none';
    data: string; // base64-encoded SCALE bytes from AccountKeys.toBytes()
  };
  metadata: {
    created: number; // Unix milliseconds
  };
}

// Encrypted keys using Polkadot-standard cryptography (scrypt + XSalsa20-Poly1305)
export interface EncryptedConfidentialKeyRecord
  extends Omit<ConfidentialKeyRecord, 'private' | 'version'> {
  version: 2;
  private: {
    format: 'scale-base64';
    encryption: 'scrypt-xsalsa20-poly1305';
    kdf: {
      function: 'scrypt';
      params: {
        N: number; // iterations (cost parameter)
        p: number; // parallelism
        r: number; // block size
      };
      salt: string; // base64
    };
    cipher: {
      algorithm: 'xsalsa20-poly1305';
      nonce: string; // base64
    };
    data: string; // base64-encoded encrypted ciphertext
  };
}

export type AnyConfidentialKeyRecord =
  | ConfidentialKeyRecord
  | EncryptedConfidentialKeyRecord;
