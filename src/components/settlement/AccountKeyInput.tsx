import { useAccountKeyValidation } from '@/hooks/useAccountKeyValidation';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { ActionIcon, Group, Loader, TextInput, Tooltip } from '@mantine/core';
import { IconCheck, IconUser, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

interface AccountKeyInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onEncryptionKeyChange: (key: string | undefined) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  withMyKeyAction?: boolean;
}

export function AccountKeyInput({
  label,
  placeholder = 'Account Public Key (0x...)',
  value,
  onChange,
  onEncryptionKeyChange,
  error,
  required,
  disabled,
  withMyKeyAction = true,
}: AccountKeyInputProps) {
  const { polkadotApi } = usePolymesh();
  const { selectedKey } = useConfidentialKey();

  const {
    accountKey,
    setAccountKey,
    encryptionKey,
    isValidating,
    error: validationError,
  } = useAccountKeyValidation(polkadotApi);

  // Sync internal state with external value
  useEffect(() => {
    if (value !== accountKey) {
      setAccountKey(value);
    }
  }, [value, accountKey, setAccountKey]);

  // Use a ref for the callback to avoid infinite loops when the callback identity changes
  const onEncryptionKeyChangeRef = useRef(onEncryptionKeyChange);

  useEffect(() => {
    onEncryptionKeyChangeRef.current = onEncryptionKeyChange;
  }, [onEncryptionKeyChange]);

  // Propagate encryption key changes
  useEffect(() => {
    console.log('effect ran1');
    if (onEncryptionKeyChangeRef.current) {
      if (encryptionKey) {
        onEncryptionKeyChangeRef.current(encryptionKey);
      } else if (validationError || !value) {
        onEncryptionKeyChangeRef.current(undefined);
      }
    }
  }, [encryptionKey, validationError, value]);

  const handleUseMyKey = () => {
    if (!selectedKey) return;
    const key = selectedKey.publicKey;
    onChange(key);
    // The hook will validate this key automatically when value updates
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isMyKey = selectedKey && value === selectedKey.publicKey;

  return (
    <Group gap="xs" align="flex-start">
      <TextInput
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        style={{ flex: 1 }}
        error={error || validationError}
        rightSection={
          isValidating ? (
            <Loader size="xs" />
          ) : encryptionKey ? (
            <IconCheck size={16} color="green" />
          ) : error || validationError ? (
            <IconX size={16} color="red" />
          ) : null
        }
      />
      {withMyKeyAction && (
        <Tooltip label="Use my key">
          <ActionIcon
            variant={isMyKey ? 'filled' : 'light'}
            color={isMyKey ? 'blue' : 'gray'}
            size="lg"
            onClick={handleUseMyKey}
            disabled={disabled || !selectedKey}
            mt={label ? 25 : 0}
          >
            <IconUser size={18} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
