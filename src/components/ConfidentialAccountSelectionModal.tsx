import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  List,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconLock,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './ConfidentialAccountSelectionModal.module.css';
import { TruncatedWithCopy } from './TruncatedWithCopy';

interface ConfidentialAccountSelectionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ConfidentialAccountSelectionModal({
  opened,
  onClose,
}: ConfidentialAccountSelectionModalProps) {
  const { keys, selectedKey, selectKey, isInitialized, keepUnlocked } =
    useConfidentialKey();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sortByName, setSortByName] = useState(false);

  const filteredKeys = useMemo(() => {
    const query = search.toLowerCase();
    let filtered = keys.filter(
      (key) =>
        key.alias.toLowerCase().includes(query) ||
        key.publicKey.toLowerCase().includes(query),
    );

    // Sort if enabled
    if (sortByName) {
      filtered = [...filtered].sort((a, b) => a.alias.localeCompare(b.alias));
    }

    // Move selected key to the top
    if (selectedKey) {
      const selectedIndex = filtered.findIndex(
        (key) => key.publicKey === selectedKey.publicKey,
      );
      if (selectedIndex > 0) {
        const selected = filtered.splice(selectedIndex, 1)[0];
        filtered.unshift(selected);
      }
    }

    return filtered;
  }, [keys, search, sortByName, selectedKey]);

  const handleCreateAccount = () => {
    navigate('/confidential-accounts');
    onClose();
  };

  const hasNoAccounts = keys.length === 0;

  return (
    <Modal
      opened={opened && isInitialized}
      onClose={onClose}
      title={
        hasNoAccounts ? 'No Confidential Accounts' : 'Confidential Accounts'
      }
      centered
      size="md"
      transitionProps={{
        transition: 'pop',
        duration: 300,
        timingFunction: 'linear',
      }}
    >
      <Stack gap="md">
        {/* No Accounts Alert */}
        {hasNoAccounts && (
          <>
            <Alert
              icon={<IconAlertCircle size={20} />}
              title="No Confidential Accounts Available"
              color="yellow"
            >
              <Text size="sm">
                You haven't created any confidential accounts yet.
              </Text>
            </Alert>

            <div>
              <Text size="sm" fw={600} mb="sm">
                What you need to do:
              </Text>
              <List spacing="xs" size="sm">
                <List.Item>
                  Create a new confidential account in the Key Management page
                </List.Item>
                <List.Item>
                  You can generate a new account or import an existing one
                </List.Item>
                <List.Item>
                  After creating an account, you can select it here
                </List.Item>
              </List>
            </div>

            <Alert color="blue" variant="light">
              <Text size="sm">
                <strong>Tip:</strong> Confidential accounts are used to manage
                confidential assets on the Polymesh blockchain. They provide
                privacy for your asset holdings and transactions.
              </Text>
            </Alert>
          </>
        )}

        {/* Current Account Section */}
        {selectedKey && (
          <Box
            p="md"
            style={(theme) => ({
              backgroundColor:
                colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              borderRadius: theme.radius.md,
            })}
          >
            <Stack gap={4}>
              <Group gap="xs" wrap="nowrap">
                <Text fw={600} size="lg" lh={1.2} lineClamp={2}>
                  {selectedKey.alias}
                </Text>
                {keepUnlocked ? (
                  <Tooltip label="Account is unlocked">
                    <Badge size="sm" color="green" variant="light">
                      Unlocked
                    </Badge>
                  </Tooltip>
                ) : (
                  <Tooltip label="Account is locked">
                    <Badge
                      size="sm"
                      color="gray"
                      variant="light"
                      leftSection={<IconLock size={12} />}
                    >
                      Locked
                    </Badge>
                  </Tooltip>
                )}
              </Group>

              <TruncatedWithCopy
                label="Public Key"
                value={selectedKey.publicKey}
              />

              <TruncatedWithCopy
                label="Encryption Key"
                value={selectedKey.encryptionPublicKey}
              />

              {selectedKey.registeredDid && (
                <TruncatedWithCopy
                  label="DID"
                  value={selectedKey.registeredDid}
                />
              )}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Account List Section */}
        {!hasNoAccounts && (
          <Stack gap="xs">
            <TextInput
              placeholder="Search accounts..."
              leftSection={<IconSearch size="0.8rem" />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="sm"
            />

            <Group justify="space-between" align="center" mt="xs">
              <Text size="xs" c="dimmed" fw={700}>
                AVAILABLE ACCOUNTS
              </Text>
              <Button
                variant="subtle"
                size="compact-xs"
                color="gray"
                onClick={() => setSortByName(!sortByName)}
              >
                {sortByName ? 'Unsort' : 'Sort by name'}
              </Button>
            </Group>

            <ScrollArea.Autosize mah={300} type="auto">
              <Stack gap={4}>
                {filteredKeys.map((key) => (
                  <Box
                    key={key.publicKey}
                    component="button"
                    onClick={() => {
                      selectKey({ publicKey: key.publicKey });
                      setSearch('');
                      onClose();
                    }}
                    className={classes.accountCard}
                    data-selected={
                      selectedKey?.publicKey === key.publicKey || undefined
                    }
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                        <Group gap="xs" wrap="nowrap">
                          <Text size="sm" fw={500} lineClamp={1}>
                            {key.alias}
                          </Text>
                          {key.registeredDid && (
                            <Tooltip label="Registered on-chain">
                              <Badge size="xs" color="green" variant="dot">
                                Registered
                              </Badge>
                            </Tooltip>
                          )}
                        </Group>
                        <Text size="xs" c="dimmed" ff="monospace" lineClamp={1}>
                          {`${key.publicKey.substring(0, 12)}...${key.publicKey.slice(-12)}`}
                        </Text>
                      </Stack>
                      {selectedKey?.publicKey === key.publicKey && (
                        <IconCheck
                          size="1rem"
                          color="var(--mantine-color-green-6)"
                        />
                      )}
                    </Group>
                  </Box>
                ))}
                {filteredKeys.length === 0 && (
                  <Stack gap="sm" py="md" align="center">
                    <Text size="sm" c="dimmed" ta="center">
                      {keys.length === 0
                        ? 'No confidential accounts found'
                        : 'No accounts match your search'}
                    </Text>
                  </Stack>
                )}
              </Stack>
            </ScrollArea.Autosize>
          </Stack>
        )}

        <Divider />

        {/* Footer Actions */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            leftSection={<IconPlus size="1rem" />}
            onClick={handleCreateAccount}
            color="polyPink"
          >
            Create Account
          </Button>
          <Button variant="subtle" color="gray" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
