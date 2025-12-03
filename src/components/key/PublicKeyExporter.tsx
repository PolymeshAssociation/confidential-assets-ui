/**
 * Public Key Exporter Component
 *
 * Allows users to export their public keys to share with others for transfer creation
 */

import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Alert,
  Button,
  Card,
  Code,
  CopyButton,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconKey,
} from '@tabler/icons-react';

export function PublicKeyExporter() {
  const { selectedKey } = useConfidentialKey();

  if (!selectedKey) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="o Confidential Account Selected"
        color="yellow"
      >
        Please select a confidential account to view the associated public keys.
      </Alert>
    );
  }

  const { publicKey, encryptionPublicKey } = selectedKey;

  return (
    <Card withBorder padding="md">
      <Stack gap="md">
        <Group gap="xs">
          <IconKey size={20} />
          <Text fw={500}>Your Public Keys</Text>
        </Group>

        <Text size="sm" c="dimmed">
          Share these keys with others when they want to send you assets via
          transfer instructions. These are your <strong>public</strong> keys and
          are safe to share.
        </Text>

        {/* Account Public Key */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Account Public Key
          </Text>
          <Group gap="xs" wrap="nowrap">
            <Code
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {publicKey}
            </Code>
            <CopyButton value={publicKey} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  size="xs"
                  variant="light"
                  onClick={copy}
                  leftSection={
                    copied ? <IconCheck size={14} /> : <IconCopy size={14} />
                  }
                  color={copied ? 'teal' : 'blue'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>

        {/* Encryption Public Key */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Encryption Public Key
          </Text>
          <Group gap="xs" wrap="nowrap">
            <Code
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {encryptionPublicKey}
            </Code>
            <CopyButton value={encryptionPublicKey} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  size="xs"
                  variant="light"
                  onClick={copy}
                  leftSection={
                    copied ? <IconCheck size={14} /> : <IconCopy size={14} />
                  }
                  color={copied ? 'teal' : 'blue'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>

        <Alert
          icon={<IconAlertCircle size={16} />}
          color="blue"
          title="How to Use"
        >
          <Text size="xs">
            1. Copy both keys above
            <br />
            2. Share them with the person who wants to send you assets
            <br />
            3. They will paste these keys into the transfer creation form
          </Text>
        </Alert>
      </Stack>
    </Card>
  );
}
