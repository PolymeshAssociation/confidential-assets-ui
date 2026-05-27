import type { ApiPromise } from '@polkadot/api';
import {
  AccountLeafPathBuilder,
  type AssetLeafPath,
  type AssetLeafPathAndRoot,
  AssetLeafPathBuilder,
} from '@polymesh/polymesh-dart-wasm';

/**
 * Parameters for building curve tree leaf path with root
 * Used for both account and asset curve trees
 */
export interface BuildCurveTreeLeafPathParams {
  /**
   * Current leaf index from state
   */
  currentLeafIndex: bigint;
  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;
}

/**
 * Build an account leaf path with root using AccountLeafPathBuilder
 *
 * This is a common operation for generating zero-knowledge proofs.
 * It fetches the curve tree data from the blockchain and builds the
 * leaf path required for proof generation.
 *
 * @param params - Parameters for building the leaf path
 * @returns AccountLeafPath with root ready for proof generation
 */
export async function buildAccountLeafPathWithRoot(
  params: BuildCurveTreeLeafPathParams,
) {
  const { currentLeafIndex, polkadotApi } = params;

  // Fetch last update timestamp and tree height from chain in parallel
  const [curveTreeLastUpdate, chainHeight] = await Promise.all([
    polkadotApi.query.confidentialAssets.accountCurveTreeLastUpdate(),
    polkadotApi.query.confidentialAssets.accountCurveTreeHeight(),
  ]);
  const treeHeight = chainHeight.toNumber();

  // Initialize the leaf path builder
  const accountLeafPathBuilder = new AccountLeafPathBuilder(
    currentLeafIndex,
    treeHeight,
    curveTreeLastUpdate.blockNumber.toNumber(),
  );

  // Get the indices and locations we need to query
  const accountLeafIndices = accountLeafPathBuilder.getLeafIndices();
  const nodeLocationsPaths = accountLeafPathBuilder.getNodeLocations();

  // Get the API at the historical block
  const blockHash = await polkadotApi.rpc.chain.getBlockHash(
    curveTreeLastUpdate.blockNumber,
  );
  const apiAt = await polkadotApi.at(blockHash);

  // Query the chain for the required leaves using multi query
  const leafIndicesArray = Array.from(accountLeafIndices);
  const accountLeavesOptions =
    await apiAt.query.confidentialAssets.accountLeaves.multi(leafIndicesArray);

  // Process the leaf results and add them to the path builder
  for (let i = 0; i < leafIndicesArray.length; i++) {
    const index = leafIndicesArray[i];
    if (accountLeavesOptions[i].isSome) {
      const leaf = accountLeavesOptions[i].unwrap();
      accountLeafPathBuilder.setLeaf(index, leaf);
    }
  }

  // Query the chain for the required inner nodes using multi query
  const nodeLocationsArray = Array.from(nodeLocationsPaths);
  const accountInnerNodesOptions =
    await apiAt.query.confidentialAssets.accountInnerNodes.multi(
      nodeLocationsArray,
    );

  // Process the node results and add them to the path builder
  for (let i = 0; i < nodeLocationsArray.length; i++) {
    if (accountInnerNodesOptions[i].isSome) {
      const node = accountInnerNodesOptions[i].unwrap().toU8a();
      accountLeafPathBuilder.setNodeAtIndex(i, node);
    }
  }

  // Query the chain for the account tree root
  const accountTreeRootOption =
    await apiAt.query.confidentialAssets.accountCurveTreeRoots(
      curveTreeLastUpdate.blockNumber,
    );
  if (accountTreeRootOption.isNone) {
    throw new Error(
      'Account tree root not found for the specified block. Cannot proceed with proof generation.',
    );
  }
  const accountTreeRoot = accountTreeRootOption.unwrap().toU8a();
  accountLeafPathBuilder.setRoot(accountTreeRoot);

  // Build and return the account leaf path with root
  return accountLeafPathBuilder.buildLeafPathWithRoot();
}

/**
 * Result from getting asset curve tree state
 */
export interface AssetCurveTreeState {
  /**
   * Asset tree root
   */
  root: Uint8Array;
  /**
   * Block number of the last update
   */
  blockNumber: number;
  /**
   * Block hash of the last update
   */
  blockHash: string;
}

/**
 * Get the current state of the asset curve tree (root and block info)
 *
 * @param polkadotApi - Polkadot API instance
 * @returns AssetCurveTreeState
 */
export async function getAssetCurveTreeState(
  polkadotApi: ApiPromise,
): Promise<AssetCurveTreeState> {
  // Get the last asset curve tree update block number
  const assetCurveTreeLastUpdate =
    await polkadotApi.query.confidentialAssets.assetCurveTreeLastUpdate();
  const blockNumber = assetCurveTreeLastUpdate.blockNumber.toNumber();

  // Get the block hash
  const blockHash = await polkadotApi.rpc.chain.getBlockHash(
    assetCurveTreeLastUpdate.blockNumber,
  );
  const blockHashHex = blockHash.toHex();

  // Get the API at the historical block
  const apiAt = await polkadotApi.at(blockHash);

  // Query the chain for the asset tree root
  const assetTreeRootOption =
    await apiAt.query.confidentialAssets.assetCurveTreeRoots(
      assetCurveTreeLastUpdate.blockNumber,
    );

  if (assetTreeRootOption.isNone) {
    throw new Error(
      'Asset tree root not found for the specified block. Cannot proceed with proof generation.',
    );
  }

  const root = assetTreeRootOption.unwrap().toU8a();

  return {
    root,
    blockNumber,
    blockHash: blockHashHex,
  };
}

/**
 * Parameters for building asset leaf path
 */
export interface BuildAssetLeafPathParams {
  /**
   * Current leaf index from state
   */
  currentLeafIndex: bigint;
  /**
   * Polkadot API instance
   */
  polkadotApi: ApiPromise;
  /**
   * Block number (must match the root)
   */
  blockNumber: number;
  /**
   * Block hash to query at (must match the root)
   * If not provided, will be fetched based on blockNumber
   */
  blockHash?: string;
}

/**
 * Helper to populate an AssetLeafPathBuilder with data from the chain
 */
async function populateAssetLeafPathBuilder(
  builder: AssetLeafPathBuilder,
  polkadotApi: ApiPromise,
  blockHash: string,
) {
  // Get the API at the historical block
  const apiAt = await polkadotApi.at(blockHash);

  // Get the indices and locations we need to query
  const assetLeafIndices = builder.getLeafIndices();
  const nodeLocationsPaths = builder.getNodeLocations();

  // Query the chain for the required leaves using multi query
  const leafIndicesArray = Array.from(assetLeafIndices);
  const assetLeavesOptions =
    await apiAt.query.confidentialAssets.assetLeaves.multi(leafIndicesArray);

  // Process the leaf results and add them to the path builder
  for (let i = 0; i < leafIndicesArray.length; i++) {
    const index = leafIndicesArray[i];
    if (assetLeavesOptions[i].isSome) {
      const leaf = assetLeavesOptions[i].unwrap();
      const leafBytes = leaf.toU8a();
      builder.setLeaf(index, leafBytes);
    }
  }

  // Query the chain for the required inner nodes using multi query
  const nodeLocationsArray = Array.from(nodeLocationsPaths);
  const assetInnerNodesOptions =
    await apiAt.query.confidentialAssets.assetInnerNodes.multi(
      nodeLocationsArray,
    );

  // Process the node results and add them to the path builder
  for (let i = 0; i < nodeLocationsArray.length; i++) {
    if (assetInnerNodesOptions[i].isSome) {
      const node = assetInnerNodesOptions[i].unwrap().toU8a();
      builder.setNodeAtIndex(i, node);
    }
  }
}

/**
 * Build an asset leaf path (without root) at a specific block
 *
 * @param params - Parameters for building the leaf path
 * @returns AssetLeafPath
 */
export async function buildAssetLeafPath(
  params: BuildAssetLeafPathParams,
): Promise<AssetLeafPath> {
  const { currentLeafIndex, polkadotApi, blockNumber } = params;
  let { blockHash } = params;

  // Fetch block hash and/or tree height from chain as needed
  const treeHeight = (
    await polkadotApi.query.confidentialAssets.assetCurveTreeHeight()
  ).toNumber();
  if (!blockHash) {
    const hash = await polkadotApi.rpc.chain.getBlockHash(blockNumber);
    blockHash = hash.toHex();
  }

  // Initialize the asset leaf path builder
  const assetLeafPathBuilder = new AssetLeafPathBuilder(
    currentLeafIndex,
    treeHeight,
    blockNumber,
  );

  await populateAssetLeafPathBuilder(
    assetLeafPathBuilder,
    polkadotApi,
    blockHash,
  );

  return assetLeafPathBuilder.buildLeafPath();
}

/**
 * Result from building asset leaf path
 */
export interface AssetLeafPathResult {
  /**
   * Asset leaf path without root (for addAssetPath)
   */
  leafPath: AssetLeafPath;
  /**
   * Asset leaf path with root (for other operations)
   */
  leafPathWithRoot: AssetLeafPathAndRoot;
}

/**
 * Build an asset leaf path with root using AssetLeafPathBuilder
 *
 * This is a common operation for generating zero-knowledge proofs
 * that require asset curve tree data.
 * It fetches the asset curve tree data from the blockchain and builds the
 * leaf path required for proof generation.
 *
 * @param params - Parameters for building the leaf path
 * @returns Both AssetLeafPath and AssetLeafPathAndRoot for different use cases
 */
export async function buildAssetLeafPathWithRoot(
  params: BuildCurveTreeLeafPathParams,
): Promise<AssetLeafPathResult> {
  const { currentLeafIndex, polkadotApi } = params;

  // Fetch current state and tree height from chain in parallel
  const [state, chainHeight] = await Promise.all([
    getAssetCurveTreeState(polkadotApi),
    polkadotApi.query.confidentialAssets.assetCurveTreeHeight(),
  ]);
  const treeHeight = chainHeight.toNumber();

  // Initialize the asset leaf path builder
  const assetLeafPathBuilder = new AssetLeafPathBuilder(
    currentLeafIndex,
    treeHeight,
    state.blockNumber,
  );

  await populateAssetLeafPathBuilder(
    assetLeafPathBuilder,
    polkadotApi,
    state.blockHash,
  );

  assetLeafPathBuilder.setRoot(state.root);

  return {
    leafPath: assetLeafPathBuilder.buildLeafPath(),
    leafPathWithRoot: assetLeafPathBuilder.buildLeafPathWithRoot(),
  };
}
