import { useModal } from '@/hooks/useModal';
import { usePolymesh } from '@/hooks/usePolymesh';
import { Button, Group, Loader, Stack, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Polkicon } from '@w3ux/react-polkicon';

export function SigningKeySelectionButton() {
  const { selectedAccount, accountBalance, isAccountLoading } = usePolymesh();
  const { openKeySelectionModal } = useModal();

  return (
    <>
      {!selectedAccount ? (
        <Button
          onClick={openKeySelectionModal}
          variant="subtle"
          color="gray"
          p="xs"
          styles={{
            root: { height: 'auto' },
          }}
        >
          Select a key
        </Button>
      ) : (
        <Button
          onClick={openKeySelectionModal}
          variant="subtle"
          color="gray"
          p="xs"
          styles={{
            root: { height: 'auto' },
          }}
        >
          <Group gap="xs" wrap="nowrap">
            <Stack gap={0} align="flex-end" visibleFrom="sm" maw={200} miw={0}>
              <Text
                size="xs"
                c="dimmed"
                fw={700}
                style={{ maxWidth: '100%' }}
                truncate="end"
              >
                {isAccountLoading ? (
                  <Loader size="xs" />
                ) : accountBalance ? (
                  `${accountBalance.free.toFormat(2)} POLYX`
                ) : (
                  '0.00 POLYX'
                )}
              </Text>
              <Text
                size="sm"
                fw={500}
                lh={1}
                style={{ maxWidth: '100%' }}
                truncate="end"
              >
                {selectedAccount.name ||
                  `${selectedAccount.address.substring(0, 6)}...${selectedAccount.address.slice(-4)}`}
              </Text>
            </Stack>
            <Polkicon
              address={selectedAccount.address}
              fontSize="32px"
              background="transparent"
            />
            <IconChevronDown size="1rem" style={{ opacity: 0.5 }} />
          </Group>
        </Button>
      )}
    </>
  );
}
