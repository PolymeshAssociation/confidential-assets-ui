import {
  ActionIcon,
  Code,
  Collapse,
  Group,
  Text,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
} from '@tabler/icons-react';
import { useState } from 'react';

interface TruncatedKeyProps {
  value: string;
  label?: string;
  showCopy?: boolean;
}

/**
 * Component to display a truncated public key with expand/collapse and copy functionality
 */
export function TruncatedKey({
  value,
  label,
  showCopy = true,
}: TruncatedKeyProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    notifications.show({
      title: 'Copied!',
      message: `${label || 'Key'} copied to clipboard`,
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Truncate: show first 6 chars after 0x + ... + last 4 chars
  const getTruncated = () => {
    if (!value || value.length < 14) return value;
    if (value.startsWith('0x')) {
      return `${value.substring(0, 8)}...${value.substring(value.length - 4)}`;
    }
    return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
  };

  return (
    <div>
      <Group gap="xs" wrap="nowrap">
        {label && (
          <Text size="sm" fw={500} style={{ minWidth: '120px' }}>
            {label}:
          </Text>
        )}
        <Code style={{ flex: 1, overflow: 'hidden' }}>
          <Collapse in={!expanded}>
            <Text size="xs" truncate>
              {getTruncated()}
            </Text>
          </Collapse>
          <Collapse in={expanded}>
            <Text size="xs" style={{ wordBreak: 'break-all' }}>
              {value}
            </Text>
          </Collapse>
        </Code>
        <Tooltip label={expanded ? 'Collapse' : 'Expand'}>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleToggle}
            size="sm"
          >
            {expanded ? (
              <IconChevronUp size={16} />
            ) : (
              <IconChevronDown size={16} />
            )}
          </ActionIcon>
        </Tooltip>
        {showCopy && (
          <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'}>
            <ActionIcon
              variant="subtle"
              color={copied ? 'green' : 'gray'}
              onClick={handleCopy}
              size="sm"
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </div>
  );
}
