/**
 * Number formatting utilities
 */

/**
 * Format a token amount with decimals, automatically removing trailing zeros
 * @param rawAmount - The raw amount as a string (scaled integer)
 * @param decimals - Number of decimal places
 * @returns Formatted number string without unnecessary trailing zeros
 */
export function formatTokenAmount(
  rawAmount: string | number,
  decimals: number = 0,
): string {
  if (decimals === 0) {
    return rawAmount.toString();
  }

  const amount =
    typeof rawAmount === 'string' ? BigInt(rawAmount) : BigInt(rawAmount);
  const divisor = BigInt(10 ** decimals);

  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  // If no fractional part, just return integer
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  // Convert fractional part to string and pad with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');

  // Remove trailing zeros
  const trimmedFractional = fractionalStr.replace(/0+$/, '');

  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Format a number with thousand separators
 * @param value - Number or string to format
 * @returns Formatted string with commas
 */
export function formatWithCommas(value: string | number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a token amount with decimals and thousand separators
 * @param rawAmount - The raw amount as a string (scaled integer)
 * @param decimals - Number of decimal places
 * @returns Formatted number string with commas and without unnecessary trailing zeros
 */
export function formatTokenAmountWithCommas(
  rawAmount: string | number,
  decimals: number = 0,
): string {
  const formatted = formatTokenAmount(rawAmount, decimals);
  const [integerPart, fractionalPart] = formatted.split('.');

  const formattedInteger = formatWithCommas(integerPart);

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
}
