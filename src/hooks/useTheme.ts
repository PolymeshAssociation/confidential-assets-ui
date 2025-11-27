import type { ThemeContextValue } from '@/context/theme';
import { ThemeContext } from '@/context/theme';
import { useContext } from 'react';

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
