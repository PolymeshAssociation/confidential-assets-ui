import { ActionIcon, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface TruncatedWithCopyProps {
  value: string;
  label?: string;
  prefixLength?: number;
  suffixLength?: number;
}

function formatValue(
  value: string,
  prefixLength: number,
  suffixLength: number,
): string {
  if (!value) {
    return '';
  }

  if (value.length <= prefixLength + suffixLength + 3) {
    return value;
  }

  return `${value.substring(0, prefixLength)}...${value.substring(value.length - suffixLength)}`;
}

export function TruncatedWithCopy({
  value,
  label,
  prefixLength = value.startsWith('0x') ? 8 : 6,
  suffixLength = 6,
}: TruncatedWithCopyProps) {
  const truncated = formatValue(value, prefixLength, suffixLength);

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
              onClick={(event) => {
                event.stopPropagation();
                copy();
              }}
            >
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}
