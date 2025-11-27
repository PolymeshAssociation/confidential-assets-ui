import { notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { NotificationContext } from './NotificationContext';

type NotificationColor = 'blue' | 'red' | 'green' | 'yellow';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showNotification = useCallback(
    (message: string, color: NotificationColor = 'blue') => {
      notifications.show({
        message,
        color,
        position: 'bottom-right',
        autoClose: 6000,
      });
    },
    [],
  );

  const showError = useCallback((message: string) => {
    notifications.show({
      title: 'Error',
      message,
      color: 'red',
      position: 'bottom-right',
      autoClose: 6000,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    notifications.show({
      title: 'Success',
      message,
      color: 'green',
      position: 'bottom-right',
      autoClose: 6000,
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    notifications.show({
      message,
      color: 'blue',
      position: 'bottom-right',
      autoClose: 6000,
    });
  }, []);

  const showWarning = useCallback((message: string) => {
    notifications.show({
      title: 'Warning',
      message,
      color: 'yellow',
      position: 'bottom-right',
      autoClose: 6000,
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showError,
        showSuccess,
        showInfo,
        showWarning,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
