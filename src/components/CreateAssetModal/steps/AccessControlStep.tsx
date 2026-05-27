import { useChainLimits } from '@/hooks/useChainLimits';
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
  const { maxAuditors, maxMediators, maxEncryptionKeys } = useChainLimits();
  const {
    values,
    setFieldValue,
    getInputProps,
    clearFieldError,
    errors,
    removeListItem,
    insertListItem,
  } = form;

  // Totals
  const totalAuditors =
    values.selectedAuditorKeys.length + values.auditors.length;
  const totalMediators =
    values.selectedMediatorKeys.length + values.mediators.length;

  // Effective per-role maximums, constrained by the combined encryption key limit
  const effectiveMaxAuditors = Math.min(
    maxAuditors,
    maxEncryptionKeys - totalMediators,
  );
  const effectiveMaxMediators = Math.min(
    maxMediators,
    maxEncryptionKeys - totalAuditors,
  );

  // Prepare account options for multi-select
  const accountOptions = useMemo(() => {
    return keys.map((key) => ({
      value: key.encryptionPublicKey,
      label: key.alias || `${key.publicKey.substring(0, 12)}...`,
    }));
  }, [keys]);

  const auditorLimitReached = totalAuditors >= effectiveMaxAuditors;
  const mediatorLimitReached = totalMediators >= effectiveMaxMediators;

  const auditorLimitDescription = () => {
    if (!auditorLimitReached) return undefined;
    if (totalAuditors + totalMediators >= maxEncryptionKeys) {
      return `Combined auditor and mediator limit of ${maxEncryptionKeys} reached.`;
    }
    return `Maximum ${maxAuditors} auditors reached. Remove a selection to add a different one.`;
  };

  const mediatorLimitDescription = () => {
    if (!mediatorLimitReached) return undefined;
    if (totalAuditors + totalMediators >= maxEncryptionKeys) {
      return `Combined auditor and mediator limit of ${maxEncryptionKeys} reached.`;
    }
    return `Maximum ${maxMediators} mediators reached. Remove a selection to add a different one.`;
  };

  return (
    <Stack gap="md" mt="xl">
      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        <Text size="sm">
          At least one <strong>auditor or mediator</strong> is required.
          <br />
          <br />
          <strong>Auditors</strong> can view encrypted transaction details for
          this asset (maximum {maxAuditors}).
          <br />
          <strong>Mediators</strong> can view encrypted transaction details for
          this asset and <strong>must approve transfers</strong> of this asset
          between parties before they can execute (maximum {maxMediators}).
          <br />
          <br />
          The combined total of auditors and mediators cannot exceed{' '}
          <strong>{maxEncryptionKeys}</strong>.
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
                // Disable when adding this key would exceed the effective auditor limit
                !values.selectedAuditorKeys.includes(
                  selectedKey.encryptionPublicKey,
                ) &&
                values.selectedAuditorKeys.filter(
                  (key: string) => key !== selectedKey.encryptionPublicKey,
                ).length +
                  values.auditors.length >=
                  effectiveMaxAuditors
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
          {totalAuditors > 0 && (
            <Badge size="sm" circle>
              {totalAuditors}
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
            description={auditorLimitDescription()}
            placeholder={
              accountOptions.length > 0
                ? 'Select accounts...'
                : 'No accounts available'
            }
            data={accountOptions}
            searchable
            clearable
            disabled={accountOptions.length === 0}
            maxValues={Math.max(
              0,
              effectiveMaxAuditors - values.auditors.length,
            )}
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
                disabled={auditorLimitReached}
              >
                Add Auditor{' '}
                {auditorLimitReached && `(Max ${effectiveMaxAuditors})`}
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
            Mediators
          </Text>
          {totalMediators > 0 && (
            <Badge size="sm" circle>
              {totalMediators}
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
            description={mediatorLimitDescription()}
            placeholder={
              accountOptions.length > 0
                ? 'Select accounts...'
                : 'No accounts available'
            }
            data={accountOptions}
            searchable
            clearable
            disabled={accountOptions.length === 0}
            maxValues={Math.max(
              0,
              effectiveMaxMediators - values.mediators.length,
            )}
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
                disabled={mediatorLimitReached}
              >
                Add Mediator{' '}
                {mediatorLimitReached && `(Max ${effectiveMaxMediators})`}
              </Button>
            </Stack>
          </div>
        </Stack>
      </div>
    </Stack>
  );
}
