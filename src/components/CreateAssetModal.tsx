/**
 * Create Asset Modal
 *
 * Multi-step form for creating a confidential asset
 */

import { TEMPLATE_SPECIFIC_FIELDS } from '@/constants/assetFields';
import { useAsset } from '@/hooks/useAsset';
import { usePolymesh } from '@/hooks/usePolymesh';
import type { AssetMetadata } from '@/types/asset';
import {
  validateCustomFields,
  validateEncryptionKeys,
} from '@/utils/assetValidation';
import { METADATA_TEMPLATES } from '@/utils/metadata';
import { Button, Group, Modal, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { AccessControlStep } from './CreateAssetModal/steps/AccessControlStep';
import { AssetDetailsStep } from './CreateAssetModal/steps/AssetDetailsStep';
import { ReviewStep } from './CreateAssetModal/steps/ReviewStep';
import type { FormValues } from './CreateAssetModal/types';

interface CreateAssetModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateAssetModal({ opened, onClose }: CreateAssetModalProps) {
  const [active, setActive] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAsset } = useAsset();
  const { polkadotApi } = usePolymesh();
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      template: 'basic',
      name: '',
      symbol: '',
      assetType: METADATA_TEMPLATES['basic'].value,
      assetSubType: '',
      description: '',
      decimals: 0,
      customFields: [],
      selectedMediatorKeys: [],
      selectedAuditorKeys: [],
      mediators: [],
      auditors: [],
    },
    validate: (values) => {
      if (active === 0) {
        const errors: Record<string, string | null> = {
          name: !values.name ? 'Name is required' : null,
          symbol: !values.symbol ? 'Symbol is required' : null,
          assetType: !values.assetType ? 'Asset Type is required' : null,
          decimals:
            values.decimals < 0
              ? 'Decimals must be non-negative'
              : values.decimals > 8
                ? 'Decimals cannot exceed 8'
                : !Number.isInteger(values.decimals)
                  ? 'Decimals must be a whole number'
                  : null,
        };

        // Validate custom fields for duplicates
        const customFieldErrors = validateCustomFields(
          values.customFields,
          values.template,
        );
        Object.assign(errors, customFieldErrors);

        return errors;
      }
      if (active === 1) {
        // Check minimum requirement: at least one auditor OR mediator
        // All other validation (format, uniqueness, max count, on-chain) is in validateManualKeys
        const totalAuditors =
          values.selectedAuditorKeys.length + values.auditors.length;
        const totalMediators =
          values.selectedMediatorKeys.length + values.mediators.length;
        if (totalAuditors === 0 && totalMediators === 0) {
          return {
            auditors: 'At least one auditor or mediator is required',
          };
        }
      }
      return {};
    },
  });

  const { values, setFieldError, validate, reset } = form;

  const validateManualKeys = async () => {
    if (!polkadotApi) return true;

    setIsValidating(true);
    let hasErrors = false;

    try {
      // Combine all auditors and mediators for uniqueness and count checks
      const allAuditors = [...values.selectedAuditorKeys, ...values.auditors];
      const allMediators = [
        ...values.selectedMediatorKeys,
        ...values.mediators,
      ];

      // Check total count (max 2 auditors, max 2 mediators)
      const mediatorErrors = await validateEncryptionKeys(
        values.mediators,
        allMediators,
        'mediators',
        setFieldError,
        polkadotApi,
      );
      if (mediatorErrors) hasErrors = true;

      // Validate auditors
      const auditorErrors = await validateEncryptionKeys(
        values.auditors,
        allAuditors,
        'auditors',
        setFieldError,
        polkadotApi,
      );
      if (auditorErrors) hasErrors = true;

      return !hasErrors;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = async () => {
    const validation = validate();
    if (!validation.hasErrors) {
      // Perform async validation for step 2 (Access Control)
      if (active === 1) {
        const isValid = await validateManualKeys();
        if (!isValid) return;
      }
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async () => {
    const validation = validate();
    if (validation.hasErrors) return;

    setIsSubmitting(true);
    try {
      // Build metadata object
      const metadata: AssetMetadata = {
        assetType: values.assetType,
        // Note: name, symbol, and decimals are NOT included in metadata
        // They are passed as separate parameters to createAsset
      };

      // Add optional fields
      if (values.assetSubType) metadata.assetSubType = values.assetSubType;
      if (values.description) metadata.description = values.description;

      // Universal fields
      if (values.website) metadata.website = values.website;
      if (values.whitepaper) metadata.whitepaper = values.whitepaper;
      if (values.metadataUri) metadata.metadataUri = values.metadataUri;
      if (values.jurisdiction) metadata.jurisdiction = values.jurisdiction;
      if (values.issuer) metadata.issuer = values.issuer;
      if (values.issuerIdentifier)
        metadata.issuerIdentifier = values.issuerIdentifier;

      // Financial Identifiers
      if (values.isin) metadata.isin = values.isin;
      if (values.cusip) metadata.cusip = values.cusip;
      if (values.cins) metadata.cins = values.cins;
      if (values.sedol) metadata.sedol = values.sedol;
      if (values.figi) metadata.figi = values.figi;
      if (values.lei) metadata.lei = values.lei;

      // Template specific fields
      // We iterate over all possible fields and add them if they exist in values
      // This is safe because fields not relevant to the current template won't be filled
      TEMPLATE_SPECIFIC_FIELDS.forEach((field) => {
        if (values[field] !== undefined && values[field] !== '') {
          // @ts-expect-error - Dynamic assignment to metadata object. TypeScript can't verify that all
          // template fields exist in AssetMetadata, but we know they do since they're optional fields.
          metadata[field] = values[field];
        }
      });

      // Add custom fields
      values.customFields.forEach((field) => {
        if (field.key && field.value) {
          metadata[field.key] = field.value;
        }
      });

      // Build mediators list (combine selected + manual, filter out empty strings)
      const mediators = [
        ...values.selectedMediatorKeys,
        ...values.mediators.filter((m) => m.trim() !== ''),
      ];

      // Build auditors list (combine selected + manual, filter out empty strings)
      const auditors = [
        ...values.selectedAuditorKeys,
        ...values.auditors.filter((a) => a.trim() !== ''),
      ];

      // Create asset
      await createAsset({
        name: values.name,
        symbol: values.symbol,
        decimals: values.decimals,
        metadata,
        mediators,
        auditors,
      });

      // Reset and close
      reset();
      setActive(0);
      onClose();
    } catch (error) {
      console.error('Failed to create asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setActive(0);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create Confidential Asset"
      size="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <Stepper active={active} onStepClick={setActive}>
        {/* Step 1: Asset Details */}
        <Stepper.Step label="Asset Details" description="Basic information">
          <AssetDetailsStep form={form} />
        </Stepper.Step>

        {/* Step 2: Mediators & Auditors */}
        <Stepper.Step
          label="Access Control"
          description="Mediators and auditors"
        >
          <AccessControlStep form={form} />
        </Stepper.Step>

        {/* Step 3: Review */}
        <Stepper.Step label="Review" description="Confirm details">
          <ReviewStep form={form} />
        </Stepper.Step>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep} disabled={isSubmitting}>
            Back
          </Button>
        )}
        {active !== 2 ? (
          <Button onClick={nextStep} loading={isValidating}>
            Next step
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Create Asset
          </Button>
        )}
      </Group>
    </Modal>
  );
}
