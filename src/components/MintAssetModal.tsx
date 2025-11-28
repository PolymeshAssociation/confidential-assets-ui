/**
 * Mint Asset Modal
 *
 * Modal for minting tokens for a confidential asset
 */

import { TruncatedKey } from '@/components';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import {
  Alert,
  Button,
  Code,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useState } from 'react';

interface MintAssetModalProps {
  opened: boolean;
  onClose: () => void;
  assetId: string;
  assetName?: string;
  decimals?: number;
}

export function MintAssetModal({
  opened,
  onClose,
  assetId,
  assetName,
  decimals = 6,
}: MintAssetModalProps) {
  const [active, setActive] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState<string>('');
  const [progressDetails, setProgressDetails] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const { mintAsset, refreshOwnedAssets, refreshRegisteredAssets } = useAsset();
  const { selectedKey } = useConfidentialKey();

  const handleMint = async () => {
    if (!amount || Number(amount) <= 0) return;

    setIsMinting(true);
    setActive(1);
    setProgressDetails('');

    try {
      // Scale the amount by decimals to get the raw integer value
      // e.g., if user enters 10.5 with decimals=2, we send 1050
      const scaledAmount = Math.floor(Number(amount) * Math.pow(10, decimals));

      const result = await mintAsset({
        assetId,
        amount: String(scaledAmount),
        onProgress: (step) => {
          setMintingStep(step);

          // Provide more detailed user-friendly descriptions
          if (step.includes('Generating proof')) {
            setProgressDetails(
              'Generating zero-knowledge proof (includes fetching curve tree data from blockchain)... This is computationally intensive and may take some time.',
            );
          } else if (step.includes('Submitting transaction')) {
            setProgressDetails(
              'Broadcasting transaction to blockchain and waiting for confirmation...',
            );
          } else {
            setProgressDetails(step);
          }
        },
      });

      // Store transaction result
      setTxHash(result.txHash);
      setBlockNumber(result.blockNumber);

      // Refresh assets to update total supply and balances
      await Promise.all([refreshOwnedAssets(), refreshRegisteredAssets()]);

      // Success - move to completion step
      setActive(2);
    } catch (error) {
      console.error('Minting failed:', error);
      // Close modal on error or cancellation
      setIsMinting(false);
      setActive(0);
      setAmount('');
      setMintingStep('');
      setProgressDetails('');
      setTxHash('');
      setBlockNumber(0);
      onClose();
      return;
    } finally {
      setIsMinting(false);
    }
  };

  const handleClose = () => {
    if (!isMinting) {
      setActive(0);
      setAmount('');
      setMintingStep('');
      setProgressDetails('');
      setTxHash('');
      setBlockNumber(0);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Mint Tokens"
      size="md"
      closeOnClickOutside={!isMinting}
      closeOnEscape={!isMinting}
    >
      <Stepper active={active} orientation="vertical">
        {/* Step 1: Enter Amount */}
        <Stepper.Step
          label="Enter Amount"
          description="Specify how many tokens to mint"
        >
          <Stack gap="md" mt="md">
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                Minting creates new tokens and adds them to your confidential
                balance. This operation requires generating a zero-knowledge
                proof.
              </Text>
            </Alert>

            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Asset
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    {assetName || 'Unknown Asset'}
                  </Text>
                  <Code style={{ fontSize: '11px' }}>ID: {assetId}</Code>
                </Group>
              </Stack>
            </Paper>

            {selectedKey ? (
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Minting to Account
                    </Text>
                    <IconCheck size={16} color="green" />
                  </Group>
                  <Text size="sm" c="dimmed" mb={4}>
                    {selectedKey.alias}
                  </Text>
                  <TruncatedKey value={selectedKey.publicKey} />
                </Stack>
              </Paper>
            ) : (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
              >
                No confidential key selected. Please select a key first.
              </Alert>
            )}

            <NumberInput
              label="Amount"
              placeholder="Enter amount to mint"
              description={`Number of tokens (with ${decimals} decimal places)`}
              value={amount}
              onChange={setAmount}
              min={0}
              step={1 / Math.pow(10, decimals)}
              decimalScale={decimals}
              hideControls
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleMint}
                disabled={!selectedKey || !amount || Number(amount) <= 0}
              >
                Mint Tokens
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* Step 2: Minting */}
        <Stepper.Step
          label="Minting"
          description="Processing minting operation"
          loading={isMinting}
        >
          <Stack gap="md" mt="md" py="xl">
            <Group justify="center">
              <Loader size="lg" />
            </Group>

            <div style={{ textAlign: 'center' }}>
              <Text size="sm" fw={500} mb="xs">
                Minting {amount} tokens...
              </Text>
              {mintingStep && (
                <Text size="sm" c="blue" fw={500} mb="xs">
                  {mintingStep}
                </Text>
              )}
              {progressDetails && (
                <Text size="xs" c="dimmed">
                  {progressDetails}
                </Text>
              )}
            </div>

            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="xs" fw={500} mb="xs">
                Minting Process:
              </Text>
              <Stack gap={4}>
                <Text size="xs">
                  1. Generate zero-knowledge proof (fetches curve tree data and
                  computes proof)
                </Text>
                <Text size="xs">
                  2. Submit transaction and wait for blockchain confirmation
                </Text>
              </Stack>
              <Text size="xs" mt="xs" fs="italic">
                Proof generation is computationally intensive and may take
                several seconds. Please be patient.
              </Text>
            </Alert>
          </Stack>
        </Stepper.Step>

        {/* Step 3: Complete */}
        <Stepper.Step label="Complete" description="Tokens minted successfully">
          <Stack gap="md" mt="md" align="center" py="xl">
            <IconCheck size={64} color="green" stroke={1.5} />
            <div style={{ textAlign: 'center' }}>
              <Text size="lg" fw={500}>
                Minting Successful!
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                {amount} tokens have been minted to your account.
              </Text>
            </div>

            <Stack gap="md" w="100%">
              {selectedKey && (
                <Paper p="md" withBorder>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed" fw={500}>
                      Minted to Account
                    </Text>
                    <Text size="sm" fw={500}>
                      {selectedKey.alias}
                    </Text>
                    <TruncatedKey value={selectedKey.publicKey} />
                  </Stack>
                </Paper>
              )}

              {txHash && (
                <Paper p="md" withBorder>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed" fw={500}>
                      Transaction Details
                    </Text>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Transaction Hash
                      </Text>
                      <TruncatedKey value={txHash} />
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">
                        Block Number
                      </Text>
                      <Text size="sm" fw={500}>
                        {blockNumber.toLocaleString()}
                      </Text>
                    </div>
                  </Stack>
                </Paper>
              )}
            </Stack>

            <Group justify="center" mt="md">
              <Button onClick={handleClose}>Close</Button>
            </Group>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
