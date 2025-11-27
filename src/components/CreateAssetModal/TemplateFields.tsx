import {
  Autocomplete,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useFormInputProps } from './FormInputHelpers';
import { TEMPLATE_CONFIG, type FieldDefinition } from './templateConfig';
import type { FormValues } from './types';

interface TemplateFieldsProps {
  form: UseFormReturnType<FormValues>;
}

export function TemplateFields({ form }: TemplateFieldsProps) {
  const { values } = form;
  const { template } = values;
  const { textInputProps, numberInputProps, autocompleteProps } =
    useFormInputProps(form);

  const config = TEMPLATE_CONFIG[template];

  if (!config) {
    return null;
  }

  const renderField = (field: FieldDefinition) => {
    const commonProps = {
      key: field.key,
      label: field.label,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
        return <TextInput key={field.key} {...textInputProps(commonProps)} />;
      case 'number':
        return (
          <NumberInput key={field.key} {...numberInputProps(commonProps)} />
        );
      case 'autocomplete':
        return (
          <Autocomplete
            key={field.key}
            {...autocompleteProps({
              ...commonProps,
              data: field.data || [],
            })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack gap="sm">
      {config.map((row, index) => {
        if (Array.isArray(row)) {
          return (
            <Group grow key={index}>
              {row.map((field) => renderField(field))}
            </Group>
          );
        }
        return renderField(row);
      })}
    </Stack>
  );
}
