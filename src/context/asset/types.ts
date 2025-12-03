/**
 * Asset Context Types
 */

import type { AssetDetails, AssetMetadata } from '@/types/asset';

export interface AssetContextValue {
  // Asset state - simplified to single source of truth
  assetDetailsMap: Map<string, AssetDetails>; // All asset details by assetId
  ownedAssetIds: string[]; // Asset IDs owned by current DID
  registeredAssetBalances: Map<string, string>; // Balances for registered assets

  // Derived arrays - automatically updated from above data
  ownedAssets: AssetDetails[]; // Assets owned by current DID
  registeredAssets: (AssetDetails & { balance?: string })[]; // Assets registered to confidential account

  isLoading: boolean;
  error: string | null;

  // Asset operations
  createAsset: (params: CreateAssetParams) => Promise<string>; // Returns asset ID
  registerAsset: (params: RegisterAssetParams) => Promise<void>;
  mintAsset: (params: MintAssetParams) => Promise<MintAssetResult>;

  // Asset queries
  getAssetDetails: (assetId: string) => Promise<AssetDetails | null>; // Fetch and cache asset details

  // Data refresh
  refreshOwnedAssets: () => void;
  refreshRegisteredAssets: () => Promise<void>;
}

export interface CreateAssetParams {
  name: string;
  symbol: string;
  decimals: number; // Number of decimal places for divisibility - 0 to 8 (max)
  metadata: AssetMetadata;
  mediators: string[]; // Encryption public key hex strings
  auditors: string[]; // Encryption public key hex strings
}

export interface RegisterAssetParams {
  assetId: string;
  onProgress?: (step: string) => void;
}

export interface MintAssetParams {
  assetId: string;
  amount: string;
  onProgress?: (step: string) => void;
}

export interface MintAssetResult {
  txHash: string;
  blockNumber: number;
  blockHash: string;
}
