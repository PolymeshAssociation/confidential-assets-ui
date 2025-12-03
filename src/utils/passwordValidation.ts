import {
  ENABLE_BREACH_CHECK,
  HIBP_API_ENDPOINT,
  MIN_PASSWORD_LENGTH,
  PASSWORD_STRENGTH_THRESHOLDS,
} from '@/config/passwordConfig';
import type {
  BreachCheckResult,
  PasswordStrength,
  PasswordValidationResult,
} from '@/types/password';

/**
 * Calculate password strength based on length
 * Modern approach: length is the primary factor for password strength
 */
export function getStrength(password: string): PasswordStrength {
  const length = password.length;

  if (length >= PASSWORD_STRENGTH_THRESHOLDS.STRONG) {
    return 'strong';
  }
  if (length >= PASSWORD_STRENGTH_THRESHOLDS.GOOD) {
    return 'good';
  }
  if (length >= PASSWORD_STRENGTH_THRESHOLDS.FAIR) {
    return 'fair';
  }
  return 'weak';
}

/**
 * Convert password strength to percentage for progress bar
 */
export function getStrengthPercentage(strength: PasswordStrength): number {
  switch (strength) {
    case 'strong':
      return 100;
    case 'good':
      return 75;
    case 'fair':
      return 50;
    case 'weak':
    default:
      return 25;
  }
}

/**
 * Check if password has been compromised using Have I Been Pwned API
 * Uses k-anonymity model: only first 5 chars of SHA-1 hash are sent
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export async function checkPasswordBreach(
  password: string,
): Promise<BreachCheckResult> {
  if (!ENABLE_BREACH_CHECK) {
    return { isBreached: false, breachCount: 0 };
  }

  try {
    // Hash password with SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const hashUpper = hashHex.toUpperCase();

    // Send only first 5 characters to API (k-anonymity)
    const prefix = hashUpper.substring(0, 5);
    const suffix = hashUpper.substring(5);

    const response = await fetch(`${HIBP_API_ENDPOINT}${prefix}`, {
      headers: {
        'User-Agent': 'Polymesh-Confidential-Asset-UI',
      },
    });

    if (!response.ok) {
      // Service unavailable - don't block user
      return {
        isBreached: false,
        breachCount: 0,
        error: 'Password breach check service unavailable',
      };
    }

    const text = await response.text();
    const lines = text.split('\n');
    // Check if our hash suffix appears in the response
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return {
          isBreached: true,
          breachCount: parseInt(count, 10),
        };
      }
    }

    return { isBreached: false, breachCount: 0 };
  } catch (error) {
    // Network error or other issue - don't block user
    console.warn('[Password Validation] Breach check failed:', error);
    return {
      isBreached: false,
      breachCount: 0,
      error: 'Unable to check password breach status',
    };
  }
}

/**
 * Validate password according to modern best practices
 * - Minimum length requirement (no character composition requirements)
 * - Optional breach checking via Have I Been Pwned
 */
export async function validatePassword(
  password: string,
): Promise<PasswordValidationResult> {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
      strength: 'weak',
    };
  }

  // Check minimum length
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      strength: 'weak',
    };
  }

  const strength = getStrength(password);
  const breachCheck = await checkPasswordBreach(password);

  return {
    isValid: true,
    error: null,
    strength,
    breachCheck,
  };
}

/**
 * Synchronous validation for form validation (without breach check)
 * Use this for real-time form validation, then call validatePassword for final check
 */
export function validatePasswordSync(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return null;
}
