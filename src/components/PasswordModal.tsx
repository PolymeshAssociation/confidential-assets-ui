import {
  Button,
  Checkbox,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';

interface PasswordModalProps {
  opened: boolean;
  keyAlias: string | null;
  onSubmit: (password: string, keepUnlocked: boolean) => Promise<void>;
  onCancel: () => void;
}

export function PasswordModal({
  opened,
  keyAlias,
  onSubmit,
  onCancel,
}: PasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localKeepUnlocked, setLocalKeepUnlocked] = useState(false);

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  const { reset } = form;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      reset();
      setLocalKeepUnlocked(false);
    }
  }, [opened, reset]);

  const handleSubmit = form.onSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      // Pass both password and keepUnlocked preference
      await onSubmit(values.password, localKeepUnlocked);
      // Success - modal will be closed by parent
    } catch {
      // Show error under password field
      form.setFieldError('password', 'Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Unlock Confidential Account"
      centered
      closeOnClickOutside={false}
      closeOnEscape={!isSubmitting}
      withCloseButton={!isSubmitting}
      zIndex={300}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Text size="sm" c="dimmed">
            Enter password to unlock:{' '}
            <Text span fw={700}>
              {keyAlias}
            </Text>
          </Text>

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            required
            autoFocus
            disabled={isSubmitting}
            {...form.getInputProps('password')}
          />

          <Checkbox
            label="Keep unlocked for 10 minutes"
            description="Account will remain unlocked in memory for multiple transactions. Subsequent transactions will extend the unlock period."
            checked={localKeepUnlocked}
            onChange={(e) => setLocalKeepUnlocked(e.currentTarget.checked)}
            disabled={isSubmitting}
          />

          <Stack gap="xs" mt="md">
            <Button type="submit" fullWidth loading={isSubmitting}>
              Unlock
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
