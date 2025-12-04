import { useAsset } from '@/hooks/useAsset';
import type { AssetDetails } from '@/types/asset';
import { formatTokenAmount } from '@/utils/formatNumber';
import {
  Divider,
  Drawer,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCoin } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { TruncatedWithCopy } from './TruncatedWithCopy';

interface AssetDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  assetId: string | null;
}

export const AssetDetailsDrawer: React.FC<AssetDetailsDrawerProps> = ({
  opened,
  onClose,
  assetId,
}) => {
  const { getAssetDetails } = useAsset();
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch asset details when drawer opens or assetId changes
  useEffect(() => {
    if (!opened || !assetId) {
      setAsset(null);
      return;
    }

    let cancelled = false;

    const fetchAsset = async () => {
      setIsLoading(true);
      try {
        const details = await getAssetDetails(assetId);
        if (!cancelled) {
          setAsset(details);
        }
      } catch (err) {
        console.error('[AssetDetailsDrawer] Failed to fetch asset:', err);
        if (!cancelled) {
          setAsset(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAsset();

    return () => {
      cancelled = true;
    };
  }, [opened, assetId, getAssetDetails]);
  // Format token amounts with proper decimals
  const formattedBalance = useMemo(
    () =>
      asset?.balance !== undefined
        ? formatTokenAmount(asset.balance, asset.decimals ?? 0)
        : undefined,
    [asset?.balance, asset?.decimals],
  );

  const formattedTotalSupply = useMemo(
    () =>
      asset ? formatTokenAmount(asset.totalSupply, asset.decimals ?? 0) : '0',
    [asset],
  );

  // Extract additional metadata fields (excluding standard asset properties)
  const additionalMetadata = useMemo(() => {
    if (!asset?.metadata) return null;

    const standardFields = ['assetType', 'assetSubType', 'description'];
    const entries = Object.entries(asset.metadata).filter(
      ([key]) => !standardFields.includes(key) && asset.metadata![key] != null,
    );

    return entries.length > 0 ? Object.fromEntries(entries) : null;
  }, [asset?.metadata]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        isLoading ? (
          'Loading...'
        ) : !asset ? (
          'Asset Not Found'
        ) : (
          <Group>
            <ThemeIcon
              size="lg"
              radius="md"
              variant="transparent"
              color="brand"
            >
              <IconCoin size={32} />
            </ThemeIcon>
            <div>
              <Title order={4}>{asset.name}</Title>
              <Text size="xs" c="dimmed">
                {asset.symbol}
              </Text>
            </div>
          </Group>
        )
      }
      padding="xl"
      size="lg"
      position="right"
    >
      {!isLoading && asset && (
        <Stack gap="xl">
          <Grid>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Asset ID
              </Text>
              <Text size="lg" fw={500}>
                {asset.assetId}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Supply
              </Text>
              <Text size="lg" fw={500}>
                {formattedTotalSupply}
              </Text>
            </Grid.Col>
            {asset.metadata?.assetType && (
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Asset Type
                </Text>
                <Text size="lg" fw={500}>
                  {asset.metadata.assetType}
                </Text>
              </Grid.Col>
            )}
            {asset.metadata?.assetSubType && (
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Asset Sub Type
                </Text>
                <Text size="lg" fw={500}>
                  {asset.metadata.assetSubType}
                </Text>
              </Grid.Col>
            )}
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Decimals
              </Text>
              <Text size="lg" fw={500}>
                {asset.decimals || '0'}
              </Text>
            </Grid.Col>
            {asset.metadata?.description && (
              <Grid.Col span={12}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Description
                </Text>
                <Text size="sm" fw={500}>
                  {asset.metadata.description}
                </Text>
              </Grid.Col>
            )}
            {formattedBalance && (
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Your Balance
                </Text>
                <Text size="lg" fw={700} c="brand">
                  {formattedBalance}
                </Text>
              </Grid.Col>
            )}
          </Grid>

          <Divider />

          <div>
            <Text size="sm" fw={600} mb="xs">
              Parties
            </Text>
            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Owner
                </Text>
                <TruncatedWithCopy value={asset.ownerDid} />
              </Group>
              {asset.auditors && asset.auditors.length > 0 && (
                <>
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" c="dimmed">
                      Auditors ({asset.auditors.length})
                    </Text>
                    <Stack gap="xs" align="flex-end">
                      {asset.auditors.map((auditor, index) => (
                        <TruncatedWithCopy key={index} value={auditor} />
                      ))}
                    </Stack>
                  </Group>
                </>
              )}
              {asset.mediators && asset.mediators.length > 0 && (
                <>
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" c="dimmed">
                      Mediators ({asset.mediators.length})
                    </Text>
                    <Stack gap="xs" align="flex-end">
                      {asset.mediators.map((mediator, index) => (
                        <TruncatedWithCopy key={index} value={mediator} />
                      ))}
                    </Stack>
                  </Group>
                </>
              )}
            </Stack>
          </div>

          {additionalMetadata && (
            <>
              <Divider />
              <div>
                <Text size="sm" fw={600} mb="xs">
                  Additional Details
                </Text>
                <Grid>
                  {Object.entries(additionalMetadata).map(([key, value]) => (
                    <Grid.Col span={6} key={key}>
                      <Text size="xs" c="dimmed" tt="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text size="sm" style={{ wordBreak: 'break-word' }}>
                        {String(value)}
                      </Text>
                    </Grid.Col>
                  ))}
                </Grid>
              </div>
            </>
          )}
        </Stack>
      )}
    </Drawer>
  );
};
