/**
 * Create Settlement Modal
 *
 * Modal for creating confidential asset transfer instructions
 */

import { TruncatedKey } from '@/components';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import { getAccountAssetState } from '@/services/storage/assetStorage';
import { formatTokenAmount } from '@/utils/formatNumber';
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

interface SendSettlementModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SendSettlementModal({
  opened,
  onClose,
}: SendSettlementModalProps) {
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
  const [receiverAccountKey, setReceiverAccountKey] = useState('');
  const [receiverEncryptionKey, setReceiverEncryptionKey] = useState('');
  const [memo, setMemo] = useState('');
  const [isValidatingReceiver, setIsValidatingReceiver] = useState(false);
  const [receiverError, setReceiverError] = useState<string>('');

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
        setReceiverAccountKey('');
        setReceiverEncryptionKey('');
        setMemo('');
        setSettlementId('');
        setTxHash('');
        setBlockNumber(0);
        setIsValidatingReceiver(false);
        setReceiverError('');
      }, 200);
    }
  }, [opened]);

  // Validate receiver account key and fetch encryption key from chain
  useEffect(() => {
    const validateAndFetchReceiverKey = async () => {
      const trimmedKey = receiverAccountKey.trim();

      // Clear previous state
      setReceiverEncryptionKey('');
      setReceiverError('');

      // Only validate if we have exactly 64 hex characters (32 bytes)
      const cleanKey = trimmedKey.startsWith('0x')
        ? trimmedKey.slice(2)
        : trimmedKey;
      if (cleanKey.length !== 64) {
        if (trimmedKey.length > 0) {
          setReceiverError('Account key must be exactly 64 hex characters');
        }
        return;
      }

      // Validate hex format
      if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
        setReceiverError('Invalid hex format');
        return;
      }

      setIsValidatingReceiver(true);

      try {
        if (!polkadotApi) {
          setReceiverError('API not connected');
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
          setReceiverError('Receiver account is not registered on-chain');
          return;
        }

        // Extract encryption key
        const encryptionKey = encryptionKeyOption.unwrap();
        setReceiverEncryptionKey(encryptionKey.toHex());
      } catch {
        setReceiverError('Failed to validate receiver account');
      } finally {
        setIsValidatingReceiver(false);
      }
    };

    validateAndFetchReceiverKey();
  }, [receiverAccountKey, polkadotApi]);

  // Get asset decimals for display
  const decimals = selectedAsset?.decimals || 0;

  // Validate amount against balance
  const amountError = (() => {
    if (!amount || !selectedAsset) return '';

    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) return 'Amount must be greater than 0';

    const balance = parseFloat(selectedAsset.balance || '0');
    const balanceInTokens = balance / Math.pow(10, decimals);

    if (numericAmount > balanceInTokens) {
      return `Insufficient balance. Available: ${formatTokenAmount(
        selectedAsset.balance || '0',
        decimals,
      )}`;
    }

    return '';
  })();

  // Validate step 1
  const canProceed =
    selectedAssetId &&
    amount &&
    parseFloat(amount) > 0 &&
    !amountError &&
    receiverAccountKey.trim() !== '' &&
    receiverEncryptionKey.trim() !== '' &&
    !receiverError &&
    !isValidatingReceiver;

  const handleSubmit = async () => {
    if (!canProceed) return;
    if (!selectedKey) {
      throw new Error('No sender key selected');
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

      // Build receiver AccountPublicKeys from hex strings
      const receiverPublicKeys = AccountPublicKeys.fromJs({
        accountPublicKey: receiverAccountKey,
        encryptionPublicKey: receiverEncryptionKey,
      });

      // Build sender AccountPublicKeys from hex strings
      const senderPublicKeys = AccountPublicKeys.fromJs({
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
            receiverPublicKeys,
            senderPublicKeys,
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
      title="Send Assets"
      size="lg"
      closeOnClickOutside={!isProcessing}
      closeOnEscape={!isProcessing}
    >
      <Stepper active={activeStep} orientation="vertical">
        {/* Step 1: Configure Transfer */}
        <Stepper.Step
          label="Configure Send"
          description="Set up the outbound transfer"
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
                  label="Asset to Send"
                  placeholder="Select asset to send"
                  data={registeredAssets.map((asset) => ({
                    value: asset.assetId,
                    label: asset.name
                      ? `${asset.name} (${
                          asset.symbol || asset.assetId
                        })`
                      : `Asset ${asset.assetId}`,
                  }))}
                  value={selectedAssetId}
                  onChange={(value) => setSelectedAssetId(value || '')}
                  required
                  searchable
                />

                {/* Show balance if asset selected */}
                {selectedAsset && (
                  <Alert
                    color="blue"
                    variant="light"
                    styles={{ message: { padding: 0 } }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" fw={500}>
                        Available Balance:
                      </Text>
                      <Text size="sm" fw={600} c="blue.7">
                        {formatTokenAmount(
                          selectedAsset.balance || '0',
                          decimals,
                        )}{' '}
                        {selectedAsset.symbol || 'tokens'}
                      </Text>
                    </Group>
                  </Alert>
                )}
                {/* Amount */}
                <NumberInput
                  label="Amount to Send"
                  placeholder="Enter amount to send"
                  value={amount}
                  onChange={(value) => setAmount(value.toString())}
                  required
                  min={0}
                  step={decimals > 0 ? Math.pow(10, -decimals) : 1}
                  decimalScale={decimals}
                  allowNegative={false}
                  disabled={!selectedAssetId}
                  error={amountError}
                  description={
                    selectedAsset
                      ? `Smallest unit: ${Math.pow(10, -decimals)} ${
                          selectedAsset.symbol || 'tokens'
                        }`
                      : undefined
                  }
                />

                {/* Receiver Account Public Key */}
                <TextInput
                  label="Receiver Account Public Key"
                  placeholder="0x..."
                  value={receiverAccountKey}
                  onChange={(e) => setReceiverAccountKey(e.target.value)}
                  required
                  description="The receiver's account public key (64 hex chars)"
                  error={receiverError}
                  rightSection={
                    isValidatingReceiver ? (
                      <Loader size="xs" />
                    ) : receiverEncryptionKey ? (
                      <IconCheck size={16} color="green" />
                    ) : null
                  }
                />

                {/* Show encryption key (auto-fetched) */}
                {receiverEncryptionKey && (
                  <Card withBorder padding="sm">
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed">
                        Encryption key retrieved from chain
                      </Text>
                      <TruncatedKey
                        value={receiverEncryptionKey}
                        label="Encryption Key"
                      />
                    </Stack>
                  </Card>
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
                    Send Assets
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Stepper.Step>

        {/* Step 2: Processing */}
        <Stepper.Step label="Processing" description="Sending assets...">
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
        <Stepper.Step label="Complete" description="Assets sent">
          <Stack align="center" py={40} gap="lg">
            <IconCheck size={64} color="green" stroke={1.5} />
            <Text size="lg" fw={500}>
              Transfer Instruction Created!
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
                        {selectedAsset?.name || selectedAssetId}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" c="dimmed" style={{ minWidth: '120px' }}>
                        Amount:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {amount} {selectedAsset?.symbol || 'tokens'}
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
                <Text size="sm">
                  1. Share the Transfer ID with the receiver
                </Text>
                <Text size="sm">2. Both parties must affirm the transfer</Text>
                <Text size="sm">
                  3. After affirmation, the receiver can claim the assets
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
