import { createContext } from 'react';
import type { PolymeshContextValue } from './types';

export const PolymeshContext = createContext<PolymeshContextValue | undefined>(
  undefined,
);
