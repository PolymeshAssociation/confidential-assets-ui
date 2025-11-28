import { ErrorBoundary } from '@/components';
import { AssetProvider } from '@/context/asset';
import { ConfidentialKeyProvider } from '@/context/confidential-key';
import { NotificationProvider } from '@/context/notification';
import { PolymeshProvider } from '@/context/polymesh';
import { SettlementProvider } from '@/context/settlement';
import { ThemeProvider } from '@/context/theme';
import { TransactionProvider } from '@/context/transaction';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useTheme } from '@/hooks/useTheme';
import { AssetManagementPage } from '@/pages/AssetManagementPage';
import { HomePage } from '@/pages/HomePage';
import { KeyManagementPage } from '@/pages/KeyManagementPage';
import { SettlementPage } from '@/pages/SettlementPage';
import {
  ActionIcon,
  Alert,
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Image,
  Loader,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconKey,
  IconMoon,
  IconSearch,
  IconShieldLock,
  IconSun,
  IconUserShield,
  IconWallet,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

function AppLayout() {
  const { mode, toggleTheme } = useTheme();
  const {
    isConnecting,
    isWalletConnected,
    isWalletConnecting,
    error,
    connectWallet,
    disconnectWallet,
    accounts,
    selectedAccount,
    selectAccount,
  } = usePolymesh();

  const { selectedKey } = useConfidentialKey();
  const location = useLocation();
  const [opened, setOpened] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');

  const filteredAccounts = useMemo(() => {
    const search = accountSearch.toLowerCase();
    const filtered = accounts.filter(
      (account) =>
        account.name?.toLowerCase().includes(search) ||
        account.address.toLowerCase().includes(search),
    );
    // Sort to show selected account first
    return filtered.sort((a, b) => {
      if (a.address === selectedAccount?.address) return -1;
      if (b.address === selectedAccount?.address) return 1;
      return 0;
    });
  }, [accounts, accountSearch, selectedAccount?.address]);

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            <Burger
              opened={opened}
              onClick={() => setOpened(!opened)}
              hiddenFrom="sm"
              size="sm"
            />
            <Button
              component={Link}
              to="/"
              variant="subtle"
              color="dark"
              leftSection={
                <Image
                  src={`${import.meta.env.BASE_URL}polymesh-icon.svg`}
                  alt="Polymesh"
                  w={24}
                  h={24}
                  fit="contain"
                />
              }
              styles={{
                root: { padding: '0.5rem', height: 'auto', minWidth: 0 },
                section: { marginRight: 8 },
              }}
            >
              <Group gap="xs" wrap="nowrap">
                <Image
                  src={`${import.meta.env.BASE_URL}polymesh-logo.svg`}
                  alt="Polymesh"
                  h={18}
                  w="auto"
                  fit="contain"
                />
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    opacity: 0.9,
                    paddingLeft: 8,
                    borderLeft: '1px solid var(--mantine-color-dimmed)',
                  }}
                  visibleFrom="xs"
                >
                  Confidential
                </Text>
              </Group>
            </Button>
          </Group>

          <Group gap="xs" wrap="nowrap">
            {selectedKey ? (
              <Button
                variant="subtle"
                color="polyPink"
                leftSection={<IconKey size={18} />}
                visibleFrom="md"
                component={Link}
                to="/confidential-accounts"
              >
                {selectedKey.alias}
              </Button>
            ) : (
              <Button
                variant="light"
                color="polyPink"
                leftSection={<IconUserShield size={18} />}
                visibleFrom="md"
                component={Link}
                to="/confidential-accounts"
              >
                Confidential Account
              </Button>
            )}

            {isWalletConnected && selectedAccount ? (
              <Menu shadow="md" width={360} closeOnItemClick={false}>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="dark"
                    rightSection={<IconChevronDown size={16} />}
                    leftSection={<IconWallet size={18} />}
                    visibleFrom="sm"
                  >
                    {selectedAccount.name ||
                      `${selectedAccount.address.substring(
                        0,
                        6,
                      )}...${selectedAccount.address.substring(
                        selectedAccount.address.length - 4,
                      )}`}
                  </Button>
                </Menu.Target>

                <Menu.Dropdown style={{ maxWidth: 'calc(100vw - 2rem)' }}>
                  <Menu.Label>Select Key</Menu.Label>
                  <TextInput
                    placeholder="Search accounts..."
                    leftSection={<IconSearch size={16} />}
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.currentTarget.value)}
                    mb="xs"
                    mx="xs"
                    styles={{ root: { width: 'calc(100% - 16px)' } }}
                  />
                  <ScrollArea.Autosize mah={300} type="auto">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <Menu.Item
                          key={account.address}
                          leftSection={
                            selectedAccount.address === account.address ? (
                              <IconCheck size={16} />
                            ) : (
                              <div style={{ width: 16 }} />
                            )
                          }
                          onClick={() => {
                            selectAccount(account);
                            setAccountSearch('');
                          }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                              {account.name && (
                                <Text size="sm" fw={500} lineClamp={1}>
                                  {account.name}
                                </Text>
                              )}
                              <Text
                                size="xs"
                                c="dimmed"
                                lineClamp={1}
                                style={{ fontFamily: 'monospace' }}
                              >
                                {account.address.substring(0, 12)}...
                                {account.address.substring(
                                  account.address.length - 12,
                                )}
                              </Text>
                            </Stack>
                            <Tooltip label="Copy address">
                              <ActionIcon
                                component="div"
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    account.address,
                                  );
                                }}
                              >
                                <IconCopy size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Menu.Item>
                      ))
                    ) : (
                      <Text size="sm" c="dimmed" p="md" ta="center">
                        No accounts found
                      </Text>
                    )}
                  </ScrollArea.Autosize>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    onClick={disconnectWallet}
                    closeMenuOnClick
                  >
                    Disconnect Wallet
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                variant="default"
                leftSection={<IconWallet size={18} />}
                onClick={connectWallet}
                loading={isWalletConnecting}
                visibleFrom="sm"
              >
                Connect Wallet
              </Button>
            )}

            <ActionIcon
              variant="subtle"
              color="dark"
              onClick={toggleTheme}
              size="lg"
              visibleFrom="sm"
            >
              {mode === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <NavLink
            label="Dashboard"
            leftSection={<IconChartBar size={20} />}
            component={Link}
            to="/"
            active={location.pathname === '/'}
            onClick={() => setOpened(false)}
          />
          <NavLink
            label="Confidential Accounts"
            leftSection={<IconUserShield size={20} />}
            component={Link}
            to="/confidential-accounts"
            active={location.pathname === '/confidential-accounts'}
            onClick={() => setOpened(false)}
          />
          <NavLink
            label="Assets"
            leftSection={<IconShieldLock size={20} />}
            component={Link}
            to="/assets"
            active={location.pathname === '/assets'}
            onClick={() => setOpened(false)}
          />
          <NavLink
            label="Transfers"
            leftSection={<IconArrowsExchange size={20} />}
            component={Link}
            to="/settlements"
            active={location.pathname === '/settlements'}
            onClick={() => setOpened(false)}
          />

          {/* Selected Key Display (Mobile Only) */}
          {selectedKey && (
            <>
              <Text
                size="xs"
                c="dimmed"
                mt="md"
                mb="xs"
                px="xs"
                fw={500}
                hiddenFrom="sm"
              >
                SELECTED KEY
              </Text>
              <NavLink
                label={selectedKey.alias}
                description="Active confidential key"
                leftSection={<IconKey size={20} />}
                component={Link}
                to="/confidential-accounts"
                onClick={() => setOpened(false)}
                hiddenFrom="sm"
              />
            </>
          )}

          {/* Account Selector (Mobile Only) */}
          {isWalletConnected && selectedAccount && (
            <>
              <Text
                size="xs"
                c="dimmed"
                mt="md"
                mb="xs"
                px="xs"
                fw={500}
                hiddenFrom="sm"
              >
                SIGNING KEY
              </Text>
              <Menu shadow="md" width={250} closeOnItemClick={false}>
                <Menu.Target>
                  <NavLink
                    label={selectedAccount.name || 'Wallet Key'}
                    description={`${selectedAccount.address.substring(
                      0,
                      8,
                    )}...${selectedAccount.address.substring(
                      selectedAccount.address.length - 6,
                    )}`}
                    leftSection={<IconWallet size={20} />}
                    rightSection={<IconChevronDown size={16} />}
                    hiddenFrom="sm"
                  />
                </Menu.Target>
                <Menu.Dropdown style={{ maxWidth: 'calc(100vw - 2rem)' }}>
                  <Menu.Label>Select Key</Menu.Label>
                  <TextInput
                    placeholder="Search accounts..."
                    leftSection={<IconSearch size={16} />}
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.currentTarget.value)}
                    mb="xs"
                    mx="xs"
                    styles={{ root: { width: 'calc(100% - 16px)' } }}
                  />
                  <ScrollArea.Autosize mah={300} type="auto">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <Menu.Item
                          key={account.address}
                          leftSection={
                            selectedAccount.address === account.address ? (
                              <IconCheck size={16} />
                            ) : (
                              <div style={{ width: 16 }} />
                            )
                          }
                          onClick={() => {
                            selectAccount(account);
                            setAccountSearch('');
                          }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                              {account.name && (
                                <Text size="sm" fw={500} lineClamp={1}>
                                  {account.name}
                                </Text>
                              )}
                              <Text
                                size="xs"
                                c="dimmed"
                                lineClamp={1}
                                style={{ fontFamily: 'monospace' }}
                              >
                                {account.address.substring(0, 12)}...
                                {account.address.substring(
                                  account.address.length - 12,
                                )}
                              </Text>
                            </Stack>
                            <Tooltip label="Copy address">
                              <ActionIcon
                                component="div"
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    account.address,
                                  );
                                }}
                              >
                                <IconCopy size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Menu.Item>
                      ))
                    ) : (
                      <Text size="sm" c="dimmed" p="md" ta="center">
                        No accounts found
                      </Text>
                    )}
                  </ScrollArea.Autosize>
                </Menu.Dropdown>
              </Menu>
            </>
          )}

          <Text size="xs" c="dimmed" mt="md" mb="xs" px="xs" fw={500}>
            OTHER
          </Text>
          <NavLink
            label="Theme"
            description={mode === 'dark' ? 'Dark mode' : 'Light mode'}
            leftSection={
              mode === 'dark' ? <IconMoon size={20} /> : <IconSun size={20} />
            }
            onClick={toggleTheme}
          />

          <Text
            size="xs"
            c="dimmed"
            mt="md"
            mb="xs"
            px="xs"
            fw={500}
            hiddenFrom="sm"
          >
            SESSION
          </Text>
          {isWalletConnected ? (
            <NavLink
              label="Disconnect Wallet"
              leftSection={<IconWallet size={20} />}
              color="red"
              onClick={() => {
                disconnectWallet();
                setOpened(false);
              }}
              hiddenFrom="sm"
            />
          ) : (
            <NavLink
              label="Connect Wallet"
              leftSection={<IconWallet size={20} />}
              onClick={() => {
                connectWallet();
                setOpened(false);
              }}
              hiddenFrom="sm"
            />
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {isConnecting ? (
          <Stack align="center" justify="center" h="100%" gap="md">
            <Loader size="lg" />
            <Text size="lg" fw={500}>
              Connecting to Polymesh...
            </Text>
            <Text size="sm" c="dimmed">
              Establishing connection to chain
            </Text>
          </Stack>
        ) : error ? (
          <Container size="sm" py="xl">
            <Stack gap="lg">
              <Alert
                icon={<IconAlertCircle size={24} />}
                title="Connection Error"
                color="red"
                variant="filled"
              >
                Unable to connect to the Polymesh network.
              </Alert>

              <div>
                <Title order={3} mb="sm">
                  Error Details
                </Title>
                <Text size="sm" c="dimmed">
                  {error}
                </Text>
              </div>

              <div>
                <Title order={3} mb="sm">
                  What you can try
                </Title>
                <Stack gap="xs">
                  <Text size="sm">• Check your internet connection</Text>
                  <Text size="sm">• Reload the page to try again</Text>
                  <Text size="sm">• The network may be temporarily unavailable</Text>
                </Stack>
              </div>

              <div>
                <Title order={3} mb="sm">
                  Need help?
                </Title>
                <Text size="sm">
                  If this issue persists, please contact the Polymesh team for support.
                </Text>
              </div>

              <Button onClick={() => window.location.reload()} size="md">
                Reload Page
              </Button>
            </Stack>
          </Container>
        ) : (
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/confidential-accounts"
                element={<KeyManagementPage />}
              />
              <Route path="/assets" element={<AssetManagementPage />} />
              <Route path="/settlements" element={<SettlementPage />} />
            </Routes>
          </ErrorBoundary>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <PolymeshProvider>
          <TransactionProvider>
            <ConfidentialKeyProvider>
              <AssetProvider>
                <SettlementProvider>
                  <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <AppLayout />
                  </BrowserRouter>
                </SettlementProvider>
              </AssetProvider>
            </ConfidentialKeyProvider>
          </TransactionProvider>
        </PolymeshProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
