/**
 * Password validation configuration
 * Based on NIST SP 800-63B guidelines
 */

// Minimum password length (NIST recommends 12-15+ characters)
export const MIN_PASSWORD_LENGTH = parseInt(
  import.meta.env.VITE_MIN_PASSWORD_LENGTH || '12',
  10,
);

// Enable/disable breach checking via Have I Been Pwned API
export const ENABLE_BREACH_CHECK =
  import.meta.env.VITE_ENABLE_BREACH_CHECK !== 'false';

// Have I Been Pwned API endpoint for password range queries
export const HIBP_API_ENDPOINT = 'https://api.pwnedpasswords.com/range/';

// Password strength thresholds based on length
export const PASSWORD_STRENGTH_THRESHOLDS = {
  FAIR: MIN_PASSWORD_LENGTH, // 12 chars
  GOOD: 16, // 16 chars
  STRONG: 20, // 20+ chars
} as const;
