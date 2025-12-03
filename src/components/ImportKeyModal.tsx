import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import * as keyStorage from '@/services/storage/keyStorage';
import { isValidKeyRecord } from '@/services/storage/keyValidation';
import { readJsonFile } from '@/utils/fileUtils';
import {
  Button,
  FileInput,
  Group,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ImportKeyModalProps {
  opened: boolean;
  onClose: () => void;
  onKeyImported?: () => void;
  initialFile?: File | null;
}

export function ImportKeyModal({
  opened,
  onClose,
  onKeyImported,
  initialFile,
}: ImportKeyModalProps) {
  const { importKey } = useConfidentialKey();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [duplicateKeyError, setDuplicateKeyError] = useState<string | null>(
    null,
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyPreview, setKeyPreview] = useState<{
    name: string;
    publicKey: string;
    encryptionPublicKey: string;
    jsonContent: string;
  } | null>(null);

  // Process initial file when provided
  useEffect(() => {
    if (initialFile) {
      handleFileChange(initialFile);
    }
  }, [initialFile]);

  const handleFileChange = async (payload: File | null) => {
    setFile(payload);
    setFileError(null);
    setDuplicateKeyError(null);
    setPasswordError(null);
    setKeyPreview(null);

    if (payload) {
      try {
        const content = await readJsonFile(payload);

        // Validate key file structure
        if (!isValidKeyRecord(content)) {
          throw new Error('Invalid key file format');
        }

        setKeyPreview({
          name: content.name,
          publicKey: content.public.account,
          encryptionPublicKey: content.public.encryption,
          jsonContent: JSON.stringify(content),
        });

        // Check for duplicate key immediately
        if (keyStorage.keyExistsByPublicKey(content.public.account)) {
          setDuplicateKeyError('This key already exists in your key store');
          setFileError('This key already exists, select another file');
          setFile(null);
          return;
        }
      } catch {
        setFileError('Invalid key file. Please select a valid JSON backup.');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!keyPreview || !password) return;

    setLoading(true);
    setFileError(null);
    setDuplicateKeyError(null);
    setPasswordError(null);

    try {
      await importKey({ jsonData: keyPreview.jsonContent, password });
      onClose();
      if (onKeyImported) {
        onKeyImported();
      }
      // Reset state
      setFile(null);
      setPassword('');
      setKeyPreview(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to import key';

      // Categorize errors
      if (errorMessage.includes('already exists')) {
        setDuplicateKeyError('This key already exists in your key store');
      } else if (
        errorMessage.includes('password') ||
        errorMessage.includes('Incorrect')
      ) {
        setPasswordError(errorMessage);
      } else {
        setPasswordError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFile(null);
    setPassword('');
    setFileError(null);
    setDuplicateKeyError(null);
    setPasswordError(null);
    setKeyPreview(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Import Confidential Key"
      centered
    >
      <Stack>
        <FileInput
          label="Select Key File"
          placeholder="Click to select file"
          accept="application/json"
          leftSection={<IconUpload size={14} />}
          value={file}
          onChange={handleFileChange}
          error={fileError}
        />

        {keyPreview && (
          <>
            <TextInput
              label="Confidential Account Name"
              value={keyPreview.name}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Public Key"
              value={keyPreview.publicKey}
              readOnly
              variant="filled"
              styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
              error={duplicateKeyError}
            />
            <TextInput
              label="Encryption Public Key"
              value={keyPreview.encryptionPublicKey}
              readOnly
              variant="filled"
              styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
            />

            <PasswordInput
              label="Enter Password"
              description="Enter the password used to encrypt this key"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              error={passwordError}
              withAsterisk
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                loading={loading}
                disabled={!password || !!duplicateKeyError || !!fileError}
              >
                Import Key
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
