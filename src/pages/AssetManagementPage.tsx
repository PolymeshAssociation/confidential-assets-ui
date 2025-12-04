/**
 * Asset Management Page
 *
 * Main page for creating, viewing, and managing confidential assets
 */

import {
  AssetCard,
  AssetDetailsDrawer,
  AssetTable,
  CreateAssetModal,
  MintAssetModal,
  RegisterAssetModal,
  RegisterByAssetIdModal,
} from '@/components';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import type { AssetDetails, DisplayAsset } from '@/types/asset';
import { formatTokenAmount } from '@/utils/formatNumber';
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
  LoadingOverlay,
  Menu,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBriefcase,
  IconCoin,
  IconCoins,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconRefresh,
  IconSortAscending,
  IconSortDescending,
  IconX,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';

export function AssetManagementPage() {
  const {
    ownedAssets,
    registeredAssets,
    isLoading,
    error,
    refreshOwnedAssets,
    refreshRegisteredAssets,
  } = useAsset();
  const { selectedKey } = useConfidentialKey();
  const [activeTab, setActiveTab] = useState<string | null>('registered');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [registerModalOpened, setRegisterModalOpened] = useState(false);
  const [registerByIdModalOpened, setRegisterByIdModalOpened] = useState(false);
  const [mintModalOpened, setMintModalOpened] = useState(false);

  // Selection states
  const [selectedAssetForRegistration, setSelectedAssetForRegistration] =
    useState<{
      assetId: string;
      assetName?: string;
    } | null>(null);
  const [selectedAssetForMinting, setSelectedAssetForMinting] = useState<{
    assetId: string;
    assetName?: string;
    decimals?: number;
  } | null>(null);

  // Details Drawer state
  const [detailsDrawerOpened, setDetailsDrawerOpened] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Filter and sort state
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [assetTypeFilter, setAssetTypeFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<
    'name' | 'symbol' | 'balance' | 'totalSupply' | 'type'
  >('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleViewDetails = (assetId: string) => {
    setSelectedAssetId(assetId);
    setDetailsDrawerOpened(true);
  };

  const mapAssetForDisplay = (
    asset: AssetDetails,
    isRegistered: boolean = false,
  ): DisplayAsset => ({
    name: asset.name || `Asset ${asset.assetId}`,
    symbol: asset.symbol || 'Unknown',
    balance:
      asset.balance !== undefined
        ? formatTokenAmount(asset.balance, asset.decimals ?? 0)
        : undefined,
    totalSupply: formatTokenAmount(asset.totalSupply, asset.decimals ?? 0),
    id: asset.assetId,
    decimals: asset.decimals,
    assetType: asset.metadata?.assetType,
    assetSubType: asset.metadata?.assetSubType,
    isRegistered,
  });

  // Toggle sort for table headers
  const handleSort = (field: string) => {
    const sortFieldToUse = field as
      | 'name'
      | 'symbol'
      | 'balance'
      | 'totalSupply'
      | 'type';

    if (sortField === sortFieldToUse) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(sortFieldToUse);
      setSortDirection('asc');
    }
  };

  // Get unique asset types from all assets
  const getUniqueAssetTypes = (assets: AssetDetails[]) => {
    const types = new Set<string>();
    assets.forEach((asset) => {
      if (asset.metadata?.assetType) {
        types.add(asset.metadata.assetType);
      } else {
        types.add('No Type');
      }
    });
    return Array.from(types).sort();
  };

  // Filter and sort registered assets
  const filteredAndSortedRegisteredAssets = useMemo(() => {
    let filtered = [...registeredAssets];

    // Hide zero balances filter
    if (hideZeroBalances) {
      filtered = filtered.filter((asset) => {
        const balance = asset.balance || '0';
        return balance !== '0' && balance !== '';
      });
    }

    // Asset type filter
    if (assetTypeFilter.length > 0) {
      filtered = filtered.filter((asset) =>
        asset.metadata?.assetType
          ? assetTypeFilter.includes(asset.metadata.assetType)
          : assetTypeFilter.includes('No Type'),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'symbol':
          comparison = (a.symbol || '').localeCompare(b.symbol || '');
          break;
        case 'balance': {
          const balanceA = parseFloat(a.balance || '0');
          const balanceB = parseFloat(b.balance || '0');
          comparison = balanceA - balanceB;
          break;
        }
        case 'type': {
          const typeA = a.metadata?.assetType || '';
          const typeB = b.metadata?.assetType || '';
          comparison = typeA.localeCompare(typeB);
          break;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    registeredAssets,
    hideZeroBalances,
    assetTypeFilter,
    sortField,
    sortDirection,
  ]);

  // Filter and sort owned assets
  const filteredAndSortedOwnedAssets = useMemo(() => {
    let filtered = [...ownedAssets];

    // Asset type filter
    if (assetTypeFilter.length > 0) {
      filtered = filtered.filter((asset) =>
        asset.metadata?.assetType
          ? assetTypeFilter.includes(asset.metadata.assetType)
          : assetTypeFilter.includes('No Type'),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'symbol':
          comparison = (a.symbol || '').localeCompare(b.symbol || '');
          break;
        case 'balance': {
          const balanceA = parseFloat(a.balance || '0');
          const balanceB = parseFloat(b.balance || '0');
          comparison = balanceA - balanceB;
          break;
        }
        case 'totalSupply': {
          const supplyA = parseFloat(a.totalSupply || '0');
          const supplyB = parseFloat(b.totalSupply || '0');
          comparison = supplyA - supplyB;
          break;
        }
        case 'type': {
          const typeA = a.metadata?.assetType || '';
          const typeB = b.metadata?.assetType || '';
          comparison = typeA.localeCompare(typeB);
          break;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [ownedAssets, assetTypeFilter, sortField, sortDirection]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Confidential Assets</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Manage your held and created confidential assets
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setCreateModalOpened(true)}
          >
            Create Asset
          </Button>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="registered" leftSection={<IconCoin size={18} />}>
              Held Assets ({registeredAssets.length})
            </Tabs.Tab>
            <Tabs.Tab value="owned" leftSection={<IconBriefcase size={18} />}>
              Created Assets ({ownedAssets.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Held Assets Tab */}
          <Tabs.Panel value="registered" pt="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between" wrap="wrap">
                  <Group gap="xs">
                    <Text fw={500}>Held Assets</Text>
                    <Badge>{filteredAndSortedRegisteredAssets.length}</Badge>
                  </Group>
                  <Group gap="xs" wrap="wrap">
                    <SegmentedControl
                      value={viewMode}
                      onChange={(value) =>
                        setViewMode(value as 'grid' | 'list')
                      }
                      data={[
                        {
                          value: 'grid',
                          label: (
                            <Group gap={4}>
                              <IconLayoutGrid size={20} />
                            </Group>
                          ),
                        },
                        {
                          value: 'list',
                          label: (
                            <Group gap={4}>
                              <IconList size={20} />
                            </Group>
                          ),
                        },
                      ]}
                      visibleFrom="md"
                    />
                    <Tooltip label="Refresh">
                      <ActionIcon
                        variant="subtle"
                        onClick={refreshRegisteredAssets}
                        disabled={!selectedKey}
                      >
                        <IconRefresh size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Card.Section>

              {/* Filters and Actions */}
              {registeredAssets.length > 0 && (
                <Card.Section inheritPadding py="sm" withBorder>
                  <Group gap="sm" wrap="wrap">
                    {/* Filter Menu */}
                    <Menu shadow="md" width={300} position="bottom-start">
                      <Menu.Target>
                        <Button
                          variant="default"
                          leftSection={<IconFilter size={16} />}
                          rightSection={
                            (hideZeroBalances ||
                              assetTypeFilter.length > 0) && (
                              <Badge size="sm" circle>
                                {(hideZeroBalances ? 1 : 0) +
                                  assetTypeFilter.length}
                              </Badge>
                            )
                          }
                        >
                          Filters
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Filter Options</Menu.Label>
                        <Menu.Item
                          closeMenuOnClick={false}
                          leftSection={
                            <Checkbox
                              radius="sm"
                              size="xs"
                              checked={hideZeroBalances}
                              onChange={() =>
                                setHideZeroBalances(!hideZeroBalances)
                              }
                              tabIndex={-1}
                            />
                          }
                        >
                          Hide Zero Balances
                        </Menu.Item>
                        <Divider my="xs" />
                        <Menu.Label>Asset Type</Menu.Label>
                        {getUniqueAssetTypes(registeredAssets).map((type) => (
                          <Menu.Item
                            key={type}
                            closeMenuOnClick={false}
                            leftSection={
                              <Checkbox
                                radius="sm"
                                size="xs"
                                checked={assetTypeFilter.includes(type)}
                                onChange={() => {
                                  setAssetTypeFilter((prev) =>
                                    prev.includes(type)
                                      ? prev.filter((t) => t !== type)
                                      : [...prev, type],
                                  );
                                }}
                                tabIndex={-1}
                              />
                            }
                          >
                            {type}
                          </Menu.Item>
                        ))}
                        {getUniqueAssetTypes(registeredAssets).length === 0 && (
                          <Menu.Item disabled>No types available</Menu.Item>
                        )}
                        {(hideZeroBalances || assetTypeFilter.length > 0) && (
                          <>
                            <Divider my="xs" />
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={16} />}
                              onClick={() => {
                                setHideZeroBalances(false);
                                setAssetTypeFilter([]);
                              }}
                            >
                              Clear all filters
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>

                    {/* Sort controls for cards view only */}
                    {viewMode === 'grid' && (
                      <>
                        <Text size="sm" c="dimmed">
                          Sort by:
                        </Text>
                        <Select
                          data={[
                            { value: 'name', label: 'Name' },
                            { value: 'symbol', label: 'Symbol' },
                            { value: 'balance', label: 'Balance' },
                            { value: 'type', label: 'Type' },
                          ]}
                          value={sortField}
                          onChange={(value) =>
                            setSortField(
                              value as 'name' | 'symbol' | 'balance' | 'type',
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

                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setRegisterByIdModalOpened(true)}
                      disabled={!selectedKey}
                    >
                      Register for Asset
                    </Button>
                  </Group>
                </Card.Section>
              )}

              <Card.Section inheritPadding py="md">
                <LoadingOverlay visible={isLoading} />

                {!selectedKey ? (
                  <Card withBorder p="xl">
                    <Stack align="center" gap="md">
                      <IconAlertCircle size={48} stroke={1.5} opacity={0.3} />
                      <div>
                        <Text ta="center" fw={500}>
                          No confidential account selected
                        </Text>
                        <Text ta="center" size="sm" c="dimmed">
                          Please select a confidential account to view held
                          assets
                        </Text>
                      </div>
                    </Stack>
                  </Card>
                ) : registeredAssets.length === 0 ? (
                  <Card withBorder p="xl">
                    <Stack align="center" gap="md">
                      <IconCoin size={48} stroke={1.5} opacity={0.3} />
                      <div>
                        <Text ta="center" fw={500}>
                          No held assets
                        </Text>
                        <Text ta="center" size="sm" c="dimmed">
                          Register with an asset to start receiving confidential
                          tokens
                        </Text>
                      </div>
                    </Stack>
                  </Card>
                ) : filteredAndSortedRegisteredAssets.length === 0 ? (
                  <Card withBorder p="xl">
                    <Stack align="center" gap="md">
                      <IconFilter size={48} stroke={1.5} opacity={0.3} />
                      <div>
                        <Text ta="center" fw={500}>
                          No assets match your filters
                        </Text>
                        <Text ta="center" size="sm" c="dimmed">
                          Try adjusting your filter settings
                        </Text>
                      </div>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setHideZeroBalances(false);
                          setAssetTypeFilter([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                  </Card>
                ) : (
                  (() => {
                    const displayAssets = filteredAndSortedRegisteredAssets.map(
                      (a) => mapAssetForDisplay(a, true),
                    );

                    if (viewMode === 'list') {
                      return (
                        <AssetTable
                          assets={displayAssets}
                          onViewDetails={(a) => {
                            handleViewDetails(a.id);
                          }}
                          showRegisteredStatus={false}
                          showActionsColumn={false}
                          onSort={handleSort}
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      );
                    }

                    return (
                      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                        {displayAssets.map((asset) => {
                          return (
                            <AssetCard
                              key={asset.id}
                              asset={asset}
                              onViewDetails={() => {
                                handleViewDetails(asset.id);
                              }}
                              showRegisteredBadge={false}
                            />
                          );
                        })}
                      </SimpleGrid>
                    );
                  })()
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>

          {/* Created Assets Tab */}
          <Tabs.Panel value="owned" pt="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between" wrap="wrap">
                  <Group gap="xs">
                    <Text fw={500}>Created Assets</Text>
                    <Badge>{filteredAndSortedOwnedAssets.length}</Badge>
                  </Group>
                  <Group gap="xs" wrap="wrap">
                    <SegmentedControl
                      value={viewMode}
                      onChange={(value) =>
                        setViewMode(value as 'grid' | 'list')
                      }
                      data={[
                        {
                          value: 'grid',
                          label: (
                            <Group gap={4}>
                              <IconLayoutGrid size={20} />
                            </Group>
                          ),
                        },
                        {
                          value: 'list',
                          label: (
                            <Group gap={4}>
                              <IconList size={20} />
                            </Group>
                          ),
                        },
                      ]}
                      visibleFrom="md"
                    />
                    <Tooltip label="Refresh">
                      <ActionIcon variant="subtle" onClick={refreshOwnedAssets}>
                        <IconRefresh size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Card.Section>

              {/* Filters */}
              {ownedAssets.length > 0 && (
                <Card.Section inheritPadding py="sm" withBorder>
                  <Group gap="sm" wrap="wrap">
                    {/* Filter Menu */}
                    <Menu shadow="md" width={300} position="bottom-start">
                      <Menu.Target>
                        <Button
                          variant="default"
                          leftSection={<IconFilter size={16} />}
                          rightSection={
                            assetTypeFilter.length > 0 && (
                              <Badge size="sm" circle>
                                {assetTypeFilter.length}
                              </Badge>
                            )
                          }
                        >
                          Filters
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Asset Type</Menu.Label>
                        {getUniqueAssetTypes(ownedAssets).map((type) => (
                          <Menu.Item
                            key={type}
                            closeMenuOnClick={false}
                            leftSection={
                              <Checkbox
                                radius="sm"
                                size="xs"
                                checked={assetTypeFilter.includes(type)}
                                onChange={() => {
                                  setAssetTypeFilter((prev) =>
                                    prev.includes(type)
                                      ? prev.filter((t) => t !== type)
                                      : [...prev, type],
                                  );
                                }}
                                tabIndex={-1}
                              />
                            }
                          >
                            {type}
                          </Menu.Item>
                        ))}
                        {getUniqueAssetTypes(ownedAssets).length === 0 && (
                          <Menu.Item disabled>No types available</Menu.Item>
                        )}
                        {assetTypeFilter.length > 0 && (
                          <>
                            <Divider my="xs" />
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={16} />}
                              onClick={() => {
                                setAssetTypeFilter([]);
                              }}
                            >
                              Clear all filters
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>

                    {/* Sort controls for cards view only */}
                    {viewMode === 'grid' && (
                      <>
                        <Text size="sm" c="dimmed">
                          Sort by:
                        </Text>
                        <Select
                          data={[
                            { value: 'name', label: 'Name' },
                            { value: 'symbol', label: 'Symbol' },
                            { value: 'totalSupply', label: 'Total Supply' },
                            { value: 'type', label: 'Type' },
                          ]}
                          value={sortField}
                          onChange={(value) =>
                            setSortField(
                              value as
                                | 'name'
                                | 'symbol'
                                | 'totalSupply'
                                | 'type',
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

                {ownedAssets.length === 0 ? (
                  <Stack align="center" py={40}>
                    <IconBriefcase size={48} stroke={1.5} opacity={0.3} />
                    <div>
                      <Text ta="center" fw={500}>
                        No assets created yet
                      </Text>
                      <Text ta="center" size="sm" c="dimmed">
                        Create your first confidential asset to get started
                      </Text>
                    </div>
                    <Button
                      leftSection={<IconPlus size={18} />}
                      onClick={() => setCreateModalOpened(true)}
                    >
                      Create Asset
                    </Button>
                  </Stack>
                ) : filteredAndSortedOwnedAssets.length === 0 ? (
                  <Card withBorder p="xl">
                    <Stack align="center" gap="md">
                      <IconFilter size={48} stroke={1.5} opacity={0.3} />
                      <div>
                        <Text ta="center" fw={500}>
                          No assets match your filters
                        </Text>
                        <Text ta="center" size="sm" c="dimmed">
                          Try adjusting your filter settings
                        </Text>
                      </div>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setAssetTypeFilter([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                  </Card>
                ) : (
                  (() => {
                    // Check which owned assets are also registered
                    const registeredAssetIds = new Set(
                      registeredAssets.map((a) => a.assetId),
                    );

                    const displayAssets = filteredAndSortedOwnedAssets.map(
                      (a) =>
                        mapAssetForDisplay(
                          a,
                          registeredAssetIds.has(a.assetId),
                        ),
                    );

                    const getAssetActions = (asset: DisplayAsset) => {
                      const actions = [];

                      // Only show Register if not registered
                      if (!asset.isRegistered) {
                        actions.push({
                          label: 'Register',
                          icon: <IconPlus size={16} />,
                          onClick: () => {
                            setSelectedAssetForRegistration({
                              assetId: asset.id,
                              assetName: asset.name,
                            });
                            setRegisterModalOpened(true);
                          },
                        });
                      }

                      // Only show Mint if registered
                      if (asset.isRegistered) {
                        actions.push({
                          label: 'Mint',
                          icon: <IconCoins size={16} />,
                          onClick: () => {
                            setSelectedAssetForMinting({
                              assetId: asset.id,
                              assetName: asset.name,
                              decimals: asset.decimals,
                            });
                            setMintModalOpened(true);
                          },
                        });
                      }

                      return actions;
                    };

                    if (viewMode === 'list') {
                      return (
                        <AssetTable
                          assets={displayAssets}
                          onViewDetails={(a) => {
                            handleViewDetails(a.id);
                          }}
                          showRegisteredStatus={false}
                          getActions={getAssetActions}
                          showTotalSupply={true}
                          onSort={handleSort}
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      );
                    }

                    const getCardActions = (asset: DisplayAsset) => {
                      const actions = [];

                      // Only show Register if not registered
                      if (!asset.isRegistered) {
                        actions.push({
                          label: 'Register',
                          icon: <IconPlus size={14} />,
                          onClick: () => {
                            setSelectedAssetForRegistration({
                              assetId: asset.id,
                              assetName: asset.name,
                            });
                            setRegisterModalOpened(true);
                          },
                          variant: 'light' as const,
                        });
                      }

                      // Only show Mint if registered
                      if (asset.isRegistered) {
                        actions.push({
                          label: 'Mint',
                          icon: <IconCoins size={14} />,
                          onClick: () => {
                            setSelectedAssetForMinting({
                              assetId: asset.id,
                              assetName: asset.name,
                              decimals: asset.decimals,
                            });
                            setMintModalOpened(true);
                          },
                          variant: 'light' as const,
                        });
                      }

                      return actions;
                    };

                    return (
                      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                        {displayAssets.map((asset) => {
                          return (
                            <AssetCard
                              key={asset.id}
                              asset={asset}
                              onViewDetails={() => {
                                handleViewDetails(asset.id);
                              }}
                              actions={getCardActions(asset)}
                            />
                          );
                        })}
                      </SimpleGrid>
                    );
                  })()
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Details Drawer */}
      <AssetDetailsDrawer
        opened={detailsDrawerOpened}
        onClose={() => setDetailsDrawerOpened(false)}
        assetId={selectedAssetId}
      />

      {/* Create Asset Modal */}
      <CreateAssetModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />

      {/* Register Asset Modal */}
      <RegisterAssetModal
        opened={registerModalOpened && !!selectedAssetForRegistration}
        onClose={() => {
          setRegisterModalOpened(false);
          setSelectedAssetForRegistration(null);
        }}
        assetId={selectedAssetForRegistration?.assetId || ''}
        assetName={selectedAssetForRegistration?.assetName}
      />
      {/* Register by Asset ID Modal */}
      <RegisterByAssetIdModal
        opened={registerByIdModalOpened}
        onClose={() => setRegisterByIdModalOpened(false)}
      />
      {/* Mint Asset Modal */}
      <MintAssetModal
        opened={mintModalOpened && !!selectedAssetForMinting}
        onClose={() => {
          setMintModalOpened(false);
          setSelectedAssetForMinting(null);
        }}
        assetId={selectedAssetForMinting?.assetId || ''}
        assetName={selectedAssetForMinting?.assetName}
        decimals={selectedAssetForMinting?.decimals}
      />
    </Container>
  );
}
