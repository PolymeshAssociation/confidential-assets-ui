import { getStrength, requirements } from '@/utils/passwordValidation';
import { Box, Group, PasswordInput, Progress, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

interface PasswordStrengthInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

function PasswordRequirementItem({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Group gap={7}>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box>{label}</Box>
      </Group>
    </Text>
  );
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
  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirementItem
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

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

      {
        <Box mt="xs">
          <Progress color={color} value={strength} size={5} mb="xs" />
          <Text size="xs" c="dimmed" mb={5}>
            Password strength:{' '}
            {strength === 100 ? 'Strong' : strength > 50 ? 'Fair' : 'Weak'}
          </Text>
          {checks}
        </Box>
      }
    </div>
  );
}
