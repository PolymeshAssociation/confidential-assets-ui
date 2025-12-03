import { EXPLORER_URL_TEMPLATE } from '@/config/explorerConfig';

/**
 * Parameters for building an explorer URL
 */
export interface ExplorerUrlParams {
  blockNumber?: number;
  blockHash?: string;
  extrinsicHash?: string;
  txIndex?: number;
}

/**
 * Format extrinsic ID as blockNumber-txIndex
 * @example getExtrinsicId(12345, 2) => "12345-2"
 */
export function getExtrinsicId(blockNumber: number, txIndex: number): string {
  return `${blockNumber}-${txIndex}`;
}

/**
 * Build blockchain explorer URL from template with variable substitution
 * Returns null if no template configured or required variables are missing
 */
export function buildExplorerUrl(params: ExplorerUrlParams): string | null {
  const { blockNumber, blockHash, extrinsicHash, txIndex } = params;

  // No template configured
  if (!EXPLORER_URL_TEMPLATE) {
    return null;
  }

  let url = EXPLORER_URL_TEMPLATE;

  // Replace template variables
  // Priority: extrinsic-specific > block-specific

  // {extrinsicId} requires both blockNumber and txIndex
  if (url.includes('{extrinsicId}')) {
    if (blockNumber !== undefined && txIndex !== undefined) {
      const extrinsicId = getExtrinsicId(blockNumber, txIndex);
      url = url.replace(/{extrinsicId}/g, extrinsicId);
    } else {
      // Missing required data for extrinsicId
      return null;
    }
  }

  // {extrinsicHash}
  if (url.includes('{extrinsicHash}')) {
    if (extrinsicHash) {
      url = url.replace(/{extrinsicHash}/g, extrinsicHash);
    } else {
      // Missing required data for extrinsicHash
      return null;
    }
  }

  // {blockNumber}
  if (url.includes('{blockNumber}')) {
    if (blockNumber !== undefined) {
      url = url.replace(/{blockNumber}/g, blockNumber.toString());
    } else {
      // Missing required data for blockNumber
      return null;
    }
  }

  // {blockHash}
  if (url.includes('{blockHash}')) {
    if (blockHash) {
      url = url.replace(/{blockHash}/g, blockHash);
    } else {
      // Missing required data for blockHash
      return null;
    }
  }

  return url;
}
