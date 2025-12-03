/**
 * Type definitions for password validation
 */

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  error?: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  error: string | null;
  strength: PasswordStrength;
  breachCheck?: BreachCheckResult;
}
