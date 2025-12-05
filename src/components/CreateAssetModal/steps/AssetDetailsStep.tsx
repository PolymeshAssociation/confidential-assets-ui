import { TEMPLATE_SPECIFIC_FIELDS } from '@/constants/assetFields';
import type { AssetTemplateType } from '@/types/asset';
import { METADATA_TEMPLATES } from '@/utils/metadata';
import {
  Accordion,
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useFormInputProps } from '../FormInputHelpers';
import { TemplateFields } from '../TemplateFields';
import type { CustomField, FormValues } from '../types';

interface AssetDetailsStepProps {
  form: UseFormReturnType<FormValues>;
}

export function AssetDetailsStep({ form }: AssetDetailsStepProps) {
  const {
    values,
    getInputProps,
    setFieldValue,
    errors,
    removeListItem,
    insertListItem,
  } = form;

  const { textInputProps, numberInputProps, autocompleteProps, textareaProps } =
    useFormInputProps(form);

  // Update form fields when template changes
  const handleTemplateChange = (value: string | null) => {
    if (!value) return;
    const template = value as AssetTemplateType;
    setFieldValue('template', template);

    // Clear all template-specific fields to prevent data leakage between templates
    TEMPLATE_SPECIFIC_FIELDS.forEach((field) => {
      setFieldValue(field, undefined);
    });

    // Update assetType based on template
    const templateConfig = METADATA_TEMPLATES[template];
    if (templateConfig) {
      setFieldValue('assetType', templateConfig.value);
      setFieldValue('assetSubType', ''); // Reset sub-type
    }
  };

  return (
    <Stack gap="md" mt="xl">
      <Select
        label="Template"
        description="Choose a template for your asset type"
        required
        data={[
          {
            value: 'basic',
            label: 'Digital Asset / Token - General purpose',
          },
          { value: 'currency', label: 'Currency - Stablecoins & CBDCs' },
          { value: 'equity', label: 'Equity - Stocks & Shares' },
          { value: 'debt', label: 'Debt - Bonds & Loans' },
          { value: 'fund', label: 'Fund - Investment Funds' },
          { value: 'commodity', label: 'Commodity - Physical Assets' },
          { value: 'real-estate', label: 'Real Estate - Property' },
          {
            value: 'derivative',
            label: 'Derivative - Options & Futures',
          },
          { value: 'structured-product', label: 'Structured Product' },
          { value: 'credit-entitlement', label: 'Credit / Entitlement' },
          { value: 'custom', label: 'Custom - Flexible' },
        ]}
        {...getInputProps('template')}
        onChange={handleTemplateChange}
      />

      {/* Accordion Layout for all sections */}
      <Accordion variant="separated" radius="md" mt="xs" defaultValue="general">
        {/* 1. General Details */}
        <Accordion.Item value="general">
          <Accordion.Control
            c={
              errors.name ||
              errors.assetType ||
              errors.assetSubType ||
              errors.decimals ||
              errors.description
                ? 'var(--mantine-color-error)'
                : undefined
            }
          >
            General Details
          </Accordion.Control>
          <Accordion.Panel>
            {/* Asset Type (Broad Category) */}
            <TextInput
              required
              readOnly={values.template !== 'custom'}
              {...textInputProps({
                key: 'assetType',
                label: 'Asset Type',
                placeholder: 'e.g. Equity, Debt',
              })}
            />

            {/* Asset Sub-Type (Specific) */}
            {values.template === 'custom' ? (
              <TextInput
                mt="sm"
                {...textInputProps({
                  key: 'assetSubType',
                  label: 'Asset Sub-Type',
                  placeholder: 'e.g. Convertible Note',
                })}
              />
            ) : (
              <Autocomplete
                mt="sm"
                {...autocompleteProps({
                  key: 'assetSubType',
                  label: 'Asset Sub-Type',
                  placeholder: 'Select or type specific asset type',
                  data:
                    METADATA_TEMPLATES[values.template as AssetTemplateType]
                      ?.subTypes || [],
                })}
              />
            )}

            <Group grow mt="sm">
              <TextInput
                required
                {...textInputProps({
                  key: 'name',
                  label: 'Name',
                  placeholder: 'e.g. My Confidential Token',
                })}
              />
              <TextInput
                description="Short identifier for your asset"
                {...textInputProps({
                  key: 'symbol',
                  label: 'Symbol',
                  placeholder: 'e.g., MCT',
                })}
              />
            </Group>

            <Group grow mt="sm">
              <NumberInput
                required
                max={18}
                decimalScale={0}
                {...numberInputProps({
                  key: 'decimals',
                  label: 'Decimals',
                })}
              />
            </Group>

            <Textarea
              mt="sm"
              {...textareaProps({
                key: 'description',
                label: 'Description',
                placeholder: 'Describe your asset...',
              })}
            />
          </Accordion.Panel>
        </Accordion.Item>

        {/* 2. Category Specific Information (Only if template has specific fields) */}
        {values.template !== 'basic' && values.template !== 'custom' && (
          <Accordion.Item value="category">
            <Accordion.Control>
              {METADATA_TEMPLATES[values.template as AssetTemplateType]?.label}{' '}
              Details
            </Accordion.Control>
            <Accordion.Panel>
              <TemplateFields form={form} />
            </Accordion.Panel>
          </Accordion.Item>
        )}

        {/* 3. Financial Identifiers */}
        <Accordion.Item value="financial-identifiers">
          <Accordion.Control>Financial Identifiers</Accordion.Control>
          <Accordion.Panel>
            <Group grow>
              <TextInput
                {...textInputProps({
                  key: 'isin',
                  label: 'ISIN',
                  placeholder: '12 chars',
                })}
              />
              <TextInput
                {...textInputProps({
                  key: 'cusip',
                  label: 'CUSIP',
                  placeholder: '9 chars',
                })}
              />
            </Group>
            <Group grow mt="xs">
              <TextInput
                {...textInputProps({
                  key: 'lei',
                  label: 'LEI',
                  placeholder: '20 chars',
                })}
              />
              <TextInput
                {...textInputProps({
                  key: 'figi',
                  label: 'FIGI',
                  placeholder: '12 chars',
                })}
              />
            </Group>
            <Group grow mt="xs">
              <TextInput
                {...textInputProps({
                  key: 'cins',
                  label: 'CINS',
                  placeholder: '9 chars',
                })}
              />
              <TextInput
                {...textInputProps({
                  key: 'sedol',
                  label: 'SEDOL',
                  placeholder: '7 chars',
                })}
              />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>

        {/* 4. Additional Information */}
        <Accordion.Item value="additional-info">
          <Accordion.Control>Additional Information</Accordion.Control>
          <Accordion.Panel>
            <Group grow>
              <TextInput
                {...textInputProps({
                  key: 'website',
                  label: 'Website',
                  placeholder: 'https://...',
                })}
              />
              <TextInput
                {...textInputProps({
                  key: 'issuer',
                  label: 'Issuer',
                  placeholder: 'Legal Entity Name',
                })}
              />
            </Group>
            <TextInput
              mt="xs"
              {...textInputProps({
                key: 'metadataUri',
                label: 'Metadata URI',
                placeholder: 'https://... (Link to off-chain data)',
              })}
            />
            <TextInput
              mt="xs"
              {...textInputProps({
                key: 'jurisdiction',
                label: 'Jurisdiction',
                placeholder: 'e.g. US, UK, SG',
              })}
            />
            <TextInput
              mt="xs"
              {...textInputProps({
                key: 'issuerIdentifier',
                label: 'Issuer Identifier',
                placeholder: 'Registration Number',
              })}
            />
          </Accordion.Panel>
        </Accordion.Item>

        {/* 5. Custom Fields */}
        <Accordion.Item value="custom">
          <Accordion.Control
            c={
              values.customFields.some(
                (_: CustomField, index: number) =>
                  errors[`customFields.${index}.key`],
              )
                ? 'var(--mantine-color-error)'
                : undefined
            }
          >
            Custom Fields
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {values.customFields.length > 0 && (
                <Group>
                  <Text size="sm" fw={500} style={{ flex: 1 }}>
                    Key
                  </Text>
                  <Text size="sm" fw={500} style={{ flex: 1 }}>
                    Value
                  </Text>
                  <div style={{ width: 28 }} />
                </Group>
              )}
              {values.customFields.map((_: CustomField, index: number) => (
                <Group key={index} align="center">
                  <Autocomplete
                    clearable
                    {...autocompleteProps({
                      key: `customFields.${index}.key`,
                      placeholder: 'Field name',
                      data: [...TEMPLATE_SPECIFIC_FIELDS].sort(),
                    })}
                  />
                  <TextInput
                    {...textInputProps({
                      key: `customFields.${index}.value`,
                      placeholder: 'Field value',
                    })}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeListItem('customFields', index)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={() =>
                  insertListItem('customFields', { key: '', value: '' })
                }
              >
                Add Custom Field
              </Button>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
