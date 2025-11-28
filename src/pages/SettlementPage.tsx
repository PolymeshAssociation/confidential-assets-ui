/**
 * Settlement Page
 *
 * Page for creating and managing settlement instructions
 */

import { PublicKeyExporter } from '@/components/key/PublicKeyExporter';
import {
  MultiLegSettlementModal,
  ReceiveSettlementModal,
  SendSettlementModal,
  SettlementDetailsModal,
} from '@/components/settlement';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import type { SettlementRecord } from '@/types/settlement';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  CopyButton,
  Group,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconCheck,
  IconCopy,
  IconPlus,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

type LegStatus = 'Pending' | 'Affirmed' | 'Rejected' | 'Finalized';

interface LegAffirmationStatus {
  sender: LegStatus;
  receiver: LegStatus;
  mediators: Map<number, LegStatus>;
}

interface SettlementChainData {
  status: string;
  pendingAffirmations: number;
  legCount: number;
  legAffirmations: Map<number, LegAffirmationStatus>;
  memo?: string;
}

// Helper component to display truncated value with copy button
function TruncatedWithCopy({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const truncated = `${value.substring(0, 8)}...${value.substring(
    value.length - 6,
  )}`;

  return (
    <Group gap={4} wrap="nowrap">
      {label && (
        <Text size="xs" c="dimmed">
          {label}:
        </Text>
      )}
      <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
        {truncated}
      </Text>
      <CopyButton value={value} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy'}>
            <ActionIcon
              size="xs"
              variant="subtle"
              color={copied ? 'teal' : 'gray'}
              onClick={copy}
            >
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}

export function SettlementPage() {
  const { settlements, isLoading, refreshSettlements, querySettlementStatus } =
    useSettlement();
  const { selectedKey } = useConfidentialKey();
  const { registeredAssets } = useAsset();
  const { polkadotApi } = usePolymesh();

  const [activeTab, setActiveTab] = useState<string | null>('create');
  const [searchSettlementId, setSearchSettlementId] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isMultiLegModalOpen, setIsMultiLegModalOpen] = useState(false);
  const [viewSettlementId, setViewSettlementId] = useState<string>('');
  const [viewLegId, setViewLegId] = useState<number>(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [settlementChainData, setSettlementChainData] = useState<
    Map<string, SettlementChainData>
  >(new Map());
  const [loadingChainData, setLoadingChainData] = useState<Set<string>>(
    new Set(),
  );

  // Convert settlements map to array
  const settlementsList = Array.from(
    settlements.values(),
  ) as SettlementRecord[];

  // Load settlement chain data (status, legs, affirmations)
  const loadSettlementChainData = useCallback(
    async (settlementId: string) => {
      if (!polkadotApi || loadingChainData.has(settlementId)) return;

      setLoadingChainData((prev) => new Set(prev).add(settlementId));

      try {
        // Query settlement status
        const status = await querySettlementStatus(settlementId);

        // Query settlement memo (optional)
        const memoOption =
          await polkadotApi.query.confidentialAssets.settlementMemo(
            settlementId,
          );
        const memo = memoOption.isSome
          ? memoOption.unwrap().toUtf8()
          : undefined;

        // Query settlement legs
        const legEntries =
          await polkadotApi.query.confidentialAssets.settlementLegs.entries(
            settlementId,
          );

        const legIds = legEntries
          .map(([key]) => key.args[1].toNumber())
          .sort((a, b) => a - b);

        // Query affirmation status for all legs
        const legAffirmations = new Map<number, LegAffirmationStatus>();

        for (const legId of legIds) {
          const affirmEntries =
            await polkadotApi.query.confidentialAssets.legAffirmationStatus.entries(
              settlementId,
              legId,
            );

          const affirmStatus: LegAffirmationStatus = {
            sender: 'Pending',
            receiver: 'Pending',
            mediators: new Map(),
          };

          for (const [key, value] of affirmEntries) {
            const party = key.args[2];

            if (value.isSome) {
              const statusValue = value.unwrap().toString() as LegStatus;

              if (party.isSender) {
                affirmStatus.sender = statusValue;
              } else if (party.isReceiver) {
                affirmStatus.receiver = statusValue;
              } else if (party.isMediator) {
                const mediatorIndex = party.asMediator.toNumber();
                affirmStatus.mediators.set(mediatorIndex, statusValue);
              }
            }
          }

          legAffirmations.set(legId, affirmStatus);
        }

        setSettlementChainData((prev) => {
          const newMap = new Map(prev);
          newMap.set(settlementId, {
            status: status.status,
            pendingAffirmations: status.pendingAffirmations,
            legCount: legIds.length,
            legAffirmations,
            memo,
          });
          return newMap;
        });
      } catch (err) {
        console.error(
          'Failed to load settlement chain data:',
          settlementId,
          err,
        );
      } finally {
        setLoadingChainData((prev) => {
          const newSet = new Set(prev);
          newSet.delete(settlementId);
          return newSet;
        });
      }
    },
    [polkadotApi, querySettlementStatus, loadingChainData],
  );

  // Refresh all chain data for existing settlements
  const refreshAllChainData = useCallback(() => {
    if (polkadotApi && settlementsList.length > 0) {
      settlementsList.forEach((settlement) => {
        loadSettlementChainData(settlement.settlementId);
      });
    }
  }, [polkadotApi, settlementsList, loadSettlementChainData]);

  // Load chain data for all settlements when they change
  useEffect(() => {
    if (polkadotApi && settlementsList.length > 0) {
      settlementsList.forEach((settlement) => {
        if (!settlementChainData.has(settlement.settlementId)) {
          loadSettlementChainData(settlement.settlementId);
        }
      });
    }
  }, [
    settlementsList,
    polkadotApi,
    settlementChainData,
    loadSettlementChainData,
  ]);

  // Handle viewing a settlement from the list
  const handleViewSettlement = (settlement: SettlementRecord) => {
    setViewSettlementId(settlement.settlementId);
    setViewLegId(0);
    setIsDetailsModalOpen(true);
  };

  // Handle viewing a settlement from search
  const handleViewFromSearch = () => {
    if (!searchSettlementId) return;
    setViewSettlementId(searchSettlementId);
    setViewLegId(0);
    setIsDetailsModalOpen(true);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Transfer Instructions</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Create and manage confidential asset transfers
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={() => {
              refreshSettlements();
              refreshAllChainData();
            }}
            loading={isLoading}
          >
            Refresh
          </Button>
        </Group>

        {/* Alert if no key is selected */}
        {!selectedKey && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="No Key Selected"
            color="yellow"
          >
            Please select a confidential key to create or view transfers.
          </Alert>
        )}

        {/* Alert if no assets registered */}
        {selectedKey && registeredAssets.length === 0 && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="No Assets Registered"
            color="blue"
          >
            You need to register for at least one asset before creating
            transfers. Visit the Asset Management page to register.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="create" leftSection={<IconPlus size={16} />}>
              Create Transfer
            </Tabs.Tab>
            <Tabs.Tab value="view" leftSection={<IconSearch size={16} />}>
              View Transfer
            </Tabs.Tab>
            <Tabs.Tab
              value="list"
              leftSection={<IconArrowsExchange size={16} />}
            >
              My Transfers
            </Tabs.Tab>
          </Tabs.List>

          {/* My Settlements Tab */}
          <Tabs.Panel value="list" pt="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Transfer History</Text>
                  <Badge>{settlementsList.length}</Badge>
                </Group>
              </Card.Section>

              <Card.Section inheritPadding py="md">
                <LoadingOverlay visible={isLoading} />

                {settlementsList.length === 0 ? (
                  <Stack align="center" py={40}>
                    <IconArrowsExchange size={48} stroke={1.5} opacity={0.3} />
                    <Text c="dimmed" size="sm">
                      No transfers yet
                    </Text>
                    <Text c="dimmed" size="xs">
                      Create your first transfer to send confidential assets
                    </Text>
                  </Stack>
                ) : (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {settlementsList.map((settlement) => {
                      const chainData = settlementChainData.get(
                        settlement.settlementId,
                      );
                      const isLoadingData = loadingChainData.has(
                        settlement.settlementId,
                      );

                      return (
                        <Card
                          key={settlement.settlementId}
                          padding="md"
                          radius="sm"
                          withBorder
                        >
                          <Stack gap="xs">
                            <Group justify="space-between">
                              <Group gap={4}>
                                <Text size="xs" c="dimmed">
                                  Role(s):
                                </Text>
                                {settlement.roles.map((role) => (
                                  <Badge
                                    key={role}
                                    color={
                                      role === 'sender'
                                        ? 'red'
                                        : role === 'receiver'
                                          ? 'green'
                                          : 'blue'
                                    }
                                    variant="light"
                                  >
                                    {role}
                                  </Badge>
                                ))}
                              </Group>
                              <Text size="xs" c="dimmed">
                                {new Date(
                                  settlement.createdAt,
                                ).toLocaleDateString()}
                              </Text>
                            </Group>

                            <TruncatedWithCopy
                              value={settlement.settlementId}
                              label="ID"
                            />

                            {isLoadingData ? (
                              <Group gap="xs">
                                <Loader size="xs" />
                                <Text size="xs" c="dimmed">
                                  Loading details...
                                </Text>
                              </Group>
                            ) : chainData ? (
                              <Stack gap="xs">
                                {/* Settlement Status */}
                                <Group gap="xs">
                                  <Text size="xs" c="dimmed">
                                    Status:
                                  </Text>
                                  <Badge
                                    size="sm"
                                    color={
                                      chainData.status === 'Executed'
                                        ? 'green'
                                        : chainData.status === 'Pending'
                                          ? 'yellow'
                                          : 'gray'
                                    }
                                    variant="light"
                                  >
                                    {chainData.status}
                                  </Badge>
                                </Group>

                                {/* Leg Count */}
                                <Group gap="xs">
                                  <Text size="xs" c="dimmed">
                                    Legs:
                                  </Text>
                                  <Badge size="sm" variant="light">
                                    {chainData.legCount}
                                  </Badge>
                                </Group>

                                {/* Pending Affirmations */}
                                {chainData.pendingAffirmations > 0 && (
                                  <Group gap="xs">
                                    <Text size="xs" c="dimmed">
                                      Pending:
                                    </Text>
                                    <Badge
                                      size="sm"
                                      color="orange"
                                      variant="light"
                                    >
                                      {chainData.pendingAffirmations}{' '}
                                      affirmation
                                      {chainData.pendingAffirmations !== 1
                                        ? 's'
                                        : ''}
                                    </Badge>
                                  </Group>
                                )}

                                {/* Affirmation Status Summary */}
                                {chainData.legAffirmations.size > 0 && (
                                  <Stack gap={4}>
                                    <Text size="xs" c="dimmed">
                                      Affirmations:
                                    </Text>
                                    {Array.from(
                                      chainData.legAffirmations.entries(),
                                    ).map(([legId, status]) => (
                                      <Group key={legId} gap={4} wrap="wrap">
                                        <Text
                                          size="xs"
                                          c="dimmed"
                                          style={{
                                            minWidth: '35px',
                                          }}
                                        >
                                          Leg {legId}:
                                        </Text>
                                        <Badge
                                          size="xs"
                                          color={
                                            status.sender === 'Affirmed'
                                              ? 'teal'
                                              : status.sender === 'Finalized'
                                                ? 'green'
                                                : status.sender === 'Rejected'
                                                  ? 'red'
                                                  : 'blue'
                                          }
                                          variant="light"
                                        >
                                          Sender: {status.sender}
                                        </Badge>
                                        <Badge
                                          size="xs"
                                          color={
                                            status.receiver === 'Affirmed'
                                              ? 'teal'
                                              : status.receiver === 'Finalized'
                                                ? 'green'
                                                : status.receiver === 'Rejected'
                                                  ? 'red'
                                                  : 'blue'
                                          }
                                          variant="light"
                                        >
                                          Receiver: {status.receiver}
                                        </Badge>
                                        {status.mediators.size > 0 &&
                                          Array.from(
                                            status.mediators.entries(),
                                          ).map(([idx, mStatus]) => (
                                            <Badge
                                              key={idx}
                                              size="xs"
                                              color={
                                                mStatus === 'Affirmed'
                                                  ? 'teal'
                                                  : mStatus === 'Finalized'
                                                    ? 'green'
                                                    : mStatus === 'Rejected'
                                                      ? 'red'
                                                      : 'blue'
                                              }
                                              variant="light"
                                            >
                                              Mediator {idx}: {mStatus}
                                            </Badge>
                                          ))}
                                      </Group>
                                    ))}
                                  </Stack>
                                )}

                                {/* Memo */}
                                {chainData.memo && (
                                  <Stack gap={4}>
                                    <Text size="xs" c="dimmed">
                                      Memo:
                                    </Text>
                                    <Text
                                      size="xs"
                                      style={{
                                        fontStyle: 'italic',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      {chainData.memo}
                                    </Text>
                                  </Stack>
                                )}
                              </Stack>
                            ) : (
                              <></>
                            )}

                            <Group gap="xs" mt="xs">
                              <Button
                                size="xs"
                                variant="light"
                                fullWidth
                                onClick={() => handleViewSettlement(settlement)}
                              >
                                View Details
                              </Button>
                            </Group>
                          </Stack>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>

          {/* Create Settlement Tab */}
          <Tabs.Panel value="create" pt="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>Create Transfer</Text>
              </Card.Section>

              <Card.Section inheritPadding py="md">
                {!selectedKey ? (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Confidential Key Required"
                    color="yellow"
                    mt="md"
                  >
                    Please select a confidential key to create transfers.
                  </Alert>
                ) : registeredAssets.length === 0 ? (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="No Assets Available"
                    color="yellow"
                    mt="md"
                  >
                    You need to register for at least one asset before creating
                    a transfer. Visit the Asset Management page to register for
                    assets.
                  </Alert>
                ) : (
                  <Stack gap="lg" py="md">
                    {/* Public Key Exporter - needed for receiving settlements */}
                    <PublicKeyExporter />

                    {/* Send Assets Button */}
                    <Stack align="center" py={20}>
                      <IconArrowsExchange
                        size={64}
                        stroke={1.5}
                        opacity={0.3}
                      />
                      <Text fw={500} size="lg">
                        Send Assets to Another Party
                      </Text>
                      <Text c="dimmed" size="sm" ta="center" maw={500}>
                        Send confidential assets to another party via a transfer
                        instruction. Both you (sender) and the receiver must
                        affirm before the transfer is executed.
                      </Text>
                      <Group mt="md" wrap="wrap" justify="center">
                        <Button
                          leftSection={<IconPlus size={16} />}
                          size="lg"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          Send Assets
                        </Button>
                        <Button
                          leftSection={<IconPlus size={16} />}
                          size="lg"
                          variant="light"
                          onClick={() => setIsReceiveModalOpen(true)}
                        >
                          Receive Assets
                        </Button>
                        <Button
                          leftSection={<IconArrowsExchange size={16} />}
                          size="lg"
                          variant="outline"
                          onClick={() => setIsMultiLegModalOpen(true)}
                        >
                          Multi-Leg (Atomic Swap)
                        </Button>
                      </Group>
                    </Stack>
                  </Stack>
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>

          {/* View Settlement Tab */}
          <Tabs.Panel value="view" pt="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>View Transfer by ID</Text>
              </Card.Section>

              <Card.Section inheritPadding py="md">
                <Stack gap="md">
                  <TextInput
                    label="Transfer ID"
                    placeholder="Enter transfer ID..."
                    value={searchSettlementId}
                    onChange={(e) => setSearchSettlementId(e.target.value)}
                    leftSection={<IconSearch size={16} />}
                  />

                  <Button
                    disabled={!searchSettlementId}
                    leftSection={<IconSearch size={16} />}
                    onClick={handleViewFromSearch}
                  >
                    Decrypt & View
                  </Button>

                  <Text size="xs" c="dimmed" mt="md">
                    Enter a transfer ID to decrypt and view its details. You
                    must be involved in the transfer (sender, receiver,
                    mediator, or auditor) to decrypt it.
                  </Text>
                </Stack>
              </Card.Section>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Create Settlement Modal */}
      <SendSettlementModal
        opened={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          refreshSettlements();
        }}
      />

      {/* Receive Settlement Modal */}
      <ReceiveSettlementModal
        opened={isReceiveModalOpen}
        onClose={() => {
          setIsReceiveModalOpen(false);
          refreshSettlements();
        }}
      />

      {/* Multi-Leg Transfer Modal */}
      <MultiLegSettlementModal
        opened={isMultiLegModalOpen}
        onClose={() => {
          setIsMultiLegModalOpen(false);
          refreshSettlements();
        }}
      />

      {/* Settlement Details Modal */}
      {viewSettlementId && (
        <SettlementDetailsModal
          opened={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setViewSettlementId('');
            refreshSettlements();
            loadSettlementChainData(viewSettlementId);
          }}
          settlementId={viewSettlementId}
          initialLegId={viewLegId}
          onAffirmationComplete={() => {
            loadSettlementChainData(viewSettlementId);
          }}
        />
      )}
    </Container>
  );
}
