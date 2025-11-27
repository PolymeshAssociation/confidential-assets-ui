import { createContext } from 'react';
import type { TransactionContextValue } from './types';

export const TransactionContext = createContext<
  TransactionContextValue | undefined
>(undefined);
