import {
  DeleteKeyModal,
  ExportKeyModal,
  GenerateKeyModal,
  ImportKeyModal,
  RenameKeyModal,
  TruncatedKey,
} from '@/components';
import type { ConfidentialKey } from '@/context/confidential-key/types';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { useNotification } from '@/hooks/useNotification';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useTransaction } from '@/hooks/useTransaction';
import { registerConfidentialAccount } from '@/services/confidential';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  FileButton,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconCloudUpload,
  IconDownload,
  IconEdit,
  IconFileImport,
  IconLayoutGrid,
  IconList,
  IconLock,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconTrash,
  IconUserShield,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

export function KeyManagementPage() {
  const {
    keys,
    selectedKey,
    selectKey,
    executeWithKey,
    isInitialized,
    lockKey,
    deleteKey,
    renameKey,
    updateRegistrationStatus,
    checkAllRegistrations,
    changeKeyPassword,
    isKeyEncrypted,
    keepUnlocked,
    exportKey,
  } = useConfidentialKey();

  const { showSuccess, showError } = useNotification();
  const { sdk, polkadotApi, selectedAccount } = usePolymesh();
  const { submitTransaction } = useTransaction();

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Generation form state
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(
    null,
  );
  const importFileResetRef = useRef<() => void>(null);

  const [hasCheckedRegistrations, setHasCheckedRegistrations] = useState(false);

  // Check registrations on mount
  useEffect(() => {
    async function checkRegistrations() {
      if (!polkadotApi) return;
      try {
        await checkAllRegistrations({ polkadotApi });
      } catch (error) {
        console.error('[Key Management] Failed to check registrations:', error);
      } finally {
        setHasCheckedRegistrations(true);
      }
    }
    checkRegistrations();
  }, [polkadotApi, checkAllRegistrations]);

  // Filter keys
  const filteredKeys = keys.filter((key) =>
    key.alias.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLockKey = async () => {
    try {
      await lockKey();
      showSuccess('Key locked');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to lock key');
    }
  };

  const handleChangePassword = async (key: ConfidentialKey) => {
    try {
      await changeKeyPassword({ publicKey: key.publicKey });
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
        <RenameKeyModal
          keyToRename={key}
          onRename={async (newAlias) => {
            try {
              await renameKey({ publicKey: key.publicKey, newAlias });
              showSuccess(`Key renamed from "${key.alias}" to "${newAlias}"`);
              modals.closeAll();
            } catch (error) {
              showError(
                error instanceof Error ? error.message : 'Failed to rename key',
              );
            }
          }}
          onCancel={() => modals.closeAll()}
          onError={showError}
        />
      ),
    });
  };

  const handleDeleteKey = async (key: ConfidentialKey) => {
    // If key is encrypted, require password verification first
    if (isKeyEncrypted({ publicKey: key.publicKey })) {
      modals.open({
        title: `Delete Key "${key.alias}"?`,
        children: (
          <DeleteKeyModal
            keyToDelete={key}
            onDelete={async () => {
              await deleteKey({ publicKey: key.publicKey });

              // Clear selection if this was the selected key
              if (selectedKey?.publicKey === key.publicKey) {
                const nextKey = keys.find((k) => k.publicKey !== key.publicKey)?.publicKey || '';
                if (nextKey) {
                  selectKey({ publicKey: nextKey });
                }
              }

              showSuccess(`Key "${key.alias}" deleted`);
              modals.closeAll();
            }}
            onCancel={() => modals.closeAll()}
          />
        ),
      });
    } else {
      // Unencrypted key - use standard confirmation modal
      modals.openConfirmModal({
        title: `Delete Key "${key.alias}"?`,
        children: (
          <Stack gap="sm">
            <Text size="sm">
              Are you sure you want to delete the key "{key.alias}"? This action
              cannot be undone.
            </Text>
            <Alert color="yellow" icon={<IconDownload size={16} />}>
              We strongly recommend downloading a backup before deleting.
            </Alert>
          </Stack>
        ),
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          try {
            await deleteKey({ publicKey: key.publicKey });

            // Clear selection if this was the selected key
            if (selectedKey?.publicKey === key.publicKey) {
              const nextKey = keys.find((k) => k.publicKey !== key.publicKey)?.publicKey || '';
              if (nextKey) {
                selectKey({ publicKey: nextKey });
              }
            }

            showSuccess(`Key "${key.alias}" deleted`);
          } catch (error) {
            showError(
              error instanceof Error ? error.message : 'Failed to delete key',
            );
          }
        },
      });
    }
  };

  const handleSelectKey = (key: ConfidentialKey) => {
    try {
      selectKey({ publicKey: key.publicKey });
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

      await executeWithKey({ operation: async (accountKeys) => {
        await registerConfidentialAccount({
          did,
          polkadotApi,
          accountKeys,
          submitTransaction,
          onProofGenerating: () => {
            showSuccess('Generating proof... This may take a moment');
          },
          onProofGenerated: () => {
            showSuccess('Proof generated, submitting transaction');
          },
        });
      }});

      updateRegistrationStatus({ publicKey: selectedKey.publicKey, registeredDid: did });
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

  const handleExportKey = async (key: ConfidentialKey) => {
    // If key is encrypted, require password verification first
    if (isKeyEncrypted({ publicKey: key.publicKey })) {
      modals.open({
        title: `Export Key "${key.alias}"`,
        children: (
          <ExportKeyModal
            keyToExport={key}
            exportKey={exportKey}
            onSuccess={() => {
              showSuccess('Backup downloaded successfully');
              modals.closeAll();
            }}
            onCancel={() => modals.closeAll()}
            onError={(error: string) => {
              showError(error);
            }}
          />
        ),
      });
    } else {
      // Unencrypted key - export directly
      try {
        const keyJson = exportKey({ publicKey: key.publicKey });
        const blob = new Blob([keyJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${key.alias.replace(/\s+/g, '_')}_backup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showSuccess('Backup downloaded successfully');
      } catch {
        showError('Failed to export key');
      }
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
          Confidential Account Management
        </Title>
        <Group>
          <FileButton
            resetRef={importFileResetRef}
            onChange={(file) => {
              setSelectedImportFile(file);
              setImportDialogOpen(true);
            }}
            accept="application/json"
          >
            {(props) => (
              <Button
                {...props}
                leftSection={<IconFileImport size={20} />}
                variant="light"
              >
                Import Key
              </Button>
            )}
          </FileButton>
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => setGenerateDialogOpen(true)}
            disabled={!isInitialized}
          >
            Generate New Keys
          </Button>
        </Group>
      </Group>

      {/* Import Key Modal */}
      <ImportKeyModal
        opened={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);
          setSelectedImportFile(null);
          importFileResetRef.current?.();
        }}
        initialFile={selectedImportFile}
        onKeyImported={() => {
          if (polkadotApi) {
            checkAllRegistrations({ polkadotApi }).catch((error) => {
              console.error(
                'Failed to check registrations after import:',
                error,
              );
            });
          }
        }}
      />

      <Group justify="space-between" mb="xl">
        <TextInput
          placeholder="Search keys..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
        />
        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as 'grid' | 'list')}
          data={[
            {
              value: 'grid',
              label: (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconLayoutGrid size={20} />
                </Box>
              ),
            },
            {
              value: 'list',
              label: (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconList size={20} />
                </Box>
              ),
            },
          ]}
        />
      </Group>

      {/* Prominent alert for unregistered selected key */}
      {hasCheckedRegistrations && selectedKey && !selectedKey.registeredDid && (
        <Alert
          color="red"
          title="Register Key On-Chain"
          icon={<IconCloudUpload size={24} />}
          mb="md"
        >
          <Group justify="space-between" align="center">
            <Text size="sm">
              Key "{selectedKey.alias}" needs to be registered to an identity
              on-chain before it can be used for confidential transactions.
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

      {filteredKeys.length === 0 ? (
        <Alert
          icon={<IconUserShield size={32} />}
          title={
            keys.length === 0
              ? 'No confidential keys yet'
              : 'No keys match your search'
          }
          color="gray"
        >
          <Text size="sm" mb="md">
            {keys.length === 0
              ? 'Generate your first confidential key to get started'
              : 'Try adjusting your search query'}
          </Text>
          {keys.length === 0 && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setGenerateDialogOpen(true)}
            >
              Generate New Keys
            </Button>
          )}
        </Alert>
      ) : viewMode === 'grid' ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filteredKeys.map((key) => (
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
                    <Tooltip label="Export Backup">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportKey(key);
                        }}
                      >
                        <IconDownload size={18} />
                      </ActionIcon>
                    </Tooltip>
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
                    {isKeyEncrypted({ publicKey: key.publicKey }) && (
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
                <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredKeys.map((key) => (
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
                    <Group gap="xs" justify="flex-end" wrap="nowrap">
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
                      <Tooltip label="Export Backup">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportKey(key);
                          }}
                        >
                          <IconDownload size={18} />
                        </ActionIcon>
                      </Tooltip>
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
                      {isKeyEncrypted({ publicKey: key.publicKey }) && (
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
      <GenerateKeyModal
        opened={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
      />
    </Container>
  );
}
