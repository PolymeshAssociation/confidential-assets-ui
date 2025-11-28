import type { ConfidentialKey } from '@/context/confidential-key/types';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';

interface RenameKeyModalProps {
  keyToRename: ConfidentialKey;
  onRename: (newAlias: string) => Promise<void>;
  onCancel: () => void;
  onError: (message: string) => void;
}

export function RenameKeyModal({
  keyToRename,
  onRename,
  onCancel,
  onError,
}: RenameKeyModalProps) {
  const handleRename = async () => {
    const input = document.getElementById('rename-input') as HTMLInputElement;
    const newAlias = input?.value?.trim();

    if (!newAlias) {
      onError('Please provide a new alias');
      return;
    }

    await onRename(newAlias);
  };

  return (
    <Stack gap="md">
      <Text size="sm">Enter a new alias for the key "{keyToRename.alias}"</Text>
      <TextInput
        id="rename-input"
        label="New Alias"
        placeholder="New Key Name"
        defaultValue={keyToRename.alias}
        data-autofocus
        maxLength={50}
      />
      <Group justify="flex-end" gap="sm">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleRename}>Rename</Button>
      </Group>
    </Stack>
  );
}
