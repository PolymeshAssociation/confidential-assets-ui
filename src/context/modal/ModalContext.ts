import { createContext } from 'react';

export interface ModalContextType {
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openKeySelectionModal: () => void;
  closeKeySelectionModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);
