import { polymeshTheme } from '@/theme/mantine-theme';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { ThemeMode } from './ThemeContext';
import { ThemeContext } from './ThemeContext';

import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const THEME_STORAGE_KEY = 'polymesh_theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Try to load theme from localStorage
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  });

  // Persist theme mode to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setThemeMode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider theme={polymeshTheme} forceColorScheme={mode}>
        <ModalsProvider>
          <Notifications />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </ThemeContext.Provider>
  );
}
