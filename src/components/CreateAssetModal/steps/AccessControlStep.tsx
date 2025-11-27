import { MAX_AUDITORS, MAX_MEDIATORS } from '@/constants/assetFields';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconInfoCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo } from 'react';
import type { FormValues } from '../types';

interface AccessControlStepProps {
  form: UseFormReturnType<FormValues>;
}

export function AccessControlStep({ form }: AccessControlStepProps) {
  const { selectedKey, keys } = useConfidentialKey();
  const {
    values,
    setFieldValue,
    getInputProps,
    clearFieldError,
    errors,
    removeListItem,
    insertListItem,
  } = form;

  // Prepare account options for multi-select
  const accountOptions = useMemo(() => {
    return keys.map((key) => ({
      value: key.encryptionPublicKey,
      label: key.alias || `${key.publicKey.substring(0, 12)}...`,
    }));
  }, [keys]);

  return (
    <Stack gap="md" mt="xl">
      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        <Text size="sm">
          <strong>Auditors</strong> can view encrypted transaction details for
          this asset. At least one auditor is required (maximum {MAX_AUDITORS}).
          <br />
          <strong>Mediators</strong> can view encrypted transaction details for
          this asset and <strong>must approve transfers</strong> of this asset
          between parties before they can execute (maximum {MAX_MEDIATORS}).
        </Text>
      </Alert>

      {/* Use own key as auditor toggle */}
      {selectedKey && (
        <Paper p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>
                Use My Key as Auditor
              </Text>
            </div>
            <Switch
              checked={values.selectedAuditorKeys.includes(
                selectedKey.encryptionPublicKey,
              )}
              disabled={
                // Disable if 2 other auditors are already selected (not counting own key)
                !values.selectedAuditorKeys.includes(
                  selectedKey.encryptionPublicKey,
                ) &&
                values.selectedAuditorKeys.filter(
                  (key: string) => key !== selectedKey.encryptionPublicKey,
                ).length +
                  values.auditors.length >=
                  2
              }
              onChange={(e) => {
                const isChecked = e.currentTarget.checked;
                const myKey = selectedKey.encryptionPublicKey;

                if (isChecked) {
                  // Add to selected auditors if not already there
                  if (!values.selectedAuditorKeys.includes(myKey)) {
                    setFieldValue('selectedAuditorKeys', [
                      ...values.selectedAuditorKeys,
                      myKey,
                    ]);
                  }
                } else {
                  // Remove from selected auditors
                  setFieldValue(
                    'selectedAuditorKeys',
                    values.selectedAuditorKeys.filter(
                      (key: string) => key !== myKey,
                    ),
                  );
                }
              }}
            />
          </Group>
        </Paper>
      )}

      {/* Auditors */}
      <div>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Auditors
          </Text>
          {values.selectedAuditorKeys.length + values.auditors.length > 0 && (
            <Badge size="sm" circle>
              {values.selectedAuditorKeys.length + values.auditors.length}
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed" mb="xs">
          Select <strong>Encryption Keys</strong> from your accounts or enter
          manually
        </Text>

        <Stack gap="md">
          {/* MultiSelect for account selection */}
          <MultiSelect
            label="Select from your accounts"
            description={
              values.selectedAuditorKeys.length + values.auditors.length >=
              MAX_AUDITORS
                ? `Maximum ${MAX_AUDITORS} auditors reached. Remove a selection to add a different one.`
                : undefined
            }
            placeholder={
              accountOptions.length > 0
                ? 'Select accounts...'
                : 'No accounts available'
            }
            data={accountOptions}
            searchable
            clearable
            disabled={accountOptions.length === 0}
            maxValues={MAX_AUDITORS - values.auditors.length}
            {...getInputProps('selectedAuditorKeys')}
            onChange={(value) => {
              setFieldValue('selectedAuditorKeys', value);
              clearFieldError('auditors');
            }}
            error={errors.auditors}
          />
          {accountOptions.length === 0 && (
            <Text size="xs" c="dimmed" mt={-8}>
              No confidential accounts found. Create one in the Keys page first.
            </Text>
          )}

          {/* Manual input fields */}
          <div>
            <Text size="sm" mb="xs" mt={-8} fw={500}>
              Or enter manually
            </Text>
            <Stack gap="xs">
              {values.auditors.map((_: string, index: number) => (
                <Group key={index} align="flex-start">
                  <TextInput
                    placeholder="0x..."
                    style={{ flex: 1 }}
                    {...getInputProps(`auditors.${index}`)}
                    onChange={(event) => {
                      setFieldValue(
                        `auditors.${index}`,
                        event.currentTarget.value,
                      );
                      clearFieldError(`auditors.${index}`);
                    }}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeListItem('auditors', index)}
                    mt={4}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={() => insertListItem('auditors', '')}
                disabled={
                  values.selectedAuditorKeys.length + values.auditors.length >=
                  MAX_AUDITORS
                }
              >
                Add Auditor{' '}
                {values.selectedAuditorKeys.length + values.auditors.length >=
                  MAX_AUDITORS && `(Max ${MAX_AUDITORS})`}
              </Button>
            </Stack>
          </div>
        </Stack>
      </div>
      <Divider />
      {/* Mediators */}
      <div>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Mediators (Optional)
          </Text>
          {values.selectedMediatorKeys.length + values.mediators.length > 0 && (
            <Badge size="sm" circle>
              {values.selectedMediatorKeys.length + values.mediators.length}
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed" mb="xs">
          Select <strong>Encryption Keys</strong> from your accounts or enter
          manually
        </Text>

        <Stack gap="md">
          {/* MultiSelect for account selection */}
          <MultiSelect
            label="Select from your accounts"
            description={
              values.selectedMediatorKeys.length + values.mediators.length >=
              MAX_MEDIATORS
                ? `Maximum ${MAX_MEDIATORS} mediators reached. Remove a selection to add a different one.`
                : undefined
            }
            placeholder={
              accountOptions.length > 0
                ? 'Select accounts...'
                : 'No accounts available'
            }
            data={accountOptions}
            searchable
            clearable
            disabled={accountOptions.length === 0}
            maxValues={MAX_MEDIATORS - values.mediators.length}
            {...getInputProps('selectedMediatorKeys')}
            onChange={(value) => {
              setFieldValue('selectedMediatorKeys', value);
              clearFieldError('mediators');
            }}
          />
          {accountOptions.length === 0 && (
            <Text size="xs" c="dimmed" mt={-8}>
              No confidential accounts found. Create one in the Keys page first.
            </Text>
          )}

          {/* Manual input fields */}
          <div>
            <Text size="sm" mb="xs" mt={-8} fw={500}>
              Or enter manually
            </Text>
            <Stack gap="xs">
              {values.mediators.map((_: string, index: number) => (
                <Group key={index} align="flex-start">
                  <TextInput
                    placeholder="0x..."
                    style={{ flex: 1 }}
                    {...getInputProps(`mediators.${index}`)}
                    onChange={(event) => {
                      setFieldValue(
                        `mediators.${index}`,
                        event.currentTarget.value,
                      );
                      clearFieldError(`mediators.${index}`);
                    }}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeListItem('mediators', index)}
                    mt={4}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={() => insertListItem('mediators', '')}
                disabled={
                  values.selectedMediatorKeys.length +
                    values.mediators.length >=
                  MAX_MEDIATORS
                }
              >
                Add Mediator{' '}
                {values.selectedMediatorKeys.length + values.mediators.length >=
                  MAX_MEDIATORS && `(Max ${MAX_MEDIATORS})`}
              </Button>
            </Stack>
          </div>
        </Stack>
      </div>
    </Stack>
  );
}
