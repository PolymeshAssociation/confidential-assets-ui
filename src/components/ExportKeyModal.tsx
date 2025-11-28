import type { ConfidentialKey } from '@/context/confidential-key/types';
import { decryptKey } from '@/services/confidential/encryption';
import { getKey } from '@/services/storage/keyStorage';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

interface ExportKeyModalProps {
  keyToExport: ConfidentialKey;
  exportKey: (publicKey: string) => string;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export function ExportKeyModal({
  keyToExport,
  exportKey,
  onSuccess,
  onCancel,
}: ExportKeyModalProps) {
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const input = document.getElementById(
      'export-password-input',
    ) as HTMLInputElement;
    const password = input?.value;

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsExporting(true);

    try {
      // Get the stored key
      const storedKey = getKey(keyToExport.publicKey);
      if (!storedKey) {
        throw new Error('Key not found');
      }

      // Verify password by attempting to decrypt
      await decryptKey(
        storedKey.private as import('@/types/storage').EncryptedConfidentialKeyRecord['private'],
        password,
      );

      // Password is correct, export the key
      const keyJson = exportKey(keyToExport.publicKey);
      const blob = new Blob([keyJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${keyToExport.alias.replace(/\s+/g, '_')}_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onSuccess();
    } catch {
      setError('Incorrect password');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm">
        Enter your password to export a backup of "{keyToExport.alias}".
      </Text>
      <TextInput
        id="export-password-input"
        type="password"
        label="Password"
        placeholder="Enter password"
        data-autofocus
        required
        error={error}
        onChange={() => setError('')}
      />
      <Group justify="flex-end" gap="sm">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="polyPink" loading={isExporting} onClick={handleExport}>
          Export
        </Button>
      </Group>
    </Stack>
  );
}
