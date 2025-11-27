import { AssetContext } from '@/context/asset/AssetContext';
import { useContext } from 'react';

export function useAsset() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within AssetProvider');
  }
  return context;
}
