import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import { onboardAccount } from '@/services/onboarding';
import { getErrorMessage } from '@/utils/error';
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Image,
  List,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowRight,
  IconCheck,
  IconCoin,
  IconId,
  IconShieldLock,
  IconWallet,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const {
    isWalletConnected,
    isWalletConnecting,
    selectedAccount,
    accountIdentity,
    isAccountLoading,
    refreshIdentity,
  } = usePolymesh();
  const { openWalletModal, openKeySelectionModal } = useModal();
  const [isOnboarding, setIsOnboarding] = useState(false);

  const handleOnboard = async () => {
    if (!selectedAccount) return;

    setIsOnboarding(true);
    const notificationId = notifications.show({
      loading: true,
      title: 'Onboarding',
      message: 'Requesting DID and test POLYX...',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const result = await onboardAccount(selectedAccount.address);

      notifications.update({
        id: notificationId,
        color: 'green',
        title: 'Onboarding Successful',
        message: `Received ${result.polyxAmount} POLYX and DID created!`,
        icon: <IconCheck size="1rem" />,
        loading: false,
        autoClose: 5000,
      });

      await refreshIdentity();
    } catch (error) {
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Onboarding Failed',
        message: getErrorMessage(error),
        loading: false,
        autoClose: false,
        withCloseButton: true,
      });
    } finally {
      setIsOnboarding(false);
    }
  };

  const renderContent = () => {
    // 1. Wallet Not Connected
    if (!isWalletConnected) {
      return (
        <Stack gap="md">
          <Title order={3}>Connect Your Wallet</Title>
          <Text c="dimmed">
            Connect your Polymesh Wallet or other supported wallets to get
            started with confidential assets.
          </Text>

          <Button
            size="lg"
            leftSection={
              isWalletConnecting ? (
                <Loader size={20} color="white" />
              ) : (
                <IconWallet size={20} />
              )
            }
            onClick={openWalletModal}
            disabled={isWalletConnecting}
            fullWidth
          >
            {isWalletConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </Stack>
      );
    }

    // 2. Wallet Connected but No Key Selected
    if (!selectedAccount) {
      return (
        <Stack gap="md">
          <Title order={3}>Select a Signing Key</Title>
          <Text c="dimmed">
            Please select a key from your wallet to use for signing
            transactions.
          </Text>

          <Button
            size="lg"
            leftSection={<IconId size={20} />}
            onClick={openKeySelectionModal}
            fullWidth
          >
            Select Key
          </Button>
        </Stack>
      );
    }

    // 3. Loading Account Data
    if (isAccountLoading) {
      return (
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text c="dimmed">Checking account status...</Text>
        </Stack>
      );
    }

    // 4. Connected, Key Selected, No DID (Needs Onboarding)
    if (!accountIdentity) {
      return (
        <Stack gap="md">
          <Alert
            variant="light"
            color="blue"
            title="Welcome to Polymesh Confidential Assets"
            icon={<IconShieldLock size={20} />}
          >
            To get started, you need a decentralized identity (DID) and some
            test POLYX tokens.
          </Alert>

          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>Create a DID for your account</List.Item>
            <List.Item>Receive test POLYX</List.Item>
            <List.Item>Enable confidential asset features</List.Item>
          </List>

          <Button
            size="lg"
            color="teal"
            leftSection={<IconCoin size={20} />}
            onClick={handleOnboard}
            loading={isOnboarding}
            fullWidth
          >
            Get Test POLYX & DID
          </Button>
        </Stack>
      );
    }

    // 5. Connected, Key Selected, Has DID (Ready)
    return (
      <Stack gap="md">
        <Alert
          variant="light"
          color="green"
          title="Ready to Start"
          icon={<IconCheck size={20} />}
        >
          Your account is set up and ready to use confidential assets.
        </Alert>

        <Group grow>
          <Button
            component={Link}
            to="/confidential-accounts"
            size="md"
            variant="light"
            leftSection={<IconShieldLock size={20} />}
          >
            Manage Confidential Account
          </Button>
          <Button
            component={Link}
            to="/assets"
            size="md"
            variant="light"
            leftSection={<IconCoin size={20} />}
          >
            Create and View Assets
          </Button>
        </Group>

        <Button
          component={Link}
          to="/settlements"
          size="md"
          variant="outline"
          rightSection={<IconArrowRight size={20} />}
        >
          Transfer Assets
        </Button>
      </Stack>
    );
  };

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl" mb={48}>
        <Stack align="center" gap="xl">
          <Image
            src={`${import.meta.env.BASE_URL}polymesh-logo.svg`}
            alt="Polymesh"
            h={40}
            w="auto"
            maw={300}
            fit="contain"
          />
        </Stack>
        <Title order={2} fw={600} ta="center">
          Confidential Assets
        </Title>
        <Text size="lg" c="dimmed" ta="center" maw={600}>
          Experience the future of private asset transfers on the
          institutional-grade blockchain built for regulated assets
        </Text>
      </Stack>

      <Card padding="xl" shadow="sm" radius="md" withBorder>
        {renderContent()}
      </Card>

      <Stack align="center" gap="md" mt={48}>
        <Text size="sm" c="dimmed" ta="center">
          🔒 This is an MVP for experiencing confidential asset features on
          Polymesh.
          <br />
          Confidential account keys are encrypted and stored securely in your
          browser.
        </Text>
        <Text size="xs" c="dimmed">
          Powered by Polymesh
        </Text>
      </Stack>
    </Container>
  );
}
