/**
 * Settlement Page
 *
 * Page for creating and managing settlement instructions
 */

import { TruncatedWithCopy } from '@/components/TruncatedWithCopy';
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
import type { SettlementChainData, SettlementRecord } from '@/types/settlement';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Menu,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconSortAscending,
  IconSortDescending,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function SettlementPage() {
  const { settlements, isLoading, refreshSettlements, querySettlementDetails } =
    useSettlement();
  const { selectedKey } = useConfidentialKey();
  const { registeredAssets } = useAsset();
  const { polkadotApi, selectedAccount } = usePolymesh();

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

  // View and filter state
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<
    'date' | 'status' | 'legs' | 'roles'
  >('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Toggle sort for table headers
  const handleSort = (field: 'date' | 'status' | 'legs' | 'roles') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Convert settlements map to array
  const settlementsList = Array.from(
    settlements.values(),
  ) as SettlementRecord[];

  // Filter and sort settlements
  const filteredAndSortedSettlements = useMemo(() => {
    let filtered = [...settlementsList];

    // Apply role filter
    if (roleFilter.length > 0) {
      filtered = filtered.filter((settlement) =>
        settlement.roles.some((role) => roleFilter.includes(role)),
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((settlement) => {
        const chainData = settlementChainData.get(settlement.settlementId);
        return chainData && statusFilter.includes(chainData.status);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'status': {
          const statusA =
            settlementChainData.get(a.settlementId)?.status || 'Unknown';
          const statusB =
            settlementChainData.get(b.settlementId)?.status || 'Unknown';
          comparison = statusA.localeCompare(statusB);
          break;
        }
        case 'legs': {
          const legsA = settlementChainData.get(a.settlementId)?.legCount || 0;
          const legsB = settlementChainData.get(b.settlementId)?.legCount || 0;
          comparison = legsA - legsB;
          break;
        }
        case 'roles':
          comparison = a.roles.join(',').localeCompare(b.roles.join(','));
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    settlementsList,
    roleFilter,
    statusFilter,
    sortField,
    sortDirection,
    settlementChainData,
  ]);

  // Load settlement chain data (status, legs, affirmations)
  const loadSettlementChainData = useCallback(
    async (settlementId: string) => {
      if (!polkadotApi || loadingChainData.has(settlementId)) return;

      setLoadingChainData((prev) => new Set(prev).add(settlementId));

      try {
        const details = await querySettlementDetails(settlementId);

        setSettlementChainData((prev) => {
          const newMap = new Map(prev);
          newMap.set(settlementId, {
            status: details.status,
            pendingAffirmations: details.pendingAffirmations,
            pendingFinalizations: details.pendingFinalizations,
            legCount: details.legIds.length,
            legAffirmations: details.legAffirmations,
            memo: details.memo,
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
    [polkadotApi, querySettlementDetails, loadingChainData],
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
            title="No Confidential Account Selected"
            color="yellow"
          >
            Please select a confidential account to create or view transfers.
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
                <Group justify="space-between" wrap="wrap">
                  <Group gap="xs">
                    <Text fw={500}>My Transfers</Text>
                    <Badge>
                      {filteredAndSortedSettlements.length}
                      {roleFilter.length > 0 || statusFilter.length > 0
                        ? ` / ${settlementsList.length}`
                        : ''}
                    </Badge>
                  </Group>
                  <Group gap="xs" wrap="wrap">
                    {/* View Mode Toggle (Desktop only) */}
                    <SegmentedControl
                      value={viewMode}
                      onChange={(value) =>
                        setViewMode(value as 'cards' | 'table')
                      }
                      data={[
                        {
                          value: 'cards',
                          label: (
                            <Group gap={4}>
                              <IconLayoutGrid size={20} />
                            </Group>
                          ),
                        },
                        {
                          value: 'table',
                          label: (
                            <Group gap={4}>
                              <IconList size={20} />
                            </Group>
                          ),
                        },
                      ]}
                      visibleFrom="md"
                    />
                  </Group>
                </Group>
              </Card.Section>

              {/* Filters */}
              {settlementsList.length > 0 && (
                <Card.Section inheritPadding py="sm" withBorder>
                  <Group gap="sm" wrap="wrap">
                    <Menu shadow="md" width={300} position="bottom-start">
                      <Menu.Target>
                        <Button
                          variant="default"
                          leftSection={<IconFilter size={16} />}
                          rightSection={
                            (roleFilter.length > 0 ||
                              statusFilter.length > 0) && (
                              <Badge size="sm" circle>
                                {roleFilter.length + statusFilter.length}
                              </Badge>
                            )
                          }
                        >
                          Filters
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Label>Filter by Role</Menu.Label>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={roleFilter.includes('sender')}
                              onChange={() => {
                                setRoleFilter((prev) =>
                                  prev.includes('sender')
                                    ? prev.filter((r) => r !== 'sender')
                                    : [...prev, 'sender'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Sender
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={roleFilter.includes('receiver')}
                              onChange={() => {
                                setRoleFilter((prev) =>
                                  prev.includes('receiver')
                                    ? prev.filter((r) => r !== 'receiver')
                                    : [...prev, 'receiver'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Receiver
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={roleFilter.includes('mediator')}
                              onChange={() => {
                                setRoleFilter((prev) =>
                                  prev.includes('mediator')
                                    ? prev.filter((r) => r !== 'mediator')
                                    : [...prev, 'mediator'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Mediator
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={roleFilter.includes('auditor')}
                              onChange={() => {
                                setRoleFilter((prev) =>
                                  prev.includes('auditor')
                                    ? prev.filter((r) => r !== 'auditor')
                                    : [...prev, 'auditor'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Auditor
                        </Menu.Item>

                        <Divider my="xs" />

                        <Menu.Label>Filter by Status</Menu.Label>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={statusFilter.includes('Pending')}
                              onChange={() => {
                                setStatusFilter((prev) =>
                                  prev.includes('Pending')
                                    ? prev.filter((s) => s !== 'Pending')
                                    : [...prev, 'Pending'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Pending
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={statusFilter.includes('Executed')}
                              onChange={() => {
                                setStatusFilter((prev) =>
                                  prev.includes('Executed')
                                    ? prev.filter((s) => s !== 'Executed')
                                    : [...prev, 'Executed'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Executed
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={statusFilter.includes('Finalized')}
                              onChange={() => {
                                setStatusFilter((prev) =>
                                  prev.includes('Finalized')
                                    ? prev.filter((s) => s !== 'Finalized')
                                    : [...prev, 'Finalized'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Finalized
                        </Menu.Item>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={statusFilter.includes('Rejected')}
                              onChange={() => {
                                setStatusFilter((prev) =>
                                  prev.includes('Rejected')
                                    ? prev.filter((s) => s !== 'Rejected')
                                    : [...prev, 'Rejected'],
                                );
                              }}
                              tabIndex={-1}
                            />
                          }
                        >
                          Rejected
                        </Menu.Item>

                        {(roleFilter.length > 0 || statusFilter.length > 0) && (
                          <>
                            <Divider my="xs" />
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={16} />}
                              onClick={() => {
                                setRoleFilter([]);
                                setStatusFilter([]);
                              }}
                            >
                              Clear all filters
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>

                    {/* Sort controls for cards view only */}
                    {viewMode === 'cards' && (
                      <>
                        <Text size="sm" c="dimmed">
                          Sort by:
                        </Text>
                        <Select
                          data={[
                            { value: 'status', label: 'Status' },
                            { value: 'roles', label: 'Roles' },
                            { value: 'legs', label: 'Legs' },
                            { value: 'date', label: 'Date' },
                          ]}
                          value={sortField}
                          onChange={(value) =>
                            setSortField(
                              value as 'date' | 'status' | 'legs' | 'roles',
                            )
                          }
                          size="sm"
                          w={150}
                        />
                        <ActionIcon
                          variant="light"
                          onClick={() =>
                            setSortDirection((prev) =>
                              prev === 'asc' ? 'desc' : 'asc',
                            )
                          }
                          size="lg"
                        >
                          {sortDirection === 'asc' ? (
                            <IconSortAscending size={18} />
                          ) : (
                            <IconSortDescending size={18} />
                          )}
                        </ActionIcon>
                      </>
                    )}
                  </Group>
                </Card.Section>
              )}

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
                ) : filteredAndSortedSettlements.length === 0 ? (
                  <Stack align="center" py={40}>
                    <IconFilter size={48} stroke={1.5} opacity={0.3} />
                    <Text c="dimmed" size="sm">
                      No transfers match your filters
                    </Text>
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setRoleFilter([]);
                        setStatusFilter([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Stack>
                ) : viewMode === 'table' ? (
                  <Table.ScrollContainer minWidth={800}>
                    <Table highlightOnHover striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Transfer ID</Table.Th>
                          <Table.Th
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('roles')}
                          >
                            <Group gap={4} wrap="nowrap">
                              <span>Roles</span>
                              {sortField === 'roles' ? (
                                sortDirection === 'asc' ? (
                                  <IconChevronUp size={14} />
                                ) : (
                                  <IconChevronDown size={14} />
                                )
                              ) : (
                                <IconSelector size={14} opacity={0.5} />
                              )}
                            </Group>
                          </Table.Th>
                          <Table.Th
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('status')}
                          >
                            <Group gap={4} wrap="nowrap">
                              <span>Status</span>
                              {sortField === 'status' ? (
                                sortDirection === 'asc' ? (
                                  <IconChevronUp size={14} />
                                ) : (
                                  <IconChevronDown size={14} />
                                )
                              ) : (
                                <IconSelector size={14} opacity={0.5} />
                              )}
                            </Group>
                          </Table.Th>
                          <Table.Th
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('legs')}
                          >
                            <Group gap={4} wrap="nowrap">
                              <span>Legs</span>
                              {sortField === 'legs' ? (
                                sortDirection === 'asc' ? (
                                  <IconChevronUp size={14} />
                                ) : (
                                  <IconChevronDown size={14} />
                                )
                              ) : (
                                <IconSelector size={14} opacity={0.5} />
                              )}
                            </Group>
                          </Table.Th>
                          <Table.Th>
                            <Group gap={4} wrap="nowrap">
                              <span>Pending</span>
                              <Tooltip
                                multiline
                                w={200}
                                label="AFF = pending affirmations, FIN = pending finalizations"
                                withArrow
                              >
                                <IconAlertCircle size={14} opacity={0.7} />
                              </Tooltip>
                            </Group>
                          </Table.Th>
                          <Table.Th
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('date')}
                          >
                            <Group gap={4} wrap="nowrap">
                              <span>Date</span>
                              {sortField === 'date' ? (
                                sortDirection === 'asc' ? (
                                  <IconChevronUp size={14} />
                                ) : (
                                  <IconChevronDown size={14} />
                                )
                              ) : (
                                <IconSelector size={14} opacity={0.5} />
                              )}
                            </Group>
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {filteredAndSortedSettlements.map((settlement) => {
                          const chainData = settlementChainData.get(
                            settlement.settlementId,
                          );
                          const isLoadingData = loadingChainData.has(
                            settlement.settlementId,
                          );

                          return (
                            <Table.Tr
                              key={settlement.settlementId}
                              onClick={() => handleViewSettlement(settlement)}
                              onKeyDown={(event) => {
                                if (
                                  event.key === 'Enter' ||
                                  event.key === ' '
                                ) {
                                  event.preventDefault();
                                  handleViewSettlement(settlement);
                                }
                              }}
                              tabIndex={0}
                              style={{ cursor: 'pointer' }}
                            >
                              <Table.Td>
                                <TruncatedWithCopy
                                  value={settlement.settlementId}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Group gap={4}>
                                  {settlement.roles.map((role) => (
                                    <Badge
                                      key={role}
                                      size="sm"
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
                              </Table.Td>
                              <Table.Td>
                                {isLoadingData ? (
                                  <Loader size="xs" />
                                ) : chainData ? (
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
                                ) : (
                                  <Text size="xs" c="dimmed">
                                    -
                                  </Text>
                                )}
                              </Table.Td>
                              <Table.Td>
                                {chainData ? (
                                  <Badge size="sm" variant="light">
                                    {chainData.legCount}
                                  </Badge>
                                ) : (
                                  <Text size="xs" c="dimmed">
                                    -
                                  </Text>
                                )}
                              </Table.Td>
                              <Table.Td>
                                {chainData &&
                                (chainData.pendingAffirmations > 0 ||
                                  chainData.pendingFinalizations > 0) ? (
                                  <Stack gap={4}>
                                    {chainData.pendingAffirmations > 0 && (
                                      <Badge
                                        size="sm"
                                        color="orange"
                                        variant="light"
                                      >
                                        {chainData.pendingAffirmations} AFF
                                      </Badge>
                                    )}
                                    {chainData.pendingFinalizations > 0 && (
                                      <Badge
                                        size="sm"
                                        color="yellow"
                                        variant="light"
                                      >
                                        {chainData.pendingFinalizations} FIN
                                      </Badge>
                                    )}
                                  </Stack>
                                ) : (
                                  <Text size="xs" c="dimmed">
                                    -
                                  </Text>
                                )}
                              </Table.Td>
                              <Table.Td>
                                <Text size="xs">
                                  {new Date(
                                    settlement.createdAt,
                                  ).toLocaleDateString()}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                ) : (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {filteredAndSortedSettlements.map(
                      (settlement: SettlementRecord) => {
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
                                        Pending Affirmations:
                                      </Text>
                                      <Badge
                                        size="sm"
                                        color="orange"
                                        variant="light"
                                      >
                                        {chainData.pendingAffirmations}
                                      </Badge>
                                    </Group>
                                  )}

                                  {/* Pending Finalizations */}
                                  {chainData.pendingFinalizations > 0 && (
                                    <Group gap="xs">
                                      <Text size="xs" c="dimmed">
                                        Pending Finalizations:
                                      </Text>
                                      <Badge
                                        size="sm"
                                        color="yellow"
                                        variant="light"
                                      >
                                        {chainData.pendingFinalizations}
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
                                                : status.receiver ===
                                                    'Finalized'
                                                  ? 'green'
                                                  : status.receiver ===
                                                      'Rejected'
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
                                  onClick={() =>
                                    handleViewSettlement(settlement)
                                  }
                                >
                                  View Details
                                </Button>
                              </Group>
                            </Stack>
                          </Card>
                        );
                      },
                    )}
                  </SimpleGrid>
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>

          {/* Create Transfer Tab */}
          <Tabs.Panel value="create" pt="lg">
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Card withBorder padding="lg" radius="md">
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={48}
                      radius="md"
                      variant="light"
                      color="polyPink"
                    >
                      <IconUpload size={24} />
                    </ThemeIcon>
                    <Stack gap={4} align="center">
                      <Text fw={500}>Send Assets</Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Send confidential assets to another party
                      </Text>
                    </Stack>
                    <Tooltip
                      label="Register for at least one asset to send"
                      disabled={registeredAssets.length > 0}
                    >
                      <Button
                        fullWidth
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={registeredAssets.length === 0}
                      >
                        Create Transfer
                      </Button>
                    </Tooltip>
                  </Stack>
                </Card>

                <Card withBorder padding="lg" radius="md">
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={48}
                      radius="md"
                      variant="light"
                      color="teal"
                    >
                      <IconDownload size={24} />
                    </ThemeIcon>
                    <Stack gap={4} align="center">
                      <Text fw={500}>Receive Assets</Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Initiate a request to receive assets
                      </Text>
                    </Stack>
                    <Tooltip
                      label="Register for at least one asset to receive"
                      disabled={registeredAssets.length > 0}
                    >
                      <Button
                        fullWidth
                        variant="light"
                        onClick={() => setIsReceiveModalOpen(true)}
                        disabled={registeredAssets.length === 0}
                      >
                        Request Transfer
                      </Button>
                    </Tooltip>
                  </Stack>
                </Card>

                <Card withBorder padding="lg" radius="md">
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={48}
                      radius="md"
                      variant="light"
                      color="violet"
                    >
                      <IconArrowsExchange size={24} />
                    </ThemeIcon>
                    <Stack gap={4} align="center">
                      <Text fw={500}>Multi-Leg Transfer</Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Complex swaps involving multiple parties
                      </Text>
                    </Stack>
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => setIsMultiLegModalOpen(true)}
                      disabled={!selectedAccount}
                    >
                      Multi-Leg Builder
                    </Button>
                  </Stack>
                </Card>
              </SimpleGrid>

              {selectedKey && registeredAssets.length === 0 && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Asset Registration Required"
                  color="yellow"
                >
                  You must register for assets on the Asset Management page
                  before you can send or receive them.
                </Alert>
              )}

              {/* Public Key Exporter */}
              {selectedKey && <PublicKeyExporter />}
            </Stack>
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
                    placeholder="Enter transfer ID (0x...)"
                    value={searchSettlementId}
                    onChange={(e) => setSearchSettlementId(e.target.value)}
                    leftSection={<IconSearch size={16} />}
                    error={
                      searchSettlementId &&
                      !/^0x[0-9a-fA-F]{64}$/.test(searchSettlementId)
                        ? 'Transfer ID must be a 32-byte hex string (0x followed by 64 hex characters)'
                        : null
                    }
                  />

                  <Button
                    disabled={
                      !selectedKey ||
                      !searchSettlementId ||
                      !/^0x[0-9a-fA-F]{64}$/.test(searchSettlementId)
                    }
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
