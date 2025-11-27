/**
 * Check if a confidential account is registered on-chain
 */

import type { ApiPromise } from '@polkadot/api';

export interface CheckAccountRegistrationParams {
  /**
   * Account public key (hex string or JSON)
   */
  accountPublicKey: string;
  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;
}

/**
 * Check if an account public key is registered to a DID on-chain
 *
 * @param params - Check registration parameters
 * @returns The DID the account is registered to, or null if not registered
 */
export async function checkAccountRegistration(
  params: CheckAccountRegistrationParams,
): Promise<string | null> {
  const { accountPublicKey, polkadotApi } = params;

  try {
    // Query the chain to see if this account public key is registered to a DID
    const result =
      await polkadotApi.query.confidentialAssets.accountDid(accountPublicKey);

    // Check if result is None/null or has a value
    if (result.isNone || result.isEmpty) {
      return null;
    }

    // Extract the DID from the result
    return result.toString();
  } catch {
    // Return null on error rather than throwing - we'll assume not registered
    return null;
  }
}
