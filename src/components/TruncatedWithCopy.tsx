import type { MantineSize } from '@mantine/core';
import { ActionIcon, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface TruncatedWithCopyProps {
  value: string;
  label?: string;
  prefixLength?: number;
  suffixLength?: number;
  size?: MantineSize | (string & {}) | number;
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

const ICON_SIZES: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

function getIconSize(size: MantineSize | (string & {}) | number): number {
  if (typeof size === 'number') {
    return Math.max(10, Math.floor(size * 1.2));
  }

  if (typeof size === 'string' && size in ICON_SIZES) {
    return ICON_SIZES[size];
  }

  return 14; // Default fallback
}

export function TruncatedWithCopy({
  value,
  label,
  prefixLength = value.startsWith('0x') ? 8 : 6,
  suffixLength = 6,
  size = 'xs',
}: TruncatedWithCopyProps) {
  const truncated = formatValue(value, prefixLength, suffixLength);
  const iconSize = getIconSize(size);

  const textProps =
    typeof size === 'number'
      ? { style: { fontSize: size, fontFamily: 'monospace' } }
      : { size: size as MantineSize, style: { fontFamily: 'monospace' } };

  const labelProps =
    typeof size === 'number'
      ? { style: { fontSize: size } }
      : { size: size as MantineSize };

  return (
    <Group gap="xs" wrap="nowrap">
      {label && (
        <Text c="dimmed" {...labelProps}>
          {label}:
        </Text>
      )}
      <Text c="dis" {...textProps}>
        {truncated}
      </Text>
      <CopyButton value={value} timeout={1000}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy'}>
            <ActionIcon
              size={iconSize}
              variant="subtle"
              color={copied ? 'teal' : 'gray'}
              onClick={(event) => {
                event.stopPropagation();
                copy();
              }}
            >
              {copied ? (
                <IconCheck size={iconSize} />
              ) : (
                <IconCopy size={iconSize} />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}
