import type { TransactionContextValue } from '@/context/transaction';
import { TransactionContext } from '@/context/transaction';
import { useContext } from 'react';

export function useTransaction(): TransactionContextValue {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }

  return context;
}
