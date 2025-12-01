import { ConfidentialAccountSelectionModal } from '@/components/ConfidentialAccountSelectionModal';
import { SigningKeySelectionModal } from '@/components/SigningKeySelectionModal';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { ModalContext } from './ModalContext';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [keySelectionModalOpen, setKeySelectionModalOpen] = useState(false);
  const [confidentialAccountModalOpen, setConfidentialAccountModalOpen] =
    useState(false);

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

  const openConfidentialAccountModal = useCallback(() => {
    setConfidentialAccountModalOpen(true);
  }, []);

  const closeConfidentialAccountModal = useCallback(() => {
    setConfidentialAccountModalOpen(false);
  }, []);

  const value = {
    openWalletModal,
    closeWalletModal,
    openKeySelectionModal,
    closeKeySelectionModal,
    openConfidentialAccountModal,
    closeConfidentialAccountModal,
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
      <ConfidentialAccountSelectionModal
        opened={confidentialAccountModalOpen}
        onClose={closeConfidentialAccountModal}
      />
    </ModalContext.Provider>
  );
}
