import { PasswordStrengthInput } from '@/components/PasswordStrengthInput';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { downloadJsonFile } from '@/utils/fileUtils';
import { validatePassword } from '@/utils/passwordValidation';
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconShieldLock,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface GenerateKeyModalPropsProps {
  opened: boolean;
  onClose: () => void;
}

export function GenerateKeyModal({
  opened,
  onClose,
}: GenerateKeyModalPropsProps) {
  const { generateKey, exportKey, isGenerating, selectKey, keys } =
    useConfidentialKey();
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    // Reset state on close
    setActiveStep(0);
    setAlias('');
    setPassword('');
    setConfirmPassword('');
    setHasBackedUp(false);
    setError(null);
    onClose();
  };

  const handleGenerate = async () => {
    if (!alias) {
      setError('Please enter a key alias');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError(null);
      await generateKey(alias, undefined, password);
      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key');
    }
  };

  const handleDownload = (publicKey: string) => {
    try {
      const keyJson = exportKey(publicKey);
      const keyData = JSON.parse(keyJson);
      downloadJsonFile(keyData, `${alias.replace(/\s+/g, '_')}_backup.json`);
      setHasBackedUp(true);
    } catch (err) {
      console.error('Failed to download backup:', err);
      setError('Failed to generate backup file');
    }
  };

  // Helper to get the generated key
  const generatedKey =
    activeStep === 1 ? keys.find((k) => k.alias === alias) : null;

  // Auto-select the generated key when it becomes available
  useEffect(() => {
    if (activeStep === 1 && generatedKey) {
      selectKey(generatedKey.publicKey);
    }
  }, [activeStep, generatedKey, selectKey]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<Title order={4}>Generate New Confidential Key</Title>}
      size="md"
      closeOnClickOutside={false}
    >
      {activeStep === 0 && (
        <Stack gap="md" mt="md">
          <Alert
            color="blue"
            title="Security Notice"
            icon={<IconShieldLock size={16} />}
          >
            Keys are encrypted with your password and stored locally in your
            browser. Polymesh Association cannot recover lost passwords.
          </Alert>

          {error && (
            <Alert
              color="red"
              title="Error"
              icon={<IconAlertTriangle size={16} />}
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Key Alias"
            placeholder="My Key Name"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            description="A friendly name to identify this key"
            maxLength={50}
            required
            data-autofocus
          />

          <PasswordStrengthInput
            value={password}
            onChange={setPassword}
            label="Password"
            placeholder="Enter password"
            required
            error={
              password ? validatePassword(password) || undefined : undefined
            }
          />
          <TextInput
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPassword && password !== confirmPassword
                ? 'Passwords do not match'
                : null
            }
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} loading={isGenerating}>
              Generate Key
            </Button>
          </Group>
        </Stack>
      )}

      {activeStep === 1 && (
        <Stack gap="md" mt="md">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Backup Required"
            color="yellow"
            variant="light"
          >
            Your confidential key is stored locally. If you clear your browser
            data or lose access to this device, you will lose access to your
            assets forever unless you have a backup.
          </Alert>

          <Text size="sm">
            Please download a backup of your key immediately. Store it safely.
          </Text>

          <Button
            leftSection={<IconDownload size={16} />}
            variant="outline"
            onClick={() =>
              generatedKey && handleDownload(generatedKey.publicKey)
            }
            color={hasBackedUp ? 'green' : 'blue'}
            disabled={!generatedKey}
          >
            {hasBackedUp ? 'Backup Downloaded' : 'Download Backup'}
          </Button>

          {hasBackedUp && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Ready to Register"
              color="green"
              variant="light"
            >
              Great! You can now register this key on-chain to start using it.
            </Alert>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose}>
              Skip Backup
            </Button>
            <Button onClick={handleClose} disabled={!hasBackedUp}>
              Finish
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
