/**
 * Token amount conversion utilities
 *
 * Utilities for converting between human-readable decimal amounts
 * and scaled integer amounts (smallest units) for blockchain transactions
 */

/**
 * Convert a decimal token amount to the smallest unit
 * @param decimalAmount - The human-readable amount (e.g., "5.5")
 * @param decimals - Number of decimal places for the token
 * @returns Scaled amount as string (e.g., "5500000" for 5.5 with 6 decimals)
 * @throws Error if the amount is invalid
 */
export function toSmallestUnit(
  decimalAmount: string | number,
  decimals: number,
): string {
  const amount =
    typeof decimalAmount === 'string'
      ? parseFloat(decimalAmount)
      : decimalAmount;

  if (isNaN(amount) || amount < 0) {
    throw new Error(`Invalid amount: ${decimalAmount}`);
  }

  if (decimals < 0 || !Number.isInteger(decimals)) {
    throw new Error(`Invalid decimals: ${decimals}`);
  }

  // Multiply by 10^decimals and round down to handle floating point precision
  const scaled = Math.floor(amount * Math.pow(10, decimals));

  return scaled.toString();
}

/**
 * Convert a scaled integer amount to decimal format
 * @param scaledAmount - The amount in smallest units (e.g., "5500000")
 * @param decimals - Number of decimal places for the token
 * @returns Human-readable decimal amount (e.g., "5.5")
 */
export function fromSmallestUnit(
  scaledAmount: string | number | bigint,
  decimals: number,
): string {
  if (decimals === 0) {
    return scaledAmount.toString();
  }

  const amount =
    typeof scaledAmount === 'bigint'
      ? scaledAmount
      : BigInt(scaledAmount.toString());

  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  // Pad fractional part with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');

  // Remove trailing zeros
  const trimmedFractional = fractionalStr.replace(/0+$/, '');

  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Validate that a decimal amount doesn't exceed the maximum precision
 * @param decimalAmount - The amount to validate
 * @param decimals - Maximum number of decimal places allowed
 * @returns true if valid
 */
export function validateDecimalPrecision(
  decimalAmount: string,
  decimals: number,
): boolean {
  const parts = decimalAmount.split('.');
  if (parts.length === 1) {
    return true; // No decimal part
  }

  const decimalPart = parts[1];
  return decimalPart.length <= decimals;
}
