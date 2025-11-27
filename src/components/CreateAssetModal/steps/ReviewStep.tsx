import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Code,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CustomField, FormValues } from '../types';

interface ReviewStepProps {
  form: UseFormReturnType<FormValues>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const { values } = form;
  const { keys } = useConfidentialKey();

  return (
    <Stack gap="md" mt="xl">
      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={500} c="dimmed">
            Asset Details
          </Text>
          <Group justify="space-between"></Group>
          <Group justify="space-between">
            <Text size="sm">Asset Type:</Text>
            <Text size="sm" fw={500}>
              {values.assetType}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Name:</Text>
            <Text size="sm" fw={500}>
              {values.name}
            </Text>
          </Group>
          {values.symbol && (
            <Group justify="space-between">
              <Text size="sm">Symbol:</Text>
              <Text size="sm" fw={500}>
                {values.symbol}
              </Text>
            </Group>
          )}
          <Group justify="space-between">
            <Text size="sm">Decimals:</Text>
            <Text size="sm" fw={500}>
              {values.decimals}
            </Text>
          </Group>
          {values.description && (
            <div>
              <Text size="sm" mb={4}>
                Description:
              </Text>
              <Text size="sm" c="dimmed">
                {values.description}
              </Text>
            </div>
          )}

          {/* Dynamic list of other non-empty fields */}
          {Object.entries(values).map(([key, value]) => {
            // Skip fields we already showed or are internal
            if (
              [
                'template',
                'assetType',
                'name',
                'symbol',
                'decimals',
                'description',
                'customFields',
                'selectedMediatorKeys',
                'selectedAuditorKeys',
                'mediators',
                'auditors',
              ].includes(key)
            ) {
              return null;
            }

            if (!value) return null;

            // Format key for display (camelCase to Title Case)
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <Group key={key} justify="space-between">
                <Text size="sm">{label}:</Text>
                <Text size="sm" fw={500}>
                  {String(value)}
                </Text>
              </Group>
            );
          })}

          {values.customFields.filter((f: CustomField) => f.key && f.value)
            .length > 0 && (
            <>
              <Divider />
              <Text size="sm" fw={500} c="dimmed">
                Custom Fields
              </Text>
              {values.customFields
                .filter((f: CustomField) => f.key && f.value)
                .map((field: CustomField, idx: number) => (
                  <Group key={idx} justify="space-between">
                    <Text size="sm">{field.key}:</Text>
                    <Text size="sm" fw={500}>
                      {field.value}
                    </Text>
                  </Group>
                ))}
            </>
          )}
        </Stack>
      </Paper>

      <Paper p="md" withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={500} c="dimmed">
            Access Control
          </Text>
          <div>
            <Text size="sm" mb={4}>
              Mediators (
              {values.selectedMediatorKeys.length + values.mediators.length}
              ):
            </Text>
            {values.selectedMediatorKeys.length === 0 &&
            values.mediators.length === 0 ? (
              <Text size="xs" c="dimmed">
                None
              </Text>
            ) : (
              <Stack gap={4}>
                {values.selectedMediatorKeys.map((m: string, idx: number) => {
                  const account = keys.find((k) => k.encryptionPublicKey === m);
                  return (
                    <Tooltip key={idx} label={m}>
                      <Code
                        block
                        style={{
                          fontSize: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {m.substring(0, 40)}...{' '}
                        {account?.alias && `(${account.alias})`}
                      </Code>
                    </Tooltip>
                  );
                })}
                {values.mediators.map((m: string, idx: number) => (
                  <Tooltip key={`manual-${idx}`} label={m}>
                    <Code
                      block
                      style={{
                        fontSize: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {m.substring(0, 40)}...
                    </Code>
                  </Tooltip>
                ))}
              </Stack>
            )}
          </div>
          <div>
            <Text size="sm" mb={4}>
              Auditors (
              {values.selectedAuditorKeys.length + values.auditors.length}
              ):
            </Text>
            <Stack gap={4}>
              {values.selectedAuditorKeys.map((a: string, idx: number) => {
                const account = keys.find((k) => k.encryptionPublicKey === a);
                return (
                  <Tooltip key={idx} label={a}>
                    <Code
                      block
                      style={{
                        fontSize: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {a.substring(0, 40)}...{' '}
                      {account?.alias && `(${account.alias})`}
                    </Code>
                  </Tooltip>
                );
              })}
              {values.auditors.map((a: string, idx: number) => (
                <Tooltip key={`manual-${idx}`} label={a}>
                  <Code
                    block
                    style={{
                      fontSize: '10px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.substring(0, 40)}...
                  </Code>
                </Tooltip>
              ))}
            </Stack>
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}
