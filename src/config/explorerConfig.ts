/**
 * Blockchain Explorer Configuration
 * Supports URL templating for different blockchain explorers
 */

// Explorer URL template from environment
// Supported template variables:
// - {blockNumber} - Block number (e.g., 12345)
// - {blockHash} - Block hash (e.g., 0x1234...)
// - {extrinsicHash} - Transaction/extrinsic hash (e.g., 0xabcd...)
// - {extrinsicId} - Extrinsic ID format: blockNumber-txIndex (e.g., 12345-2)
export const EXPLORER_URL_TEMPLATE = import.meta.env.VITE_EXPLORER_URL || '';

// Examples of valid templates:
// https://staging-app.polymesh.dev/#/explorer/query/{blockNumber}
// https://polymesh.subscan.io/block/{blockNumber}
// https://polymesh.subscan.io/extrinsic/{extrinsicId}
// https://polymesh.subscan.io/extrinsic/{extrinsicHash}
