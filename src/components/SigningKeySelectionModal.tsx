import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Group,
  List,
  Modal,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconLogout,
  IconSearch,
  IconWallet,
} from '@tabler/icons-react';
import { Polkicon } from '@w3ux/react-polkicon';
import { useMemo, useState } from 'react';
import classes from './SigningKeySelectionModal.module.css';

interface SigningKeySelectionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SigningKeySelectionModal({
  opened,
  onClose,
}: SigningKeySelectionModalProps) {
  const {
    accounts,
    selectedAccount,
    selectAccount,
    disconnectWallet,
    accountBalance,
    accountIdentity,
    isAccountLoading,
    connectedWalletId,
    isWalletConnecting,
  } = usePolymesh();
  const { openWalletModal } = useModal();
  const { colorScheme } = useMantineColorScheme();

  const [search, setSearch] = useState('');
  const [sortByName, setSortByName] = useState(false);

  const filteredAccounts = useMemo(() => {
    const query = search.toLowerCase();
    let filtered = accounts.filter(
      (acc) =>
        acc.name?.toLowerCase().includes(query) ||
        acc.address.toLowerCase().includes(query),
    );

    // Sort if enabled
    if (sortByName) {
      filtered = [...filtered].sort((a, b) => {
        const nameA = a.name || a.address;
        const nameB = b.name || b.address;
        return nameA.localeCompare(nameB);
      });
    }

    // Move selected account to the top
    if (selectedAccount) {
      const selectedIndex = filtered.findIndex(
        (acc) => acc.address === selectedAccount.address,
      );
      if (selectedIndex > 0) {
        const selected = filtered.splice(selectedIndex, 1)[0];
        filtered.unshift(selected);
      }
    }

    return filtered;
  }, [accounts, search, sortByName, selectedAccount]);

  const handleSwitchWallet = () => {
    openWalletModal();
    onClose();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
  };

  const walletName = connectedWalletId || 'your wallet';
  const hasNoAccounts = accounts.length === 0;

  // Only open modal when not connecting to ensure content is ready to render
  const shouldOpen = opened && !isWalletConnecting;

  return (
    <Modal
      opened={shouldOpen}
      onClose={onClose}
      title={hasNoAccounts ? 'No Accounts Found' : 'Signing Keys'}
      centered
      size="md"
      transitionProps={{
        transition: 'pop',
        duration: 300,
        timingFunction: 'linear',
      }}
    >
      <Stack gap="md">
        {/* No Accounts Alert */}
        {hasNoAccounts && (
          <>
            <Alert
              icon={<IconAlertCircle size={20} />}
              title="Wallet Connected, But No Accounts Available"
              color="yellow"
            >
              <Text size="sm">
                Your wallet is connected, but no accounts were found or
                authorized.
              </Text>
            </Alert>

            <div>
              <Text size="sm" fw={600} mb="sm">
                What you need to do:
              </Text>
              <List spacing="xs" size="sm">
                <List.Item>
                  Create an account in {walletName} if you don't have one yet
                </List.Item>
                <List.Item>
                  Authorize this application to access your accounts in{' '}
                  {walletName}
                </List.Item>
                <List.Item>
                  After creating or authorizing accounts, refresh this page or
                  reconnect your wallet
                </List.Item>
              </List>
            </div>

            <Alert color="blue" variant="light">
              <Text size="sm">
                <strong>Tip:</strong> Most wallets have a settings or
                permissions section where you can manage which applications can
                access your accounts.
              </Text>
            </Alert>
          </>
        )}

        {/* Current Account Section */}
        {selectedAccount && (
          <Box
            p="md"
            style={(theme) => ({
              backgroundColor:
                colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              borderRadius: theme.radius.md,
            })}
          >
            <Group align="flex-start" wrap="nowrap">
              <Polkicon
                address={selectedAccount.address}
                fontSize="40px"
                background="transparent"
              />
              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={600} size="lg" lh={1.2} lineClamp={2}>
                  {selectedAccount.name || 'Unknown Key'}
                </Text>

                <Group gap={6} wrap="nowrap">
                  <Text size="sm" c="dimmed" ff="monospace" lineClamp={1}>
                    {selectedAccount.address}
                  </Text>
                  <Tooltip label="Copy Address">
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      color="gray"
                      onClick={() =>
                        navigator.clipboard.writeText(selectedAccount.address)
                      }
                    >
                      <IconCopy size="0.8rem" />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                {/* DID Section with Loading State */}
                {isAccountLoading ? (
                  <Skeleton height={16} width="80%" mt={4} />
                ) : (
                  accountIdentity && (
                    <Group gap={6} mt={4} wrap="nowrap">
                      <Text size="xs" fw={600} c="dimmed">
                        DID:
                      </Text>
                      <Text size="xs" ff="monospace" c="dimmed" lineClamp={1}>
                        {accountIdentity}
                      </Text>
                      <Tooltip label="Copy DID">
                        <ActionIcon
                          variant="subtle"
                          size="xs"
                          color="gray"
                          onClick={() =>
                            navigator.clipboard.writeText(accountIdentity)
                          }
                        >
                          <IconCopy size="0.8rem" />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  )
                )}

                {/* Balance Section with Loading State */}
                {isAccountLoading ? (
                  <Stack gap={2} mt={4}>
                    <Skeleton height={14} width="60%" />
                    <Skeleton height={14} width="50%" />
                  </Stack>
                ) : (
                  accountBalance && (
                    <Stack gap={2} mt={4}>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed" fw={600}>
                          Free:
                        </Text>
                        <Text size="xs" fw={500}>
                          {accountBalance.free.toFormat()} POLYX
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed" fw={600}>
                          Locked:
                        </Text>
                        <Text size="xs" fw={500}>
                          {accountBalance.locked.toFormat()} POLYX
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed" fw={600}>
                          Total:
                        </Text>
                        <Text size="xs" fw={500}>
                          {accountBalance.total.toFormat()} POLYX
                        </Text>
                      </Group>
                    </Stack>
                  )
                )}
              </Stack>
            </Group>
          </Box>
        )}

        <Divider />

        {/* Key List Section */}
        {!hasNoAccounts && (
          <Stack gap="xs">
            <TextInput
              placeholder="Search keys..."
              leftSection={<IconSearch size="0.8rem" />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="sm"
            />

            <Group justify="space-between" align="center" mt="xs">
              <Text size="xs" c="dimmed" fw={700}>
                AVAILABLE KEYS
              </Text>
              <Button
                variant="subtle"
                size="compact-xs"
                color="gray"
                onClick={() => setSortByName(!sortByName)}
              >
                {sortByName ? 'Unsort' : 'Sort by name'}
              </Button>
            </Group>

            <ScrollArea.Autosize mah={300} type="auto">
              <Stack gap={4}>
                {filteredAccounts.map((account) => (
                  <Box
                    key={account.address}
                    component="button"
                    onClick={() => {
                      selectAccount(account);
                      setSearch('');
                    }}
                    className={classes.accountCard}
                    data-selected={
                      selectedAccount?.address === account.address || undefined
                    }
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                        <Polkicon
                          address={account.address}
                          fontSize="30px"
                          background="transparent"
                        />
                        <Stack gap={0} style={{ minWidth: 0 }}>
                          <Text size="sm" fw={500} lineClamp={1}>
                            {account.name ||
                              `${account.address.substring(0, 8)}...`}
                          </Text>
                          <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                            lineClamp={1}
                          >
                            {`${account.address.substring(0, 12)}...${account.address.slice(-12)}`}
                          </Text>
                        </Stack>
                      </Group>
                      {selectedAccount?.address === account.address && (
                        <IconCheck
                          size="1rem"
                          color="var(--mantine-color-green-6)"
                        />
                      )}
                    </Group>
                  </Box>
                ))}
                {filteredAccounts.length === 0 && (
                  <Stack gap="sm" py="md" align="center">
                    <Text size="sm" c="dimmed" ta="center">
                      {accounts.length === 0
                        ? 'No accounts found in your wallet'
                        : 'No keys match your search'}
                    </Text>
                    {accounts.length === 0 && (
                      <Text size="xs" c="dimmed" ta="center" maw={300}>
                        Please create or authorize an account in your wallet
                        extension, then reconnect.
                      </Text>
                    )}
                  </Stack>
                )}
              </Stack>
            </ScrollArea.Autosize>
          </Stack>
        )}

        <Divider />

        {/* Footer Actions */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            leftSection={<IconWallet size="1rem" />}
            onClick={handleSwitchWallet}
          >
            Switch Wallet
          </Button>
          <Button
            variant="subtle"
            color="polyPink"
            leftSection={<IconLogout size="1rem" />}
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
