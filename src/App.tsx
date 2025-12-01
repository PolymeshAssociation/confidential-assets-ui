import { ErrorBoundary } from '@/components';
import { SigningKeySelectionButton } from '@/components/SigningKeySelectionButton';
import { AssetProvider } from '@/context/asset';
import { ConfidentialKeyProvider } from '@/context/confidential-key';
import { ModalProvider } from '@/context/modal';
import { NotificationProvider } from '@/context/notification';
import { PolymeshProvider } from '@/context/polymesh';
import { SettlementProvider } from '@/context/settlement';
import { ThemeProvider } from '@/context/theme';
import { TransactionProvider } from '@/context/transaction';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { useModal } from '@/hooks/useModal';
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
  NavLink,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconChartBar,
  IconMoon,
  IconShieldLock,
  IconSun,
  IconUserShield,
  IconWallet,
} from '@tabler/icons-react';
import { useState } from 'react';
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
    disconnectWallet,
  } = usePolymesh();

  const { selectedKey } = useConfidentialKey();
  const { openWalletModal } = useModal();
  const location = useLocation();
  const [opened, setOpened] = useState(false);

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
                rightSection={<IconUserShield size={20} />}
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

            {isWalletConnected ? (
              <SigningKeySelectionButton />
            ) : (
              <Button
                variant="default"
                leftSection={<IconWallet size={18} />}
                onClick={openWalletModal}
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
                SELECTED CONFIDENTIAL ACCOUNT
              </Text>
              <NavLink
                label={selectedKey.alias}
                description="Active confidential key"
                leftSection={<IconUserShield size={20} />}
                component={Link}
                to="/confidential-accounts"
                onClick={() => setOpened(false)}
                hiddenFrom="sm"
              />
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
            WALLET CONNECTION
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
                openWalletModal();
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
                  <Text size="sm">
                    • The network may be temporarily unavailable
                  </Text>
                </Stack>
              </div>

              <div>
                <Title order={3} mb="sm">
                  Need help?
                </Title>
                <Text size="sm">
                  If this issue persists, please contact the Polymesh team for
                  support.
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
          <ModalProvider>
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
          </ModalProvider>
        </PolymeshProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
