/**
 * Receive Settlement Modal
 *
 * Modal for creating confidential asset transfer instructions as the receiver
 */

import { TruncatedKey } from '@/components';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import { getAccountAssetState } from '@/services/storage/assetStorage';
import { toSmallestUnit } from '@/utils/tokenAmount';
import {
  Alert,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { AccountPublicKeys } from '@polymesh/polymesh-dart-wasm';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconCheck,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ReceiveSettlementModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ReceiveSettlementModal({
  opened,
  onClose,
}: ReceiveSettlementModalProps) {
  const { registeredAssets } = useAsset();
  const { createSettlement } = useSettlement();
  const { selectedKey } = useConfidentialKey();
  const { polkadotApi } = usePolymesh();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  // Step 1: Transfer details
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [senderAccountKey, setSenderAccountKey] = useState('');
  const [senderEncryptionKey, setSenderEncryptionKey] = useState('');
  const [memo, setMemo] = useState('');
  const [isValidatingSender, setIsValidatingSender] = useState(false);
  const [senderError, setSenderError] = useState<string>('');
  const [isSenderRegisteredForAsset, setIsSenderRegisteredForAsset] =
    useState(false);
  const [isCheckingAssetRegistration, setIsCheckingAssetRegistration] =
    useState(false);

  // Result data
  const [settlementId, setSettlementId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [blockNumber, setBlockNumber] = useState<number>(0);

  // Get selected asset details
  const selectedAsset = registeredAssets.find(
    (a) => a.assetId === selectedAssetId,
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setActiveStep(0);
        setIsProcessing(false);
        setProgressMessage('');
        setSelectedAssetId('');
        setAmount('');
        setSenderAccountKey('');
        setSenderEncryptionKey('');
        setMemo('');
        setSettlementId('');
        setTxHash('');
        setBlockNumber(0);
        setIsValidatingSender(false);
        setSenderError('');
      }, 200);
    }
  }, [opened]);

  // Validate sender account key and fetch encryption key from chain
  useEffect(() => {
    const validateAndFetchSenderKey = async () => {
      const trimmedKey = senderAccountKey.trim();

      // Clear previous state
      setSenderEncryptionKey('');
      setSenderError('');

      // Only validate if we have exactly 64 hex characters (32 bytes)
      const cleanKey = trimmedKey.startsWith('0x')
        ? trimmedKey.slice(2)
        : trimmedKey;
      if (cleanKey.length !== 64) {
        if (trimmedKey.length > 0) {
          setSenderError('Account key must be exactly 64 hex characters');
        }
        return;
      }

      // Validate hex format
      if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
        setSenderError('Invalid hex format');
        return;
      }

      setIsValidatingSender(true);

      try {
        if (!polkadotApi) {
          setSenderError('API not connected');
          return;
        }

        // Query the encryption key from chain
        const accountKeyWithPrefix = trimmedKey.startsWith('0x')
          ? trimmedKey
          : `0x${trimmedKey}`;
        const encryptionKeyOption =
          await polkadotApi.query.confidentialAssets.accountEncryptionKey(
            accountKeyWithPrefix,
          );

        if (encryptionKeyOption.isNone || encryptionKeyOption.isEmpty) {
          setSenderError('Sender account is not registered on-chain');
          return;
        }

        // Extract encryption key
        const encryptionKey = encryptionKeyOption.unwrap();
        setSenderEncryptionKey(encryptionKey.toHex());
      } catch {
        setSenderError('Failed to validate sender account');
      } finally {
        setIsValidatingSender(false);
      }
    };

    validateAndFetchSenderKey();
  }, [senderAccountKey, polkadotApi]);

  // Check if sender is registered for the selected asset
  useEffect(() => {
    const checkSenderAssetRegistration = async () => {
      // Reset state
      setIsSenderRegisteredForAsset(false);

      // Only check if we have both a validated sender and a selected asset
      if (!senderEncryptionKey || !selectedAssetId || !polkadotApi) {
        return;
      }

      setIsCheckingAssetRegistration(true);

      try {
        const accountKeyWithPrefix = senderAccountKey.startsWith('0x')
          ? senderAccountKey
          : `0x${senderAccountKey}`;

        // Query if sender is registered for this asset
        const isRegistered =
          await polkadotApi.query.confidentialAssets.accountAssetRegistrations(
            accountKeyWithPrefix,
            parseInt(selectedAssetId, 10),
          );

        const registered = isRegistered.isTrue;
        setIsSenderRegisteredForAsset(registered);
      } catch (err) {
        console.error('Failed to check sender asset registration:', err);
      } finally {
        setIsCheckingAssetRegistration(false);
      }
    };

    checkSenderAssetRegistration();
  }, [senderEncryptionKey, selectedAssetId, polkadotApi, senderAccountKey]);

  // Get asset decimals for display
  const decimals = selectedAsset?.metadata?.decimals || 0;

  // Validate step 1
  const canProceed =
    selectedAssetId &&
    amount &&
    parseFloat(amount) > 0 &&
    senderAccountKey.trim() !== '' &&
    senderEncryptionKey.trim() !== '' &&
    !senderError &&
    !isValidatingSender &&
    isSenderRegisteredForAsset &&
    !isCheckingAssetRegistration;

  const handleSubmit = async () => {
    if (!canProceed) return;
    if (!selectedKey) {
      throw new Error('No receiver key selected');
    }

    setIsProcessing(true);
    setActiveStep(1);

    try {
      // Get stored account asset state to verify registration
      setProgressMessage('Verifying asset registration...');
      const storedState = getAccountAssetState(
        selectedKey.publicKey,
        selectedAssetId,
      );

      if (!storedState) {
        throw new Error(
          'Account not registered with this asset. Please register first.',
        );
      }

      // Get asset details from selected asset (already includes mediators and auditors)
      if (!selectedAsset) {
        throw new Error('Selected asset not found.');
      }

      // Build sender AccountPublicKeys from hex strings
      const senderPublicKeys = AccountPublicKeys.fromJs({
        accountPublicKey: senderAccountKey,
        encryptionPublicKey: senderEncryptionKey,
      });

      // Build receiver AccountPublicKeys from hex strings
      const receiverPublicKeys = AccountPublicKeys.fromJs({
        accountPublicKey: selectedKey.publicKey,
        encryptionPublicKey: selectedKey.encryptionPublicKey,
      });

      // Convert amount from decimal to smallest unit
      // e.g., 5.5 with 6 decimals = 5.5 * 10^6 = 5500000
      const amountInSmallestUnit = toSmallestUnit(amount, decimals);

      // Create settlement
      setProgressMessage('Creating transfer instruction...');
      const result = await createSettlement({
        legs: [
          {
            assetId: selectedAssetId,
            amount: amountInSmallestUnit,
            senderPublicKeys,
            receiverPublicKeys,
          },
        ],
        memo: memo || undefined,
        onProgress: (step) => {
          setProgressMessage(step);
        },
      });

      setSettlementId(result.settlementId);
      setTxHash(result.txHash);
      setBlockNumber(result.blockNumber);
      setActiveStep(2);
    } catch {
      // Error is already shown in notification by provider
      // Reset to step 1 to allow retry
      setActiveStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Receive Assets"
      size="lg"
      closeOnClickOutside={!isProcessing}
      closeOnEscape={!isProcessing}
    >
      <Stepper active={activeStep} orientation="vertical">
        {/* Step 1: Configure Transfer */}
        <Stepper.Step
          label="Configure Receive"
          description="Set up the inbound transfer"
        >
          <Stack gap="md" mt="md">
            {registeredAssets.length === 0 ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="No Assets Available"
                color="yellow"
              >
                You need to register for at least one asset before creating a
                transfer. Visit the Asset Management page to register for
                assets.
              </Alert>
            ) : (
              <>
                {/* Asset Selection */}
                <Select
                  label="Asset to Receive"
                  description="Only assets that you are registered for will be shown"
                  placeholder="Select asset to receive"
                  data={registeredAssets.map((asset) => ({
                    value: asset.assetId,
                    label: asset.metadata?.name
                      ? `${asset.metadata.name} (${
                          asset.metadata.symbol || asset.assetId
                        })`
                      : `Asset ${asset.assetId}`,
                  }))}
                  value={selectedAssetId}
                  onChange={(value) => setSelectedAssetId(value || '')}
                  required
                  searchable
                />

                {/* Amount */}
                <NumberInput
                  label="Amount to Receive"
                  placeholder="Enter amount to receive"
                  value={amount}
                  onChange={(value) => setAmount(value.toString())}
                  required
                  min={0}
                  step={decimals > 0 ? Math.pow(10, -decimals) : 1}
                  decimalScale={decimals}
                  allowNegative={false}
                  disabled={!selectedAssetId}
                  description={
                    selectedAsset
                      ? `Smallest unit: ${Math.pow(10, -decimals)} ${
                          selectedAsset.metadata?.symbol || 'tokens'
                        }`
                      : undefined
                  }
                />

                {/* Sender Account Public Key */}
                <TextInput
                  label="Sender Account Public Key"
                  placeholder="0x..."
                  value={senderAccountKey}
                  onChange={(e) => setSenderAccountKey(e.target.value)}
                  required
                  description="The sender's account public key (64 hex chars)"
                  error={senderError}
                  rightSection={
                    isValidatingSender ? (
                      <Loader size="xs" />
                    ) : senderEncryptionKey ? (
                      <IconCheck size={16} color="green" />
                    ) : null
                  }
                />

                {/* Show encryption key (auto-fetched) */}
                {senderEncryptionKey && (
                  <Card withBorder padding="sm">
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed">
                        Encryption key retrieved from chain
                      </Text>
                      <TruncatedKey
                        value={senderEncryptionKey}
                        label="Encryption Key"
                      />
                    </Stack>
                  </Card>
                )}

                {/* Asset registration warning - only show if not registered */}
                {senderEncryptionKey &&
                  selectedAssetId &&
                  !isCheckingAssetRegistration &&
                  !isSenderRegisteredForAsset && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      color="red"
                      variant="light"
                    >
                      <Text size="sm">
                        Sender is not registered for this asset so does not have
                        a balance to send
                      </Text>
                    </Alert>
                  )}

                {/* Memo */}
                <Textarea
                  label="Memo (max 256 characters)"
                  placeholder="Add a note about this transfer..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  minRows={2}
                  maxRows={4}
                  maxLength={256}
                  description="Memos are publicly visible on chain"
                  descriptionProps={{ c: 'red' }}
                />

                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="blue"
                  variant="light"
                >
                  <Text size="sm">
                    You are creating a transfer request as the receiver. The
                    sender will need to affirm and send the assets to you.
                  </Text>
                </Alert>

                {/* Action Buttons */}
                <Group justify="flex-end" mt="md">
                  <Button variant="subtle" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed}
                    leftSection={<IconArrowsExchange size={16} />}
                  >
                    Request Assets
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Stepper.Step>

        {/* Step 2: Processing */}
        <Stepper.Step label="Processing" description="Creating request...">
          <Stack align="center" py={40}>
            <Loader size="lg" />
            <Text size="sm" c="dimmed">
              {progressMessage || 'Processing...'}
            </Text>
            <Text size="xs" c="dimmed" ta="center" maw={400}>
              This may take a moment. Please do not close this window.
            </Text>
          </Stack>
        </Stepper.Step>

        {/* Step 3: Complete */}
        <Stepper.Step label="Complete" description="Request created">
          <Stack align="center" py={40} gap="lg">
            <IconCheck size={64} color="green" stroke={1.5} />
            <Text size="lg" fw={500}>
              Transfer Request Created!
            </Text>

            <Stack gap="md" w="100%">
              <Card withBorder p="md">
                <Stack gap="sm">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Transfer Details
                  </Text>
                  <Stack gap="xs">
                    <TruncatedKey value={settlementId} label="Transfer ID" />
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" c="dimmed" style={{ minWidth: '120px' }}>
                        Asset:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {selectedAsset?.metadata?.name || selectedAssetId}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" c="dimmed" style={{ minWidth: '120px' }}>
                        Amount:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {amount} {selectedAsset?.metadata?.symbol || 'tokens'}
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
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" c="dimmed" style={{ minWidth: '120px' }}>
                        Block Number:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {blockNumber.toLocaleString()}
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
                <Text size="sm">1. Share the Transfer ID with the sender</Text>
                <Text size="sm">
                  2. The sender must affirm and send the assets
                </Text>
                <Text size="sm">
                  3. After the sender affirms, you can affirm as receiver
                </Text>
                <Text size="sm">
                  4. Once both affirm, you can claim the assets
                </Text>
              </Stack>
            </Alert>

            <Group mt="md">
              <Button onClick={handleClose} variant="light" fullWidth>
                Close
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
