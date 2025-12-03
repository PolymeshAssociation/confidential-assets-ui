/**
 * Confidential Key Storage Schema
 *
 * Storage format for DART confidential keys in localStorage.
 * All keys are password-protected using Polkadot-standard cryptography (scrypt + XSalsa20-Poly1305)
 */

export interface EncryptedConfidentialKeyRecord {
  version: 1;
  name: string;
  public: {
    account: string; // hex string (account public key)
    encryption: string; // hex string (encryption public key)
  };
  private: {
    format: 'seed-hex';
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
    data: string; // base64-encoded encrypted ciphertext of the seed
  };
  metadata: {
    created: number; // Unix milliseconds
  };
}

// Type alias for consistency with existing code
export type AnyConfidentialKeyRecord = EncryptedConfidentialKeyRecord;
