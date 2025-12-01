import { SigningKeySelectionModal } from '@/components/SigningKeySelectionModal';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { ModalContext } from './ModalContext';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [keySelectionModalOpen, setKeySelectionModalOpen] = useState(false);

  const openWalletModal = useCallback(() => {
    setWalletModalOpen(true);
  }, []);

  const closeWalletModal = useCallback(() => {
    setWalletModalOpen(false);
  }, []);

  const openKeySelectionModal = useCallback(() => {
    setKeySelectionModalOpen(true);
  }, []);

  const closeKeySelectionModal = useCallback(() => {
    setKeySelectionModalOpen(false);
  }, []);

  const value = {
    openWalletModal,
    closeWalletModal,
    openKeySelectionModal,
    closeKeySelectionModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <WalletConnectionModal
        opened={walletModalOpen}
        onClose={closeWalletModal}
      />
      <SigningKeySelectionModal
        opened={keySelectionModalOpen}
        onClose={closeKeySelectionModal}
      />
    </ModalContext.Provider>
  );
}
