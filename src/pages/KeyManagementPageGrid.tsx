import { PasswordStrengthInput } from '@/components/PasswordStrengthInput';
import { TruncatedKey } from '@/components/TruncatedKey';
import type { ConfidentialKey } from '@/context/confidential-key/types';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { useNotification } from '@/hooks/useNotification';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useTransaction } from '@/hooks/useTransaction';
import { registerConfidentialAccount } from '@/services/confidential';
import { validatePassword } from '@/utils/passwordValidation';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconCloudUpload,
  IconEdit,
  IconKey,
  IconLock,
  IconPlus,
  IconShieldCheck,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Compact card-based grid layout for key management
 */
export function KeyManagementPageGrid() {
  const {
    keys,
    selectedKey,
    selectKey,
    executeWithKey,
    isInitialized,
    isGenerating,
    generateKey,
    lockKey,
    deleteKey,
    renameKey,
    updateRegistrationStatus,
    checkAllRegistrations,
    changeKeyPassword,
    isKeyEncrypted,
    keepUnlocked,
  } = useConfidentialKey();

  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('dart_backup_warning_seen');
    if (!hasSeenWarning && keys.length === 0) {
      // Will show warning after first successful key generation
    }
  }, [keys.length]);

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [alias, setAlias] = useState('');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customSeed, setCustomSeed] = useState('');
  const [showBackupWarning, setShowBackupWarning] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usePassword, setUsePassword] = useState(true);

  const { sdk, polkadotApi, selectedAccount } = usePolymesh();
  const { submitTransaction } = useTransaction();

  useEffect(() => {
    async function checkRegistrations() {
      if (!polkadotApi) return;
      try {
        await checkAllRegistrations(polkadotApi);
      } catch (error) {
        console.error('[Key Management] Failed to check registrations:', error);
      }
    }
    checkRegistrations();
  }, [polkadotApi, checkAllRegistrations]);

  const handleGenerateKey = async () => {
    if (!alias) {
      showError('Please provide an alias');
      return;
    }

    if (advancedMode && !/^[0-9a-fA-F]{64}$/.test(customSeed)) {
      showError('Seed must be exactly 64 hexadecimal characters');
      return;
    }

    // Validate password if encryption is enabled
    if (usePassword) {
      if (!password) {
        showError('Password is required when encryption is enabled');
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        showError(passwordError);
        return;
      }

      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }
    }

    try {
      const isFirstKey = keys.length === 0;
      await generateKey(
        alias,
        advancedMode ? customSeed : undefined,
        usePassword ? password : undefined,
      );
      showSuccess(`DART key "${alias}" generated successfully`);
      setGenerateDialogOpen(false);
      setAlias('');
      setCustomSeed('');
      setPassword('');
      setConfirmPassword('');
      setAdvancedMode(false);

      const hasSeenWarning = localStorage.getItem('dart_backup_warning_seen');
      if (isFirstKey && !hasSeenWarning) {
        setShowBackupWarning(true);
      }
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'Failed to generate key',
      );
    }
  };

  const handleLockKey = async () => {
    try {
      await lockKey();
      showSuccess('DART key locked');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to lock key');
    }
  };

  const handleChangePassword = async (key: ConfidentialKey) => {
    try {
      await changeKeyPassword(key.publicKey);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'Failed to change password',
      );
    }
  };

  const handleRenameKey = (key: ConfidentialKey) => {
    modals.open({
      title: 'Rename Key',
      children: (
        <Stack gap="md">
          <Text size="sm">Enter a new alias for the key "{key.alias}"</Text>
          <TextInput
            id="rename-input-grid"
            label="New Alias"
            placeholder="New Key Name"
            defaultValue={key.alias}
            data-autofocus
            description="A friendly name to identify this key (max 50 characters)"
            maxLength={50}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => modals.closeAll()}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const input = document.getElementById(
                  'rename-input-grid',
                ) as HTMLInputElement;
                const newAlias = input?.value?.trim();

                if (!newAlias) {
                  showError('Please provide a new alias');
                  return;
                }

                try {
                  await renameKey(key.publicKey, newAlias);
                  showSuccess(
                    `Key renamed from "${key.alias}" to "${newAlias}"`,
                  );
                  modals.closeAll();
                } catch (error) {
                  showError(
                    error instanceof Error
                      ? error.message
                      : 'Failed to rename key',
                  );
                }
              }}
            >
              Rename
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  const handleDeleteKey = (key: ConfidentialKey) => {
    modals.openConfirmModal({
      title: `Delete Key "${key.alias}"?`,
      children: (
        <Text size="sm">
          Are you sure you want to delete the key "{key.alias}"? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteKey(key.publicKey);
          showSuccess(`Key "${key.alias}" deleted`);
        } catch (error) {
          showError(
            error instanceof Error ? error.message : 'Failed to delete key',
          );
        }
      },
    });
  };

  const handleSelectKey = (key: ConfidentialKey) => {
    try {
      selectKey(key.publicKey);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'Failed to select key',
      );
    }
  };

  const handleRegisterAccount = async () => {
    if (!selectedAccount || !sdk) {
      showError('Please connect your wallet first');
      return;
    }

    if (!polkadotApi) {
      showError('Polkadot API not available');
      return;
    }

    if (!selectedKey) {
      showError('No key is currently selected');
      return;
    }

    try {
      setIsRegistering(true);

      const identity = await sdk.getSigningIdentity();
      if (!identity) {
        throw new Error('No identity found for connected account');
      }

      const did = identity.did;

      await executeWithKey(async (accountKeys) => {
        await registerConfidentialAccount({
          did,
          polkadotApi,
          accountKeys,
          submitTransaction,
          onProofGenerating: () => {
            showSuccess('Generating proof... This may take a moment');
            console.log('Proof generation started');
          },
          onProofGenerated: () => {
            showSuccess('Proof generated, submitting transaction');
            console.log('Proof generation complete, submitting transaction');
          },
        });
      });

      updateRegistrationStatus(selectedKey.publicKey, did);
      showSuccess(`Confidential account registered successfully to ${did}`);
    } catch (error) {
      console.error('Registration failed:', error);
      showError(
        error instanceof Error ? error.message : 'Failed to register account',
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isInitialized) {
    return (
      <Container size="xl" py="xl">
        <Alert color="blue" title="Initializing">
          Initializing WASM prover...
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
        <Title order={2} style={{ flex: 1, minWidth: 'fit-content' }}>
          Confidential Key Management
        </Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setGenerateDialogOpen(true)}
          disabled={!isInitialized}
          size="sm"
        >
          Generate New Key
        </Button>
      </Group>

      <Group gap="xs" mb="xl">
        <Button component={Link} to="/keys" variant="light" size="xs">
          Grid
        </Button>
        <Button component={Link} to="/keys/compact" variant="subtle" size="xs">
          Compact
        </Button>
      </Group>

      {/* Prominent alert for unregistered selected key */}
      {selectedKey && !selectedKey.registeredDid && (
        <Alert
          color="blue"
          title="Register Key On-Chain"
          icon={<IconCloudUpload size={24} />}
          mb="md"
        >
          <Group justify="space-between" align="center">
            <Text size="sm">
              Key "{selectedKey.alias}" needs to be registered on-chain before
              it can be used for confidential transactions.
            </Text>
            <Button
              variant="filled"
              leftSection={<IconCloudUpload size={16} />}
              onClick={handleRegisterAccount}
              loading={isRegistering}
              disabled={!selectedAccount || !sdk}
            >
              Register On-Chain
            </Button>
          </Group>
        </Alert>
      )}

      {keys.length === 0 ? (
        <Alert
          icon={<IconKey size={32} />}
          title="No confidential keys yet"
          color="gray"
        >
          <Text size="sm" mb="md">
            Generate your first confidential key to get started
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setGenerateDialogOpen(true)}
          >
            Generate New Key
          </Button>
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {keys.map((key) => (
            <Card
              key={key.alias}
              withBorder
              padding="md"
              shadow="sm"
              style={{
                borderColor:
                  selectedKey?.publicKey === key.publicKey
                    ? 'var(--mantine-primary-color-filled)'
                    : undefined,
                borderWidth:
                  selectedKey?.publicKey === key.publicKey ? 2 : undefined,
                cursor:
                  selectedKey?.publicKey === key.publicKey
                    ? 'default'
                    : 'pointer',
              }}
              onClick={() => {
                if (selectedKey?.publicKey !== key.publicKey) {
                  handleSelectKey(key);
                }
              }}
            >
              <Stack gap="sm">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="lg">
                        {key.alias}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      {selectedKey?.publicKey === key.publicKey && (
                        <Badge color="green" size="sm" variant="light">
                          Selected
                        </Badge>
                      )}
                      {selectedKey?.publicKey === key.publicKey &&
                        keepUnlocked && (
                          <Badge color="orange" size="sm" variant="light">
                            Unlocked
                          </Badge>
                        )}
                      {key.registeredDid && (
                        <Badge
                          color="blue"
                          size="sm"
                          variant="light"
                          leftSection={<IconShieldCheck size={12} />}
                        >
                          Registered
                        </Badge>
                      )}
                    </Group>
                  </div>
                  <Group gap="xs">
                    {selectedKey?.publicKey === key.publicKey &&
                      keepUnlocked && (
                        <Tooltip label="Lock Key">
                          <ActionIcon
                            variant="light"
                            color="orange"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockKey();
                            }}
                          >
                            <IconLock size={18} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    <Tooltip label="Rename">
                      <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameKey(key);
                        }}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    {isKeyEncrypted(key.publicKey) && (
                      <Tooltip label="Change Password">
                        <ActionIcon
                          variant="light"
                          color="gray"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangePassword(key);
                          }}
                        >
                          <IconShieldCheck size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <Tooltip label="Delete">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteKey(key);
                        }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Divider />

                {/* Key Details */}
                <Stack gap="xs">
                  {key.registeredDid && (
                    <div>
                      <Text size="xs" c="dimmed" fw={500} mb={2}>
                        Registered To
                      </Text>
                      <TruncatedKey value={key.registeredDid} />
                    </div>
                  )}

                  <div>
                    <Text size="xs" c="dimmed" fw={500} mb={2}>
                      Account Key
                    </Text>
                    <TruncatedKey value={key.publicKey} />
                  </div>

                  {key.encryptionPublicKey && (
                    <div>
                      <Text size="xs" c="dimmed" fw={500} mb={2}>
                        Encryption Key
                      </Text>
                      <TruncatedKey value={key.encryptionPublicKey} />
                    </div>
                  )}
                </Stack>

                <Divider />

                {/* Footer */}
                <Text size="xs" c="dimmed">
                  Created{' '}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(key.createdAt))}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Generate Key Modal */}
      <Modal
        opened={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        title="Generate New DART Key"
        size="md"
      >
        <Stack gap="md">
          <Alert color="blue" title="Security">
            Protect your keys with a password. Keys are stored locally in your
            browser.
          </Alert>

          <Switch
            label="Encrypt with Password"
            description="Require a password to use this key (Recommended)"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.currentTarget.checked)}
          />

          {usePassword && (
            <>
              <PasswordStrengthInput
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Enter password"
                required
                error={
                  password ? validatePassword(password) || undefined : undefined
                }
              />
              <TextInput
                type="password"
                label="Confirm Password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={
                  confirmPassword && password !== confirmPassword
                    ? 'Passwords do not match'
                    : null
                }
                required
              />
            </>
          )}

          <TextInput
            label="Key Alias"
            placeholder="My Key Name"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            description="A friendly name to identify this key (max 50 characters)"
            maxLength={50}
            required
          />

          <Switch
            label="Advanced: Use Custom Seed"
            description="Generate keys from a specific 64-character hex seed"
            checked={advancedMode}
            onChange={(e) => setAdvancedMode(e.currentTarget.checked)}
          />

          {advancedMode && (
            <TextInput
              label="Custom Seed"
              placeholder="Enter 64 hexadecimal characters"
              value={customSeed}
              onChange={(e) => setCustomSeed(e.target.value)}
              description="Must be exactly 64 hex characters (0-9, a-f)"
              maxLength={64}
              error={
                customSeed && !/^[0-9a-fA-F]{64}$/.test(customSeed)
                  ? 'Invalid seed format'
                  : null
              }
              required
            />
          )}

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => {
                setGenerateDialogOpen(false);
                setAdvancedMode(false);
                setCustomSeed('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerateKey} loading={isGenerating}>
              Generate
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Backup Warning Modal */}
      <Modal
        opened={showBackupWarning}
        onClose={() => {
          setShowBackupWarning(false);
          localStorage.setItem('dart_backup_warning_seen', 'true');
        }}
        title="Important: Back Up Your Keys"
        size="md"
      >
        <Stack gap="md">
          <Alert color="yellow" title="Keys Are Stored Locally">
            Your DART keys are stored in your browser's localStorage without
            password protection.
          </Alert>

          <Text size="sm">
            <strong>Important considerations:</strong>
          </Text>
          <Stack gap="xs">
            <Text size="sm">• Keys are tied to this browser and device</Text>
            <Text size="sm">• Clearing browser data will delete your keys</Text>
            <Text size="sm">• You cannot recover keys if lost</Text>
            <Text size="sm">• Back up your browser profile regularly</Text>
          </Stack>

          <Alert color="blue">
            Future versions will support key export and password encryption.
          </Alert>

          <Group justify="flex-end" gap="sm">
            <Button
              onClick={() => {
                setShowBackupWarning(false);
                localStorage.setItem('dart_backup_warning_seen', 'true');
              }}
            >
              I Understand
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
