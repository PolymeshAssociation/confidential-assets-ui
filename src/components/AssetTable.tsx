import type { DisplayAsset } from '@/types/asset';
import { ActionIcon, Badge, Group, Table, Text, Tooltip } from '@mantine/core';
import React from 'react';

interface AssetAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface AssetTableProps {
  assets: Array<DisplayAsset>;
  onViewDetails: (asset: DisplayAsset) => void;
  hideBalances?: boolean;
  showRegisteredStatus?: boolean;
  getActions?: (asset: DisplayAsset) => AssetAction[];
  showActionsColumn?: boolean;
  showTotalSupply?: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onViewDetails,
  hideBalances = false,
  showRegisteredStatus = true,
  getActions,
  showActionsColumn = true,
  showTotalSupply = false,
  onSort,
  sortField,
  sortDirection,
}) => {
  const renderSortableHeader = (field: string, label: string) => (
    <Table.Th
      style={onSort ? { cursor: 'pointer', userSelect: 'none' } : undefined}
      onClick={() => onSort?.(field)}
    >
      <Group gap={4} wrap="nowrap">
        {label}
        {onSort && sortField === field && (
          <Text size="xs">{sortDirection === 'asc' ? '↑' : '↓'}</Text>
        )}
      </Group>
    </Table.Th>
  );

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            {renderSortableHeader('name', 'Name')}
            {renderSortableHeader('symbol', 'Symbol')}
            {renderSortableHeader('type', 'Type')}
            {renderSortableHeader(
              showTotalSupply ? 'totalSupply' : 'balance',
              showTotalSupply ? 'Total Supply' : 'Balance',
            )}
            <Table.Th>ID</Table.Th>
            {showRegisteredStatus && <Table.Th>Status</Table.Th>}
            {showActionsColumn && (
              <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {assets.map((asset) => {
            const actions = getActions?.(asset) || [];

            return (
              <Table.Tr
                key={asset.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewDetails(asset)}
              >
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {asset.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {asset.symbol}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    {[asset.assetType, asset.assetSubType]
                      .filter(Boolean)
                      .join(' • ') || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {showTotalSupply ? (
                    <Text size="sm" fw={600}>
                      {asset.totalSupply || '0'}
                    </Text>
                  ) : asset.balance ? (
                    <Text size="sm" fw={600}>
                      {hideBalances ? '••••••' : asset.balance}
                    </Text>
                  ) : (
                    <Text size="sm" c="dimmed">
                      -
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{asset.id}</Text>
                </Table.Td>
                {showRegisteredStatus && (
                  <Table.Td>
                    {asset.isRegistered && (
                      <Badge variant="dot" color="green" size="sm">
                        Registered
                      </Badge>
                    )}
                  </Table.Td>
                )}
                {showActionsColumn && actions.length > 0 && (
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      {actions.map((action) => (
                        <Tooltip key={action.label} label={action.label}>
                          <ActionIcon
                            variant="light"
                            color={action.color}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick();
                            }}
                          >
                            {action.icon}
                          </ActionIcon>
                        </Tooltip>
                      ))}
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
