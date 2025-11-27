import { createContext } from 'react';
import type { ConfidentialKeyContextValue } from './types';

export const ConfidentialKeyContext = createContext<
  ConfidentialKeyContextValue | undefined
>(undefined);
