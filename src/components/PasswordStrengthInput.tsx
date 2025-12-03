import { MIN_PASSWORD_LENGTH } from '@/config/passwordConfig';
import type { PasswordStrength } from '@/types/password';
import {
  checkPasswordBreach,
  getStrength,
  getStrengthPercentage,
} from '@/utils/passwordValidation';
import {
  Alert,
  Box,
  Group,
  Loader,
  PasswordInput,
  Progress,
  Text,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface PasswordStrengthInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

export function PasswordStrengthInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter password',
  required = false,
  error,
  description,
}: PasswordStrengthInputProps) {
  const [strength, setStrength] = useState<PasswordStrength>('weak');
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  const [breachInfo, setBreachInfo] = useState<{
    isBreached: boolean;
    breachCount: number;
    error?: string;
  } | null>(null);

  // Calculate strength immediately
  useEffect(() => {
    setStrength(getStrength(value));
  }, [value]);

  // Check for breaches with debounce
  useEffect(() => {
    if (!value || value.length < MIN_PASSWORD_LENGTH) {
      setBreachInfo(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingBreach(true);
      const result = await checkPasswordBreach(value);
      setBreachInfo(result);
      setIsCheckingBreach(false);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [value]);

  const strengthPercentage = getStrengthPercentage(strength);
  const meetsMinLength = value.length >= MIN_PASSWORD_LENGTH;

  // Override strength if password is breached
  const displayStrength = breachInfo?.isBreached ? 'weak' : strength;
  const displayPercentage = breachInfo?.isBreached ? 25 : strengthPercentage;

  // Color for progress bar
  const getColor = () => {
    if (breachInfo?.isBreached) return 'red';
    switch (strength) {
      case 'strong':
        return 'teal';
      case 'good':
        return 'blue';
      case 'fair':
        return 'yellow';
      default:
        return 'red';
    }
  };

  return (
    <div>
      <PasswordInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        required={required}
        error={error}
        description={description}
      />

      {value && (
        <Box mt="xs">
          <Progress
            color={getColor()}
            value={displayPercentage}
            size={5}
            mb="xs"
          />

          <Group gap="xs" mb={5}>
            <Text size="xs" c="dimmed">
              Password strength:
            </Text>
            <Text size="xs" fw={600} c={getColor()}>
              {displayStrength.charAt(0).toUpperCase() +
                displayStrength.slice(1)}
            </Text>
          </Group>

          <Group gap="xs" mb={5}>
            {meetsMinLength ? (
              <IconCheck size={14} color="green" />
            ) : (
              <IconInfoCircle size={14} color="gray" />
            )}
            <Text size="xs" c={meetsMinLength ? 'teal' : 'dimmed'}>
              At least {MIN_PASSWORD_LENGTH} characters ({value.length}/
              {MIN_PASSWORD_LENGTH})
            </Text>
          </Group>

          <Text size="xs" c="dimmed" mb={5}>
            💡 Longer passwords are more secure (16+ characters recommended)
          </Text>

          {/* Breach check status */}
          {isCheckingBreach && (
            <Group gap="xs" mt="xs">
              <Loader size="xs" />
              <Text size="xs" c="dimmed">
                Checking password breach database...
              </Text>
            </Group>
          )}

          {breachInfo?.error && (
            <Alert
              icon={<IconAlertTriangle size={16} />}
              color="yellow"
              variant="light"
              mt="xs"
            >
              <Text size="xs">{breachInfo.error}</Text>
            </Alert>
          )}

          {breachInfo?.isBreached && !breachInfo.error && (
            <Alert
              icon={<IconAlertTriangle size={16} />}
              color="red"
              variant="light"
              mt="xs"
            >
              <Text size="xs" fw={600}>
                This password has been found in{' '}
                {breachInfo.breachCount.toLocaleString()} data breaches
              </Text>
              <Text size="xs" mt={4}>
                Please choose a different password for better security.
              </Text>
            </Alert>
          )}

          {breachInfo &&
            !breachInfo.isBreached &&
            !breachInfo.error &&
            meetsMinLength && (
              <Group gap="xs" mt="xs">
                <IconCheck size={14} color="green" />
                <Text size="xs" c="teal">
                  Not found in known data breaches
                </Text>
              </Group>
            )}
        </Box>
      )}
    </div>
  );
}
