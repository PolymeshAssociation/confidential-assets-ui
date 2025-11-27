/**
 * useSettlement Hook
 *
 * Access settlement context
 */

import { SettlementContext } from '@/context/settlement/SettlementContext';
import { useContext } from 'react';

export function useSettlement() {
  const context = useContext(SettlementContext);

  if (!context) {
    throw new Error('useSettlement must be used within a SettlementProvider');
  }

  return context;
}
