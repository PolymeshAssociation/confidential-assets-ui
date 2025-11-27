import type { ConfidentialKeyContextValue } from '@/context/confidential-key';
import { ConfidentialKeyContext } from '@/context/confidential-key';
import { useContext } from 'react';

export function useConfidentialKey(): ConfidentialKeyContextValue {
  const context = useContext(ConfidentialKeyContext);
  if (!context) {
    throw new Error(
      'useConfidentialKey must be used within a ConfidentialKeyProvider',
    );
  }
  return context;
}
