import {
  NovaWalletLogo,
  PolkadotSymbol,
  PolymeshSymbol,
  SubWalletSymbol,
  TalismanSymbol,
} from '@/assets/icons';
import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertCircle, IconDownload, IconWallet } from '@tabler/icons-react';
import classes from './WalletConnectionModal.module.css';

interface WalletConnectionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function WalletConnectionModal({
  opened,
  onClose,
}: WalletConnectionModalProps) {
  const {
    connectWallet,
    availableWallets,
    connectedWalletId,
    isWalletConnecting,
  } = usePolymesh();
  const { openKeySelectionModal } = useModal();

  const handleConnect = async (walletId: string) => {
    try {
      await connectWallet(walletId);
      // Only open key selection modal if connection succeeded
      openKeySelectionModal();
      onClose();
    } catch {
      // Error is already handled by PolymeshProvider (toast notification)
      // Just don't open the key selection modal
    }
  };

  const getWalletUrl = (walletName: string) => {
    switch (walletName) {
      case 'polywallet':
        return 'https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf';
      case 'polkadot-js':
        return 'https://polkadot.js.org/extension/';
      case 'subwallet-js':
        return 'https://subwallet.app/';
      case 'talisman':
        return 'https://talisman.xyz/';
      case 'nova-wallet':
        return 'https://novawallet.io/';
      default:
        return '#';
    }
  };

  const getWalletDisplayName = (name: string) => {
    switch (name) {
      case 'polywallet':
        return 'Polymesh Wallet';
      case 'polkadot-js':
        return 'Polkadot.js';
      case 'subwallet-js':
        return 'SubWallet';
      case 'talisman':
        return 'Talisman';
      case 'nova-wallet':
        return 'Nova Wallet';
      default:
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  const getWalletIcon = (walletName: string) => {
    switch (walletName) {
      case 'polywallet':
        return <PolymeshSymbol width={32} height={32} />;
      case 'polkadot-js':
        return <PolkadotSymbol width={32} height={32} />;
      case 'subwallet-js':
        return <SubWalletSymbol width={32} height={32} />;
      case 'talisman':
        return <TalismanSymbol width={32} height={32} />;
      case 'nova-wallet':
        return <NovaWalletLogo width={32} height={32} />;
      default:
        return (
          <ThemeIcon size={32} variant="transparent" color="gray">
            <IconWallet size={32} />
          </ThemeIcon>
        );
    }
  };

  const getWalletDescription = (walletName: string) => {
    switch (walletName) {
      case 'polywallet':
        return 'Official Polymesh wallet extension';
      case 'polkadot-js':
        return 'Popular Polkadot ecosystem wallet';
      case 'subwallet-js':
        return 'Multi-chain wallet for Polkadot';
      case 'talisman':
        return 'Feature-rich Polkadot wallet';
      case 'nova-wallet':
        return 'Mobile wallet for iOS and Android';
      default:
        return '';
    }
  };

  // Filter wallets to display
  const displayedWallets = availableWallets.filter((wallet) => {
    // Hide Nova Wallet if not installed (it's mobile only)
    if (wallet.name === 'nova-wallet' && !wallet.isInstalled) {
      return false;
    }
    return true;
  });

  const hasInstalledWallets = displayedWallets.some((w) => w.isInstalled);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={hasInstalledWallets ? 'Connect Wallet' : 'No Wallet Found'}
      centered
      size="md"
      transitionProps={{
        transition: 'pop',
        duration: 300,
        timingFunction: 'linear',
      }}
      zIndex={300}
    >
      <Stack gap="md">
        {!hasInstalledWallets && (
          <Alert
            icon={<IconAlertCircle size={20} />}
            title="No Compatible Wallet Detected"
            color="red"
          >
            <Text size="sm">
              To use this application, you need to install a Polymesh-compatible
              wallet extension.
            </Text>
          </Alert>
        )}

        <Text size="sm" c="dimmed">
          {hasInstalledWallets
            ? 'Select a wallet to connect to the Polymesh network.'
            : 'Choose and install one of the following wallet extensions:'}
        </Text>

        <Stack gap="xs">
          {displayedWallets.map((wallet) => {
            const isConnected = connectedWalletId === wallet.name;
            const canClick = !isConnected && wallet.isInstalled;
            return (
              <div
                key={wallet.name}
                onClick={() => canClick && handleConnect(wallet.name)}
                className={classes.walletCard}
                data-disabled={!canClick || undefined}
              >
                <Group gap="md" wrap="nowrap" align="center">
                  {getWalletIcon(wallet.name)}
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={500}>{getWalletDisplayName(wallet.name)}</Text>
                    {!wallet.isInstalled && (
                      <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
                        {getWalletDescription(wallet.name)}
                      </Text>
                    )}
                  </Stack>
                  {wallet.isInstalled ? (
                    isConnected ? (
                      <Text size="xs" fw={600} c="green">
                        Connected
                      </Text>
                    ) : (
                      <Button
                        variant="light"
                        size="xs"
                        loading={isWalletConnecting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(wallet.name);
                        }}
                      >
                        Connect
                      </Button>
                    )
                  ) : (
                    <Button
                      component="a"
                      href={getWalletUrl(wallet.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="subtle"
                      size="xs"
                      leftSection={<IconDownload size={14} />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Install
                    </Button>
                  )}
                </Group>
              </div>
            );
          })}

          {displayedWallets.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No supported wallets detected. Please install one of the wallets
              above.
            </Text>
          )}
        </Stack>

        {!hasInstalledWallets && (
          <>
            <Divider />
            <Alert color="blue" variant="light">
              <Text size="sm">
                <strong>After installing:</strong> Refresh this page and click
                "Connect Wallet" to get started.
              </Text>
            </Alert>
          </>
        )}

        {hasInstalledWallets && (
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            By connecting a wallet, you agree to our Terms of Service and
            Privacy Policy.
          </Text>
        )}
      </Stack>
    </Modal>
  );
}
