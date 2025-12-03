/**
 * Asset Management Page
 *
 * Main page for creating, viewing, and managing confidential assets
 */

import {
  CreateAssetModal,
  MintAssetModal,
  RegisterAssetModal,
  RegisterByAssetIdModal,
  TruncatedWithCopy,
} from '@/components';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import type { AssetMetadata } from '@/types/asset';
import { formatTokenAmount } from '@/utils/formatNumber';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCoin,
  IconPlus,
  IconRefresh,
  IconUserPlus,
} from '@tabler/icons-react';
import { useState } from 'react';

// Helper to render metadata key-value pairs
function MetadataDisplay({ metadata }: { metadata: AssetMetadata }) {
  // Filter out standard fields that are displayed separately
  const standardFields = [
    'name',
    'symbol',
    'assetType',
    'assetSubType',
    'description',
    'decimals',
  ];
  const customFields = Object.entries(metadata).filter(
    ([key]) => !standardFields.includes(key),
  );

  if (customFields.length === 0) return null;

  return (
    <>
      <Divider />
      <div>
        <Text size="xs" fw={500} c="dimmed" mb={4}>
          Additional Details:
        </Text>
        <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
          {customFields.map(([key, value]) => (
            <div key={key}>
              <Text size="xs" c="dimmed" tt="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <Text size="sm" style={{ wordBreak: 'break-word' }}>
                {String(value)}
              </Text>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
}

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
  const [activeTab, setActiveTab] = useState<string | null>('owned');
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [registerModalOpened, setRegisterModalOpened] = useState(false);
  const [registerByIdModalOpened, setRegisterByIdModalOpened] = useState(false);
  const [mintModalOpened, setMintModalOpened] = useState(false);
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
  const [hideZeroBalances, setHideZeroBalances] = useState(false);

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Confidential Assets</Title>
            <Text c="dimmed" size="sm">
              Create and manage your confidential assets
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
            <Tabs.Tab value="owned" leftSection={<IconCircleCheck size={18} />}>
              My Assets ({ownedAssets.length})
            </Tabs.Tab>
            <Tabs.Tab value="registered" leftSection={<IconCoin size={18} />}>
              Registered Assets ({registeredAssets.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* My Assets Tab */}
          <Tabs.Panel value="owned" pt="lg">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isLoading} zIndex={100} />

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Assets you've created
                </Text>
                <Tooltip label="Refresh">
                  <ActionIcon variant="subtle" onClick={refreshOwnedAssets}>
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              {ownedAssets.length === 0 ? (
                <Card withBorder p="xl">
                  <Stack align="center" gap="md">
                    <IconCircleCheck size={48} stroke={1.5} opacity={0.3} />
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
                </Card>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  {ownedAssets.map((asset) => (
                    <Card key={asset.assetId} withBorder padding="lg">
                      <Stack gap="md">
                        <div>
                          <Group justify="space-between" mb="xs">
                            <Text fw={600} size="lg">
                              {asset.name || `Asset ${asset.assetId}`}
                            </Text>
                            {asset.metadata?.template && (
                              <Badge variant="light" size="sm">
                                {asset.metadata.template}
                              </Badge>
                            )}
                          </Group>

                          <Group gap="xs" mb="xs">
                            {asset.symbol && (
                              <Badge variant="outline" color="gray" size="sm">
                                {asset.symbol}
                              </Badge>
                            )}
                            {asset.metadata?.assetType && (
                              <Badge variant="dot" size="sm">
                                {asset.metadata.assetType}
                              </Badge>
                            )}
                            {asset.metadata?.assetSubType && (
                              <Badge variant="dot" color="blue" size="sm">
                                {asset.metadata.assetSubType}
                              </Badge>
                            )}
                          </Group>

                          {asset.metadata?.description && (
                            <Text size="sm" c="dimmed" lineClamp={2}>
                              {asset.metadata.description}
                            </Text>
                          )}
                        </div>

                        <Group gap="xs">
                          <Text
                            size="xs"
                            c="dimmed"
                            style={{ fontFamily: 'monospace' }}
                          >
                            ID: {asset.assetId}
                          </Text>
                        </Group>

                        <div>
                          <Text size="xs" c="dimmed" mb={4}>
                            Total Supply
                          </Text>
                          <Text
                            size="lg"
                            fw={600}
                            style={{ fontFamily: 'monospace' }}
                          >
                            {formatTokenAmount(
                              asset.totalSupply,
                              asset.decimals ?? 0,
                            )}
                          </Text>
                        </div>

                        <div>
                          <Text size="xs" c="dimmed" mb={4}>
                            Decimals
                          </Text>
                          <Text
                            size="sm"
                            fw={500}
                            style={{ fontFamily: 'monospace' }}
                          >
                            {asset.decimals ?? 0}
                          </Text>
                        </div>

                        {asset.auditors && asset.auditors.length > 0 && (
                          <>
                            <Divider />
                            <div>
                              <Text size="xs" fw={500} c="dimmed" mb={4}>
                                Auditors ({asset.auditors.length}):
                              </Text>
                              <Stack gap={4}>
                                {asset.auditors.map((auditor, idx) => (
                                  <TruncatedWithCopy
                                    key={idx}
                                    value={auditor}
                                  />
                                ))}
                              </Stack>
                            </div>
                          </>
                        )}

                        {asset.mediators && asset.mediators.length > 0 && (
                          <>
                            <Divider />
                            <div>
                              <Text size="xs" fw={500} c="dimmed" mb={4}>
                                Mediators ({asset.mediators.length}):
                              </Text>
                              <Stack gap={4}>
                                {asset.mediators.map((mediator, idx) => (
                                  <TruncatedWithCopy
                                    key={idx}
                                    value={mediator}
                                  />
                                ))}
                              </Stack>
                            </div>
                          </>
                        )}

                        {asset.metadata && (
                          <MetadataDisplay metadata={asset.metadata} />
                        )}

                        <Divider />

                        <Group gap="xs">
                          {/* Check if this asset is in registered assets (already registered) */}
                          {!registeredAssets.find(
                            (h) => h.assetId === asset.assetId,
                          ) ? (
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconUserPlus size={14} />}
                              onClick={() => {
                                setSelectedAssetForRegistration({
                                  assetId: asset.assetId,
                                  assetName:
                                  asset.name ||
                                    `Asset ${asset.assetId}`,
                                });
                                setRegisterModalOpened(true);
                              }}
                              disabled={!selectedKey}
                            >
                              Register
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconCoin size={14} />}
                              onClick={() => {
                                setSelectedAssetForMinting({
                                  assetId: asset.assetId,
                                  assetName:
                                  asset.name ||
                                  `Asset ${asset.assetId}`,
                                decimals: asset.decimals,
                                });
                                setMintModalOpened(true);
                              }}
                            >
                              Mint
                            </Button>
                          )}
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Tabs.Panel>

          {/* Registered Assets Tab */}
          <Tabs.Panel value="registered" pt="lg">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isLoading} zIndex={100} />

              <Group justify="space-between">
                <Group gap="md">
                  <Text size="sm" c="dimmed">
                    Assets you're registered with
                  </Text>
                  <Button
                    size="xs"
                    variant={hideZeroBalances ? 'filled' : 'light'}
                    onClick={() => setHideZeroBalances(!hideZeroBalances)}
                    disabled={!selectedKey}
                  >
                    {hideZeroBalances
                      ? 'Show Zero Balances'
                      : 'Hide Zero Balances'}
                  </Button>
                </Group>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconPlus size={14} />}
                    onClick={() => setRegisterByIdModalOpened(true)}
                    disabled={!selectedKey}
                  >
                    Register for Asset
                  </Button>
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

              {!selectedKey ? (
                <Card withBorder p="xl">
                  <Stack align="center" gap="md">
                    <IconAlertCircle size={48} stroke={1.5} opacity={0.3} />
                    <div>
                      <Text ta="center" fw={500}>
                        No confidential key selected
                      </Text>
                      <Text ta="center" size="sm" c="dimmed">
                        Please select a confidential key to view registered
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
                        No registered assets
                      </Text>
                      <Text ta="center" size="sm" c="dimmed">
                        Register with an asset to start receiving confidential
                        tokens
                      </Text>
                    </div>
                  </Stack>
                </Card>
              ) : (
                (() => {
                  // Filter assets based on hideZeroBalances setting
                  const filteredAssets = hideZeroBalances
                    ? registeredAssets.filter((asset) => {
                        const balance = asset.balance || '0';
                        return balance !== '0' && balance !== '';
                      })
                    : registeredAssets;

                  if (filteredAssets.length === 0) {
                    return (
                      <Card withBorder p="xl">
                        <Stack align="center" gap="md">
                          <IconCoin size={48} stroke={1.5} opacity={0.3} />
                          <div>
                            <Text ta="center" fw={500}>
                              No assets with balance
                            </Text>
                            <Text ta="center" size="sm" c="dimmed">
                              All registered assets have zero balance
                            </Text>
                          </div>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => setHideZeroBalances(false)}
                          >
                            Show All Registered Assets
                          </Button>
                        </Stack>
                      </Card>
                    );
                  }

                  return (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                      {filteredAssets.map((asset) => (
                        <Card key={asset.assetId} withBorder padding="lg">
                          <Stack gap="md">
                            <div>
                              <Group justify="space-between" mb="xs">
                                <Text fw={600} size="lg">
                                  {asset.name || 'Unknown Asset'}
                                </Text>
                                <Badge color="green" variant="light" size="sm">
                                  Registered
                                </Badge>
                              </Group>
                              {asset.symbol && (
                                <Text size="sm" c="dimmed" mb="xs">
                                  {asset.symbol}
                                </Text>
                              )}
                              {asset.metadata?.description && (
                                <Text size="sm" c="dimmed">
                                  {asset.metadata.description}
                                </Text>
                              )}
                            </div>

                            <Group gap="xs">
                              <Text
                                size="xs"
                                c="dimmed"
                                style={{ fontFamily: 'monospace' }}
                              >
                                ID: {asset.assetId}
                              </Text>
                            </Group>

                            {asset.totalSupply !== undefined && (
                              <div>
                                <Text size="xs" c="dimmed" mb={4}>
                                  Total Supply
                                </Text>
                                <Text
                                  size="lg"
                                  fw={600}
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {formatTokenAmount(
                                    asset.totalSupply,
                                    asset.decimals ?? 0,
                                  )}
                                </Text>
                              </div>
                            )}

                            {asset.balance !== undefined && (
                              <div>
                                <Text size="xs" c="dimmed" mb={4}>
                                  Balance
                                </Text>
                                <Text
                                  size="lg"
                                  fw={600}
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {formatTokenAmount(
                                    asset.balance,
                                    asset.decimals ?? 0,
                                  )}
                                </Text>
                              </div>
                            )}

                            <div>
                              <Text size="xs" c="dimmed" mb={4}>
                                Decimals
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                style={{ fontFamily: 'monospace' }}
                              >
                                {asset.decimals ?? 0}
                              </Text>
                            </div>

                            {asset.ownerDid && (
                              <>
                                <Divider />
                                <div>
                                  <Text size="xs" fw={500} c="dimmed" mb={4}>
                                    Owner:
                                  </Text>
                                  <TruncatedWithCopy value={asset.ownerDid} />
                                </div>
                              </>
                            )}

                            {asset.auditors && asset.auditors.length > 0 && (
                              <>
                                <Divider />
                                <div>
                                  <Text size="xs" fw={500} c="dimmed" mb={4}>
                                    Auditors ({asset.auditors.length}):
                                  </Text>
                                  <Stack gap={4}>
                                    {asset.auditors.map((auditor, idx) => (
                                      <TruncatedWithCopy
                                        key={idx}
                                        value={auditor}
                                      />
                                    ))}
                                  </Stack>
                                </div>
                              </>
                            )}

                            {asset.mediators && asset.mediators.length > 0 && (
                              <>
                                <Divider />
                                <div>
                                  <Text size="xs" fw={500} c="dimmed" mb={4}>
                                    Mediators ({asset.mediators.length}):
                                  </Text>
                                  <Stack gap={4}>
                                    {asset.mediators.map((mediator, idx) => (
                                      <TruncatedWithCopy
                                        key={idx}
                                        value={mediator}
                                      />
                                    ))}
                                  </Stack>
                                </div>
                              </>
                            )}

                            {asset.metadata && (
                              <MetadataDisplay metadata={asset.metadata} />
                            )}
                          </Stack>
                        </Card>
                      ))}
                    </SimpleGrid>
                  );
                })()
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

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
