/**
 * Asset Context
 */

import { createContext } from 'react';
import type { AssetContextValue } from './types';

export const AssetContext = createContext<AssetContextValue | null>(null);
