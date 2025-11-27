import type { NotificationContextValue } from '@/context/notification';
import { NotificationContext } from '@/context/notification';
import { useContext } from 'react';

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
}
