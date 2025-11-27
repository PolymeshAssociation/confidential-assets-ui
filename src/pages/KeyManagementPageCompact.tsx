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
  Box,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Switch,
  Table,
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
 * Compact table layout for key management
 */
export function KeyManagementPageCompact() {
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
      showSuccess(`Confidential Asset keys "${alias}" generated successfully`);
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
            id="rename-input-compact"
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
                  'rename-input-compact',
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

  // For encrypted keys, prompt for password
  // For unencrypted keys, load immediately
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
        <Button component={Link} to="/keys" variant="subtle" size="xs">
          Grid
        </Button>
        <Button component={Link} to="/keys/compact" variant="light" size="xs">
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
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Alias</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Registered To</Table.Th>
                <Table.Th>Account Public Key</Table.Th>
                <Table.Th>Encryption Public Key</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th style={{ width: 120 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {keys.map((key) => (
                <Table.Tr
                  key={key.alias}
                  bg={
                    selectedKey?.publicKey === key.publicKey
                      ? 'var(--mantine-primary-color-light)'
                      : undefined
                  }
                  style={{
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
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {key.alias}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {selectedKey?.publicKey === key.publicKey && (
                        <Badge color="green" size="sm">
                          Selected
                        </Badge>
                      )}
                      {selectedKey?.publicKey === key.publicKey &&
                        keepUnlocked && (
                          <Badge color="orange" size="sm">
                            Unlocked
                          </Badge>
                        )}
                      {key.registeredDid && (
                        <Badge color="blue" size="sm">
                          Registered
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {key.registeredDid ? (
                      <TruncatedKey value={key.registeredDid} />
                    ) : (
                      <Text size="sm" c="dimmed">
                        Not registered
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <TruncatedKey value={key.publicKey} />
                  </Table.Td>
                  <Table.Td>
                    {key.encryptionPublicKey ? (
                      <TruncatedKey value={key.encryptionPublicKey} />
                    ) : (
                      <Text size="sm" c="dimmed">
                        N/A
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(key.createdAt))}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      {selectedKey?.publicKey === key.publicKey &&
                        keepUnlocked && (
                          <Tooltip label="Lock Key">
                            <ActionIcon
                              variant="subtle"
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
                          variant="subtle"
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
                            variant="subtle"
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
                          variant="subtle"
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
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
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
