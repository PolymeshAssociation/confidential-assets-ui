import type { PolymeshContextValue } from '@/context/polymesh';
import { PolymeshContext } from '@/context/polymesh';
import { useContext } from 'react';

export function usePolymesh(): PolymeshContextValue {
  const context = useContext(PolymeshContext);
  if (!context) {
    throw new Error('usePolymesh must be used within a PolymeshProvider');
  }
  return context;
}
