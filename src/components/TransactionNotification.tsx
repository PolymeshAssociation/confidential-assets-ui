import { buildExplorerUrl } from '@/utils/explorerUtils';
import { Box, Button, Group, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { TruncatedWithCopy } from './TruncatedWithCopy';

interface TransactionNotificationProps {
  tag: string;
  txHash: string;
  blockNumber?: number;
  blockHash?: string;
  txIndex?: number;
}

export function TransactionNotification({
  tag,
  txHash,
  blockNumber,
  blockHash,
  txIndex,
  error,
}: TransactionNotificationProps & { error?: string }) {
  // Build explorer URL if possible
  const explorerUrl = buildExplorerUrl({
    blockNumber,
    blockHash,
    extrinsicHash: txHash,
    txIndex,
  });

  return (
    <Box>
      {/* Transaction tag/method */}
      <Text size="sm" fw={600} mb="xs">
        {tag}
      </Text>

      {/* Error Message */}
      {error && (
        <Text size="sm" c="red" mb="xs" lh={1.2}>
          {error}
        </Text>
      )}

      {/* Transaction hash with copy button */}
      <TruncatedWithCopy value={txHash} label="Hash" size="xs" />

      {/* Block number and explorer link */}
      <Group gap="md">
        {blockNumber !== undefined && (
          <Text size="xs" c="dimmed">
            Block #{blockNumber.toLocaleString()}
          </Text>
        )}

        {explorerUrl && (
          <Button
            component="a"
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
            variant="subtle"
            leftSection={<IconExternalLink size={14} />}
          >
            View on Explorer
          </Button>
        )}
      </Group>
    </Box>
  );
}
