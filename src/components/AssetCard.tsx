import type { DisplayAsset } from '@/types/asset';
import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCoin } from '@tabler/icons-react';
import React from 'react';
import classes from './AssetCard.module.css';

interface AssetCardAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'filled' | 'light' | 'outline' | 'default';
  color?: string;
}

interface AssetCardProps {
  asset: DisplayAsset;
  onViewDetails: () => void;
  hideBalances?: boolean;
  showRegisteredBadge?: boolean;
  actions?: AssetCardAction[];
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onViewDetails,
  hideBalances = false,
  showRegisteredBadge = true,
  actions = [],
}) => {
  const {
    name,
    symbol,
    balance,
    id,
    isRegistered,
    assetType,
    assetSubType,
    totalSupply,
  } = asset;

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      onClick={onViewDetails}
      className={classes.assetCard}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="xs">
            <ThemeIcon size="lg" radius="md" variant="light" color="brand">
              <IconCoin size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg" lineClamp={1} title={name}>
                {name}
              </Text>
              {(assetType || assetSubType) && (
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {[assetType, assetSubType].filter(Boolean).join(' • ')}
                </Text>
              )}
            </div>
          </Group>
          {showRegisteredBadge && isRegistered && (
            <Badge variant="dot" color="green" size="sm">
              Registered
            </Badge>
          )}
        </Group>

        <Group justify="space-between" mt="xs">
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Asset ID
            </Text>
            <Text size="sm" fw={500}>
              {id}
            </Text>
          </div>
          {(balance || totalSupply) && (
            <div style={{ textAlign: 'right' }}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {balance ? 'Balance' : 'Total Supply'}
              </Text>
              <Group gap={4} justify="flex-end">
                <Text size="lg" fw={700} c="brand">
                  {balance ? (hideBalances ? '••••••' : balance) : totalSupply}
                </Text>
                <Text size="sm" c="dimmed" fw={500}>
                  {symbol}
                </Text>
              </Group>
            </div>
          )}
        </Group>
      </Stack>

      {actions.length > 0 && (
        <Group gap="xs" mt="md">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'light'}
              color={action.color}
              size="xs"
              leftSection={action.icon}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              style={{ flex: 1 }}
            >
              {action.label}
            </Button>
          ))}
        </Group>
      )}
    </Paper>
  );
};
