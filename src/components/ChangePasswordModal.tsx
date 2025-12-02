import { useNotification } from '@/hooks/useNotification';
import { validatePassword } from '@/utils/passwordValidation';
import { Button, Modal, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { PasswordStrengthInput } from './PasswordStrengthInput';

interface ChangePasswordModalProps {
  opened: boolean;
  keyAlias: string | null;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
  onCancel: () => void;
}

export function ChangePasswordModal({
  opened,
  keyAlias,
  onSubmit,
  onCancel,
}: ChangePasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess } = useNotification();

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      oldPassword: (value) => (!value ? 'Current password is required' : null),
      newPassword: (value, values) => {
        if (!value) return 'New password is required';
        const validationError = validatePassword(value);
        if (validationError) return validationError;
        if (value === values.oldPassword) {
          return 'New password must be different from current password';
        }
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  const { reset } = form;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      reset();
    }
  }, [opened, reset]);

  const handleSubmit = form.onSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      await onSubmit(values.oldPassword, values.newPassword);
      // Success - show notification and modal will be closed by parent
      showSuccess(`Password changed for key "${keyAlias}"`);
    } catch {
      // Show error under current password field
      form.setFieldError('oldPassword', 'Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Change Password"
      centered
      closeOnClickOutside={false}
      closeOnEscape={!isSubmitting}
      withCloseButton={!isSubmitting}
      zIndex={300}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Change password for key:{' '}
            <Text span fw={700}>
              {keyAlias}
            </Text>
          </Text>

          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            required
            autoFocus
            disabled={isSubmitting}
            {...form.getInputProps('oldPassword')}
          />

          <PasswordStrengthInput
            value={form.values.newPassword}
            onChange={(value) => form.setFieldValue('newPassword', value)}
            label="New Password"
            placeholder="Enter new password"
            required
            error={form.errors.newPassword as string}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('confirmPassword')}
          />

          <Stack gap="xs" mt="md">
            <Button type="submit" fullWidth loading={isSubmitting}>
              Change Password
            </Button>
            <Button
              variant="subtle"
              color="gray"
              fullWidth
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
