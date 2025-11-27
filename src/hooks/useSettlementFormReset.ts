/**
 * useSettlementFormReset Hook
 *
 * Handles form reset logic when settlement modals close.
 * Uses a timeout to ensure smooth modal close animation.
 */

import { useEffect } from 'react';

/**
 * Hook for resetting settlement form state when modal closes
 *
 * @param opened - Whether the modal is currently opened
 * @param resetCallback - Callback function to reset form state
 * @param delay - Delay in milliseconds before resetting (default: 200ms)
 */
export function useSettlementFormReset(
  opened: boolean,
  resetCallback: () => void,
  delay = 200,
): void {
  useEffect(() => {
    if (!opened) {
      const timeoutId = setTimeout(() => {
        resetCallback();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [opened, resetCallback, delay]);
}
