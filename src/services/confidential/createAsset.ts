/**
 * Confidential Asset Creation Service
 *
 * Handles creation of confidential assets on-chain
 */

import type { TransactionState } from '@/context/transaction';
import type { AssetMetadata } from '@/types/asset';
import { encodeMetadata } from '@/utils/metadata';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BTreeMap, BTreeSet } from '@polkadot/types';
import type {
  PolymeshDartBpKeysAccountPublicKey,
  PolymeshDartBpKeysEncryptionPublicKey,
} from '@polkadot/types/lookup';
import type { ISubmittableResult } from '@polkadot/types/types';

export interface CreateAssetParams {
  /**
   * Full name of the asset
   */
  name: string;

  /**
   * Short identifier (e.g., BTC, AAPL, GOLD, USDC)
   */
  symbol: string;

  /**
   * Number of decimal places for divisibility - 0 to 8 (max)
   * Note: This should be set as low as possible to keep
   * decryption time low and prevent low, decimal adjusted, maximum total supply.
   */
  decimals: number;

  /**
   * Array of mediator encryption public keys (hex strings)
   */
  mediators: string[];

  /**
   * Array of auditor encryption public keys (hex strings)
   */
  auditors: string[];

  /**
   * Asset metadata
   */
  metadata: AssetMetadata;

  /**
   * Polkadot API instance from SDK
   */
  polkadotApi: ApiPromise;

  /**
   * Transaction submission function from useTransaction hook
   */
  submitTransaction: (params: {
    tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
    tag: string;
    onStatusChange?: (state: TransactionState) => void;
  }) => Promise<{
    txHash: string;
    blockHash: string;
    blockNumber: number;
    txIndex: number;
  }>;
}

export interface CreateAssetResult {
  /**
   * On-chain asset ID (extracted from events)
   */
  assetId: string;

  /**
   * Transaction hash
   */
  txHash: string;

  /**
   * Block hash where asset was created
   */
  blockHash: string;

  /**
   * Block number where asset was created
   */
  blockNumber: number;

  /**
   * Transaction index
   */
  txIndex: number;
}

/**
 * Create a new confidential asset on-chain
 *
 * @param params - Asset creation parameters
 * @returns Transaction result with asset ID
 */
export async function createConfidentialAsset(
  params: CreateAssetParams,
): Promise<CreateAssetResult> {
  const {
    name,
    symbol,
    decimals,
    metadata,
    mediators,
    auditors,
    polkadotApi,
    submitTransaction,
  } = params;

  // Encode metadata to compact JSON
  const encodedMetadata = encodeMetadata(metadata);

  // Convert hex string arrays to proper codec types
  // Look up the account public key for each mediator encryption key from chain
  const mediatorMap = new Map<
    PolymeshDartBpKeysAccountPublicKey,
    PolymeshDartBpKeysEncryptionPublicKey
  >();
  for (const encKeyHex of mediators) {
    const accountKeyOption =
      await polkadotApi.query.confidentialAssets.encryptionKeyAccount(
        encKeyHex,
      );
    if (accountKeyOption.isNone) {
      throw new Error(
        `Mediator encryption key ${encKeyHex} is not registered on-chain`,
      );
    }
    const mediatorEncKey = polkadotApi.createType(
      'PolymeshDartBpKeysEncryptionPublicKey',
      encKeyHex,
    ) as PolymeshDartBpKeysEncryptionPublicKey;

    mediatorMap.set(accountKeyOption.unwrap(), mediatorEncKey);
  }
  const mediatorKeys = polkadotApi.createType(
    'BTreeMap<PolymeshDartBpKeysAccountPublicKey, PolymeshDartBpKeysEncryptionPublicKey>',
    mediatorMap,
  ) as BTreeMap<
    PolymeshDartBpKeysAccountPublicKey,
    PolymeshDartBpKeysEncryptionPublicKey
  >;
  const auditorKeys = polkadotApi.createType(
    'BTreeSet<PolymeshDartBpKeysEncryptionPublicKey>',
    auditors.map((hex) =>
      polkadotApi.createType('PolymeshDartBpKeysEncryptionPublicKey', hex),
    ),
  ) as BTreeSet<PolymeshDartBpKeysEncryptionPublicKey>;

  // Build and submit transaction
  const tx = polkadotApi.tx.confidentialAssets.createAsset(
    name,
    symbol,
    decimals,
    mediatorKeys,
    auditorKeys,
    encodedMetadata,
  );

  const result = await submitTransaction({
    tx,
    tag: 'confidentialAssets.createAsset',
  });

  // Extract asset ID from events
  let extractedAssetId: string | null = null;

  try {
    const blockHash = result.blockHash;
    const apiAt = await polkadotApi.at(blockHash);
    const allEvents = await apiAt.query.system.events();

    // Look for AssetCreated event
    allEvents.forEach((record) => {
      const { event } = record;

      if (polkadotApi.events.confidentialAssets.AssetCreated.is(event)) {
        const assetId = event.data.assetId;
        extractedAssetId = assetId.toString();
      }
    });
  } catch {
    throw new Error('Asset created but failed to extract asset ID from events');
  }

  if (!extractedAssetId) {
    throw new Error('Asset created but asset ID not found in events');
  }

  return {
    ...result,
    assetId: extractedAssetId,
  };
}
