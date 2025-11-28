import { TruncatedKey } from '@/components';
import { AccountKeyInput } from '@/components/settlement';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import { useSettlementFormReset } from '@/hooks/useSettlementFormReset';
import { formatTokenAmount } from '@/utils/formatNumber';
import { toSmallestUnit } from '@/utils/tokenAmount';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { AccountPublicKeys } from '@polymesh/polymesh-dart-wasm';
import {
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

interface Leg {
  assetId: string;
  amount: string;
  senderAccountKey: string;
  receiverAccountKey: string;
  // Derived/Fetched data
  assetName?: string;
  assetTicker?: string;
  assetDecimals?: number;
  senderEncryptionKey?: string;
  receiverEncryptionKey?: string;
  isSenderUser?: boolean;
  isReceiverUser?: boolean;
  assetExists?: boolean;
}

interface FormValues {
  legs: Leg[];
  memo: string;
}

interface MultiLegSettlementModalProps {
  opened: boolean;
  onClose: () => void;
}

export function MultiLegSettlementModal({
  opened,
  onClose,
}: MultiLegSettlementModalProps) {
  const { registeredAssets, getAssetDetails } = useAsset();
  const { selectedKey } = useConfidentialKey();
  const { polkadotApi } = usePolymesh();
  const { createSettlement } = useSettlement();

  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [settlementId, setSettlementId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [blockNumber, setBlockNumber] = useState<number>(0);

  // Loading states for async validation
  const [validatingAssets, setValidatingAssets] = useState<
    Record<number, boolean>
  >({});

  const form = useForm<FormValues>({
    initialValues: {
      legs: [
        {
          assetId: '',
          amount: '',
          senderAccountKey: '',
          receiverAccountKey: '',
        },
      ],
      memo: '',
    },
    validate: {
      legs: {
        assetId: (value, values, path) => {
          if (!value) return 'Asset ID is required';
          if (!/^\d+$/.test(value)) return 'Asset ID must be a number';
          const index = parseInt(path.split('.')[1]);
          if (values.legs[index].assetExists === false)
            return 'Asset does not exist';
          return null;
        },
        amount: (value, values, path) => {
          if (!value) return 'Amount is required';
          const amount = parseFloat(value);
          if (isNaN(amount) || amount <= 0)
            return 'Amount must be greater than 0';

          const index = parseInt(path.split('.')[1]);
          const leg = values.legs[index];

          // Check balance if sender is user
          if (leg.isSenderUser && leg.assetId) {
            const asset = registeredAssets.find(
              (a) => a.assetId === leg.assetId,
            );
            if (asset && asset.balance) {
              const decimals = leg.assetDecimals || 0;
              const balance =
                parseFloat(asset.balance) / Math.pow(10, decimals);
              if (amount > balance) {
                return `Insufficient balance. Available: ${formatTokenAmount(asset.balance, decimals)}`;
              }
            }
          }
          return null;
        },
        senderAccountKey: (value, values, path) => {
          if (!value) return 'Sender account key is required';

          // Check if sender and receiver are the same
          const legIndex = parseInt(path.split('.')[1]);
          const receiverKey = values.legs[legIndex]?.receiverAccountKey;
          if (receiverKey) {
            const cleanKey = value.startsWith('0x') ? value.slice(2) : value;
            const cleanReceiverKey = receiverKey.startsWith('0x')
              ? receiverKey.slice(2)
              : receiverKey;
            if (cleanKey.toLowerCase() === cleanReceiverKey.toLowerCase()) {
              return 'Sender and receiver cannot be the same account';
            }
          }
          return null;
        },
        receiverAccountKey: (value, values, path) => {
          if (!value) return 'Receiver account key is required';

          // Check if sender and receiver are the same
          const legIndex = parseInt(path.split('.')[1]);
          const senderKey = values.legs[legIndex]?.senderAccountKey;
          if (senderKey) {
            const cleanKey = value.startsWith('0x') ? value.slice(2) : value;
            const cleanSenderKey = senderKey.startsWith('0x')
              ? senderKey.slice(2)
              : senderKey;
            if (cleanKey.toLowerCase() === cleanSenderKey.toLowerCase()) {
              return 'Sender and receiver cannot be the same account';
            }
          }
          return null;
        },
      },
    },
  });

  const {
    values: formValues,
    errors,
    insertListItem,
    removeListItem,
    setFieldValue,
    setFieldError,
    clearFieldError,
    validate,
    reset,
    getInputProps,
  } = form;
  // Form reset is handled in handleClose

  const addLeg = () => {
    insertListItem('legs', {
      assetId: '',
      amount: '',
      senderAccountKey: '',
      receiverAccountKey: '',
    });
  };

  const removeLeg = (index: number) => {
    removeListItem('legs', index);
  };

  // Async Validation Helpers
  const validateAsset = async (index: number, assetId: string) => {
    if (!assetId || !/^\d+$/.test(assetId)) return;

    setValidatingAssets((prev) => ({ ...prev, [index]: true }));
    try {
      // Use getAssetDetails from useAsset hook which properly decodes metadata
      const assetDetails = await getAssetDetails(assetId);

      if (!assetDetails) {
        setFieldValue(`legs.${index}.assetExists`, false);
        setFieldError(`legs.${index}.assetId`, 'Asset does not exist on chain');
        setFieldValue(`legs.${index}.assetName`, undefined);
        setFieldValue(`legs.${index}.assetTicker`, undefined);
        setFieldValue(`legs.${index}.assetDecimals`, undefined);
      } else {
        setFieldValue(`legs.${index}.assetExists`, true);
        setFieldValue(`legs.${index}.assetName`, assetDetails.metadata?.name);
        setFieldValue(
          `legs.${index}.assetTicker`,
          assetDetails.metadata?.symbol,
        );
        setFieldValue(
          `legs.${index}.assetDecimals`,
          assetDetails.metadata?.decimals,
        );
        clearFieldError(`legs.${index}.assetId`);

        // Clear amount to avoid decimal mismatch when asset changes
        setFieldValue(`legs.${index}.amount`, '');

        // Revalidate sender/receiver asset registration if they're already filled
        const leg = formValues.legs[index];
        if (leg.senderAccountKey && leg.senderEncryptionKey) {
          const senderKey = leg.senderAccountKey.startsWith('0x')
            ? leg.senderAccountKey
            : `0x${leg.senderAccountKey}`;
          checkAssetRegistration(index, 'sender', senderKey, assetId);
        }
        if (leg.receiverAccountKey && leg.receiverEncryptionKey) {
          const receiverKey = leg.receiverAccountKey.startsWith('0x')
            ? leg.receiverAccountKey
            : `0x${leg.receiverAccountKey}`;
          checkAssetRegistration(index, 'receiver', receiverKey, assetId);
        }
      }
    } catch (error) {
      console.error('Asset validation error', error);
      setFieldError(`legs.${index}.assetId`, 'Failed to validate asset');
    } finally {
      setValidatingAssets((prev) => ({ ...prev, [index]: false }));
    }
  };

  const checkAssetRegistration = async (
    index: number,
    field: 'sender' | 'receiver',
    accountKey: string,
    assetId: string,
  ) => {
    if (!polkadotApi) return;
    try {
      const isRegistered =
        await polkadotApi.query.confidentialAssets.accountAssetRegistrations(
          accountKey,
          parseInt(assetId, 10),
        );
      if (isRegistered.isFalse) {
        setFieldError(
          `legs.${index}.${field}AccountKey`,
          `${field === 'sender' ? 'Sender' : 'Receiver'} not registered for asset ${assetId}`,
        );
      } else {
        // Clear the error if they are registered
        clearFieldError(`legs.${index}.${field}AccountKey`);
      }
    } catch (e) {
      console.error('Failed to check asset registration', e);
    }
  };

  const handleEncryptionKeyChange = (
    index: number,
    field: 'sender' | 'receiver',
    key: string | undefined,
  ) => {
    const keyField = `${field}EncryptionKey` as const;
    const userField = field === 'sender' ? 'isSenderUser' : 'isReceiverUser';

    setFieldValue(`legs.${index}.${keyField}`, key);

    if (key) {
      // Check asset registration
      const assetId = formValues.legs[index].assetId;
      if (assetId && /^\d+$/.test(assetId)) {
        const accountKey =
          field === 'sender'
            ? formValues.legs[index].senderAccountKey
            : formValues.legs[index].receiverAccountKey;

        const accountKeyWithPrefix = accountKey.startsWith('0x')
          ? accountKey
          : `0x${accountKey}`;
        checkAssetRegistration(index, field, accountKeyWithPrefix, assetId);
      }

      // Check if user
      const isUser = !!(selectedKey && selectedKey.encryptionPublicKey === key);
      setFieldValue(`legs.${index}.${userField}`, isUser);
    } else {
      setFieldValue(`legs.${index}.${userField}`, false);
    }
  };

  const handleAssetIdChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    getInputProps(`legs.${index}.assetId`).onChange(e);
    // Clear asset metadata and amount when asset field is cleared
    if (!e.target.value) {
      setFieldValue(`legs.${index}.assetExists`, false);
      setFieldValue(`legs.${index}.assetName`, undefined);
      setFieldValue(`legs.${index}.assetTicker`, undefined);
      setFieldValue(`legs.${index}.assetDecimals`, undefined);
      setFieldValue(`legs.${index}.amount`, '');
    }
    validateAsset(index, e.target.value);
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (validation.hasErrors) return;

    if (!selectedKey || !polkadotApi) {
      return;
    }

    // Ensure all legs have been validated and have encryption keys
    let hasMissingKeys = false;
    formValues.legs.forEach((leg, index) => {
      if (!leg.senderEncryptionKey) {
        setFieldError(
          `legs.${index}.senderAccountKey`,
          'Account validation required',
        );
        hasMissingKeys = true;
      }
      if (!leg.receiverEncryptionKey) {
        setFieldError(
          `legs.${index}.receiverAccountKey`,
          'Account validation required',
        );
        hasMissingKeys = true;
      }
    });

    if (hasMissingKeys) return;

    setIsProcessing(true);
    setActiveStep(1);

    try {
      // Helper to ensure hex strings have 0x prefix
      const formatKey = (key: string) =>
        key.startsWith('0x') ? key : `0x${key}`;

      // Prepare legs
      const legsParams = formValues.legs.map((leg) => {
        // Build sender AccountPublicKeys from hex strings
        const senderPublicKeys = AccountPublicKeys.fromJs({
          accountPublicKey: formatKey(leg.senderAccountKey),
          encryptionPublicKey: formatKey(leg.senderEncryptionKey!),
        });

        // Build receiver AccountPublicKeys from hex strings
        const receiverPublicKeys = AccountPublicKeys.fromJs({
          accountPublicKey: formatKey(leg.receiverAccountKey),
          encryptionPublicKey: formatKey(leg.receiverEncryptionKey!),
        });

        return {
          assetId: leg.assetId,
          amount: toSmallestUnit(leg.amount, leg.assetDecimals || 0),
          senderPublicKeys,
          receiverPublicKeys,
        };
      });

      const result = await createSettlement({
        legs: legsParams,
        memo: formValues.memo || undefined,
        onProgress: setProgressMessage,
      });

      setSettlementId(result.settlementId);
      setTxHash(result.txHash);
      setBlockNumber(result.blockNumber);
      setActiveStep(2);
    } catch (error) {
      console.error('Submission failed', error);
      setActiveStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  // Form reset is handled in handleClose
  useSettlementFormReset(opened, () => {
    reset();
    setActiveStep(0);
    setSettlementId('');
    setTxHash('');
    setBlockNumber(0);
    setProgressMessage('');
  });

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Multi-Leg Transfer"
      size="lg"
      closeOnClickOutside={!isProcessing}
      closeOnEscape={!isProcessing}
    >
      <Stepper active={activeStep} orientation="vertical">
        <Stepper.Step
          label="Configure Legs"
          description="Define the transfer legs"
        >
          <Stack gap="md" mt="md">
            {formValues.legs.map((leg, index) => (
              <Paper key={index} withBorder p="md" radius="md">
                <Group justify="space-between" mb="sm">
                  <Badge size="lg" variant="light">
                    Leg {index + 1}
                  </Badge>
                  {formValues.legs.length > 1 && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeLeg(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>

                <Stack gap="sm">
                  <Group grow align="flex-start">
                    <Stack gap={4}>
                      <TextInput
                        label="Asset ID"
                        placeholder="e.g. 123"
                        required
                        {...getInputProps(`legs.${index}.assetId`)}
                        onChange={(e) => handleAssetIdChange(index, e)}
                        // onBlur={(e) => {
                        //   getInputProps(`legs.${index}.assetId`).onBlur(e);
                        // }}
                        rightSection={
                          validatingAssets[index] ? (
                            <Loader size="xs" />
                          ) : leg.assetExists ? (
                            <IconCheck size={16} color="green" />
                          ) : errors[`legs.${index}.assetId`] ? (
                            <IconX size={16} color="red" />
                          ) : null
                        }
                      />
                      {leg.assetExists &&
                        (leg.assetName || leg.assetTicker) && (
                          <Text size="xs" c="dimmed" mt={-4}>
                            {leg.assetName || 'Asset exists'}
                            {leg.assetTicker && (
                              <Text span fw={500} ml={4}>
                                ({leg.assetTicker})
                              </Text>
                            )}
                            {leg.assetDecimals !== undefined && (
                              <Text span ml={4}>
                                • {leg.assetDecimals} decimals
                              </Text>
                            )}
                          </Text>
                        )}
                    </Stack>
                    <NumberInput
                      label="Amount"
                      placeholder="0.00"
                      required
                      min={0}
                      hideControls
                      decimalScale={leg.assetDecimals}
                      disabled={!leg.assetExists}
                      {...getInputProps(`legs.${index}.amount`)}
                    />
                  </Group>

                  {/* Sender */}
                  <AccountKeyInput
                    label="Sender"
                    placeholder="Sender's Account Public Key (0x...)"
                    onChange={
                      getInputProps(`legs.${index}.senderAccountKey`).onChange
                    }
                    value={formValues.legs[index].senderAccountKey}
                    onEncryptionKeyChange={(key) =>
                      handleEncryptionKeyChange(index, 'sender', key)
                    }
                    error={errors[`legs.${index}.senderAccountKey`] as string}
                  />

                  {/* Receiver */}
                  <AccountKeyInput
                    label="Receiver"
                    placeholder="Receiver's Account Public Key (0x...)"
                    onChange={
                      getInputProps(`legs.${index}.receiverAccountKey`).onChange
                    }
                    value={formValues.legs[index].receiverAccountKey}
                    onEncryptionKeyChange={(key) =>
                      handleEncryptionKeyChange(index, 'receiver', key)
                    }
                    error={errors[`legs.${index}.receiverAccountKey`] as string}
                  />
                </Stack>
              </Paper>
            ))}

            <Button
              variant="outline"
              leftSection={<IconPlus size={16} />}
              onClick={addLeg}
              fullWidth
            >
              Add Another Leg
            </Button>

            <Textarea
              label="Memo"
              placeholder="Optional memo for the settlement"
              {...getInputProps('memo')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={isProcessing}>
                Submit
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Processing" description="Submitting transaction">
          <Stack align="center" py={40}>
            <Loader size="lg" />
            <Text size="sm" c="dimmed">
              {progressMessage || 'Processing settlement...'}
            </Text>
            <Text size="xs" c="dimmed" ta="center" maw={400}>
              This may take a moment. Please do not close this window.
            </Text>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Complete" description="Settlement created">
          <Stack align="center" py={40} gap="lg">
            <IconCheck size={64} color="green" stroke={1.5} />
            <Text size="lg" fw={500}>
              Settlement Instruction Created!
            </Text>

            <Stack gap="md" w="100%">
              <Card withBorder p="md">
                <Stack gap="sm">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Settlement Details
                  </Text>
                  <Stack gap="xs">
                    <TruncatedKey value={settlementId} label="Settlement ID" />
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Legs:
                      </Text>
                      <Text size="sm" fw={500}>
                        {formValues.legs.length}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>

              <Card withBorder p="md">
                <Stack gap="sm">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Transaction Details
                  </Text>
                  <Stack gap="xs">
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>
                        Transaction Hash
                      </Text>
                      <TruncatedKey value={txHash} />
                    </div>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Block Number:
                      </Text>
                      <Text size="sm" fw={500}>
                        {blockNumber}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </Stack>

            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Next Steps"
              color="blue"
            >
              <Stack gap="xs">
                <Text size="sm">
                  1. Share the Settlement ID with all counterparties
                </Text>
                <Text size="sm">
                  2. Counterparties must affirm the settlement
                </Text>
                <Text size="sm">
                  3. Once all parties affirm, the settlement can be finalized
                </Text>
              </Stack>
            </Alert>

            <Button onClick={handleClose} fullWidth>
              Close
            </Button>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
