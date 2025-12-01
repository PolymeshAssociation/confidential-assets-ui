import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy, IconWallet } from '@tabler/icons-react';
import { useState } from 'react';

export function HomePage() {
  const {
    isWalletConnected,
    isWalletConnecting,
    accounts,
    selectedAccount,
    accountBalance,
    accountIdentity,
    isAccountLoading,
  } = usePolymesh();
  const { openWalletModal } = useModal();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(selectedAccount.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl" mb={48}>
        <Stack align="center" gap="xl">
          <Image
            src={`${import.meta.env.BASE_URL}polymesh-icon.svg`}
            alt="Polymesh"
            w={100}
            h={100}
            fit="contain"
          />
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

      <Card padding="xl" shadow="sm">
        {!isWalletConnected ? (
          <Stack gap="md">
            <Title order={3}>Connect Your Wallet</Title>
            <Text c="dimmed">
              Connect your Polymesh Wallet, or other supported wallets to get
              started with confidential assets.
            </Text>

            <Button
              size="lg"
              leftSection={
                isWalletConnecting ? (
                  <Loader size={20} />
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
        ) : (
          <Stack gap="md">
            <Alert color="green" title="Connected">
              Connected to Polymesh network
            </Alert>

            <Title order={4}>Connected Account</Title>
            {selectedAccount && (
              <Box>
                <Text size="sm" c="dimmed">
                  Name:
                </Text>
                <Text mb="sm">{selectedAccount.name}</Text>
                <Text size="sm" c="dimmed" mb={4}>
                  Address:
                </Text>
                <Group gap="xs" align="flex-start">
                  <Text
                    ff="monospace"
                    size="sm"
                    style={{ wordBreak: 'break-all', flex: 1 }}
                  >
                    {selectedAccount.address}
                  </Text>
                  <Tooltip label={copiedAddress ? 'Copied!' : 'Copy address'}>
                    <ActionIcon
                      variant="subtle"
                      color={copiedAddress ? 'green' : 'gray'}
                      size="sm"
                      onClick={handleCopyAddress}
                    >
                      {copiedAddress ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Box>
            )}

            {/* Balance Section with Loading State */}
            {isAccountLoading ? (
              <Box>
                <Text size="sm" c="dimmed">
                  Balance:
                </Text>
                <Skeleton height={20} width="60%" mt={4} />
              </Box>
            ) : (
              accountBalance && (
                <Box>
                  <Text size="sm" c="dimmed">
                    Balance:
                  </Text>
                  <Text>{accountBalance.free.toFormat()} POLYX</Text>
                </Box>
              )
            )}

            {/* Identity Section with Loading State */}
            {isAccountLoading ? (
              <Box>
                <Text size="sm" c="dimmed">
                  DID:
                </Text>
                <Skeleton height={20} width="70%" mt={4} />
              </Box>
            ) : (
              accountIdentity && (
                <Box>
                  <Text size="sm" c="dimmed">
                    DID:
                  </Text>
                  <Text ff="monospace" size="sm">
                    {accountIdentity}
                  </Text>
                </Box>
              )
            )}

            <Text size="sm" c="dimmed">
              {accounts.length} account(s) available
            </Text>
          </Stack>
        )}
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
