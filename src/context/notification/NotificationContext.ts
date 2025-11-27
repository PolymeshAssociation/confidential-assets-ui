import { createContext } from 'react';

type NotificationColor = 'blue' | 'red' | 'green' | 'yellow';

export interface NotificationContextValue {
  showNotification: (message: string, color?: NotificationColor) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);
