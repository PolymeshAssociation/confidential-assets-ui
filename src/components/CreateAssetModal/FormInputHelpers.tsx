import type { UseFormReturnType } from '@mantine/form';
import type { FormValues } from './types';

/**
 * Hook to generate common input props for form fields
 * @param form - The Mantine form instance
 */
export function useFormInputProps(form: UseFormReturnType<FormValues>) {
  const { getInputProps } = form;

  // Common props for text inputs
  const textInputProps = ({
    key,
    label,
    placeholder,
  }: {
    key: string;
    label?: string;
    placeholder?: string;
  }) => ({
    label,
    placeholder,
    ...getInputProps(key),
    style: { flex: 1 },
  });

  // Common props for number inputs
  const numberInputProps = ({
    key,
    label,
    placeholder,
  }: {
    key: string;
    label: string;
    placeholder?: string;
  }) => ({
    label,
    placeholder,
    ...getInputProps(key),
    style: { flex: 1 },
    min: 0,
    allowNegative: false,
  });

  // Common props for autocomplete (replaces selects)
  const autocompleteProps = ({
    key,
    label,
    data,
    placeholder,
  }: {
    key: string;
    label?: string;
    data: string[];
    placeholder?: string;
  }) => ({
    label,
    data,
    placeholder,
    ...getInputProps(key),
    style: { flex: 1 },
  });

  // Common props for text areas
  const textareaProps = ({
    key,
    label,
    placeholder,
    minRows = 2,
  }: {
    key: string;
    label?: string;
    placeholder?: string;
    minRows?: number;
  }) => ({
    label,
    placeholder,
    minRows,
    ...getInputProps(key),
    style: { flex: 1 },
  });

  return {
    textInputProps,
    numberInputProps,
    autocompleteProps,
    textareaProps,
  };
}
