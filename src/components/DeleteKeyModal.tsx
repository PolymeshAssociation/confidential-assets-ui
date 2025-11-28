import type { ConfidentialKey } from '@/context/confidential-key/types';
import { decryptKey } from '@/services/confidential/encryption';
import { getKey } from '@/services/storage/keyStorage';
import { Alert, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useState } from 'react';

interface DeleteKeyModalProps {
  keyToDelete: ConfidentialKey;
  onDelete: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteKeyModal({
  keyToDelete,
  onDelete,
  onCancel,
}: DeleteKeyModalProps) {
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const input = document.getElementById(
      'delete-password-input',
    ) as HTMLInputElement;
    const password = input?.value;

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsDeleting(true);

    try {
      // Get the stored key
      const storedKey = getKey(keyToDelete.publicKey);
      if (!storedKey) {
        throw new Error('Key not found');
      }

      // Verify password by attempting to decrypt
      await decryptKey(
        storedKey.private as import('@/types/storage').EncryptedConfidentialKeyRecord['private'],
        password,
      );

      // Password is correct, proceed with deletion
      await onDelete();
    } catch {
      setError('Incorrect password');
      setIsDeleting(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm">
        Are you sure you want to delete the key "{keyToDelete.alias}"? This
        action cannot be undone.
      </Text>
      <Alert color="yellow" icon={<IconDownload size={16} />}>
        We strongly recommend downloading a backup before deleting.
      </Alert>
      <TextInput
        id="delete-password-input"
        type="password"
        label="Enter password to confirm deletion"
        placeholder="Password"
        data-autofocus
        required
        error={error}
        onChange={() => setError('')}
      />
      <Group justify="flex-end" gap="sm">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" loading={isDeleting} onClick={handleDelete}>
          Delete
        </Button>
      </Group>
    </Stack>
  );
}
