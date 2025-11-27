/**
 * Register Asset Modal
 *
 * Modal for registering an account with a confidential asset
 */

import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Alert,
  Button,
  Code,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useState } from 'react';

interface RegisterAssetModalProps {
  opened: boolean;
  onClose: () => void;
  assetId: string;
  assetName?: string;
}

export function RegisterAssetModal({
  opened,
  onClose,
  assetId,
  assetName,
}: RegisterAssetModalProps) {
  const [active, setActive] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<string>('');
  const { registerAsset } = useAsset();
  const { selectedKey, keys } = useConfidentialKey();
  const [selectedKeyAlias, setSelectedKeyAlias] = useState<string | null>(null);

  const handleRegister = async () => {
    // Require either unlocked key or selected key
    if (!selectedKey && !selectedKeyAlias) return;

    setIsRegistering(true);
    setActive(1);

    try {
      await registerAsset({
        assetId,
        onProgress: (step) => {
          setRegistrationStep(step);
        },
      });

      // Success - move to completion step
      setActive(2);
    } catch (error) {
      console.error('Registration failed:', error);
      setActive(0);
      // Stay on registration step to show error
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    if (!isRegistering) {
      setActive(0);
      setSelectedKeyAlias(null);
      setRegistrationStep('');
      onClose();
    }
  };

  // Get currently unlocked key or find selected key
  const activeKey =
    selectedKey || keys.find((k) => k.alias === selectedKeyAlias);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Register with Asset"
      size="md"
      closeOnClickOutside={!isRegistering}
      closeOnEscape={!isRegistering}
    >
      <Stepper active={active} orientation="vertical">
        {/* Step 1: Select Key */}
        <Stepper.Step
          label="Select Account"
          description="Choose which confidential account to register"
        >
          <Stack gap="md" mt="md">
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                Registration links your confidential account with this asset,
                allowing you to receive and hold tokens.
              </Text>
            </Alert>

            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Asset
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    {assetName || 'Unknown Asset'}
                  </Text>
                  <Code style={{ fontSize: '11px' }}>ID: {assetId}</Code>
                </Group>
              </Stack>
            </Paper>

            {selectedKey ? (
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Using Selected Key
                    </Text>
                    <IconCheck size={16} color="green" />
                  </Group>
                  <Text size="sm" c="dimmed">
                    {selectedKey.alias}
                  </Text>
                  <Code block style={{ fontSize: '10px' }}>
                    {selectedKey.publicKey}
                  </Code>
                </Stack>
              </Paper>
            ) : (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  No key selected. Please go to the{' '}
                  <Text span fw={600}>
                    Keys page
                  </Text>{' '}
                  to select a confidential key first.
                </Text>
              </Alert>
            )}

            {!selectedKey && keys.length === 0 && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
              >
                No confidential accounts found. Please create one in the Keys
                page first.
              </Alert>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={!selectedKey && !selectedKeyAlias}
              >
                Register
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* Step 2: Registering */}
        <Stepper.Step
          label="Registering"
          description="Generating proof and submitting transaction"
          loading={isRegistering}
        >
          <Stack gap="md" mt="md" align="center" py="xl">
            <Loader size="lg" />
            <Text size="sm" fw={500}>
              Registering with asset...
            </Text>
            {registrationStep && (
              <Text size="xs" c="dimmed">
                {registrationStep}
              </Text>
            )}
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="xs">
                This may take a moment while we generate the zero-knowledge
                proof and submit the transaction to the blockchain.
              </Text>
            </Alert>
          </Stack>
        </Stepper.Step>

        {/* Step 3: Complete */}
        <Stepper.Step label="Complete" description="Successfully registered">
          <Stack gap="md" mt="md" align="center" py="xl">
            <IconCheck size={64} color="green" stroke={1.5} />
            <div style={{ textAlign: 'center' }}>
              <Text size="lg" fw={500}>
                Registration Successful!
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Your account is now registered with this asset.
              </Text>
            </div>

            {activeKey && (
              <Paper p="md" withBorder w="100%">
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Registered Account
                  </Text>
                  <Text size="sm" fw={500}>
                    {activeKey.alias}
                  </Text>
                  <Code block style={{ fontSize: '10px' }}>
                    {activeKey.publicKey}
                  </Code>
                </Stack>
              </Paper>
            )}

            <Group justify="center" mt="md">
              <Button onClick={handleClose}>Close</Button>
            </Group>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
