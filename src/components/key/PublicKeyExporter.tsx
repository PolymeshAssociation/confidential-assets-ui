import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Accordion,
  ActionIcon,
  Alert,
  CopyButton,
  Stack,
  Text,
  TextInput,
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
        title="No Confidential Account Selected"
        color="yellow"
      >
        Please select a confidential account to view the associated public keys.
      </Alert>
    );
  }

  const { publicKey, encryptionPublicKey } = selectedKey;

  return (
    <Accordion variant="separated" radius="md" defaultValue={null}>
      <Accordion.Item value="keys">
        <Accordion.Control icon={<IconKey size={20} />}>
          <Text fw={500}>Your Public Keys</Text>
          <Text size="xs" c="dimmed">
            Share these keys to receive assets
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="md">
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="blue"
              variant="light"
            >
              Share these keys with others so they can send you assets. These
              are safe to share publicly.
            </Alert>

            <TextInput
              label="Account Public Key"
              value={publicKey}
              readOnly
              rightSection={
                <CopyButton value={publicKey} timeout={2000}>
                  {({ copied, copy }) => (
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  )}
                </CopyButton>
              }
            />

            <TextInput
              label="Encryption Public Key"
              value={encryptionPublicKey}
              readOnly
              rightSection={
                <CopyButton value={encryptionPublicKey} timeout={2000}>
                  {({ copied, copy }) => (
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  )}
                </CopyButton>
              }
            />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
