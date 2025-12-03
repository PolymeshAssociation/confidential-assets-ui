/**
 * Register by Asset ID Modal
 *
 * Modal for registering an account with a confidential asset by entering the asset ID
 */

import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import type { AssetDetails } from '@/types/asset';
import {
  Alert,
  Badge,
  Button,
  Code,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { TruncatedKey } from './TruncatedKey';

interface RegisterByAssetIdModalProps {
  opened: boolean;
  onClose: () => void;
}

export function RegisterByAssetIdModal({
  opened,
  onClose,
}: RegisterByAssetIdModalProps) {
  const [active, setActive] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<string>('');
  const [assetId, setAssetId] = useState<string>('');
  const [isFetchingAsset, setIsFetchingAsset] = useState(false);
  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [assetNotFound, setAssetNotFound] = useState(false);
  const { registerAsset, getAssetDetails, registeredAssets } = useAsset();
  const { selectedKey } = useConfidentialKey();

  // Normalize asset ID by removing leading zeros
  // Asset ID 0 is valid, so we handle it explicitly
  const normalizedAssetId = assetId.trim()
    ? String(parseInt(assetId, 10) || (assetId.trim() === '0' ? 0 : ''))
    : '';

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setActive(0);
        setAssetId('');
        setRegistrationStep('');
        setAssetDetails(null);
        setAssetNotFound(false);
      }, 200);
    }
  }, [opened]);

  // Fetch asset details when normalized asset ID changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!normalizedAssetId && normalizedAssetId !== '0') {
        setAssetDetails(null);
        setAssetNotFound(false);
        return;
      }

      setIsFetchingAsset(true);
      setAssetNotFound(false);

      try {
        const details = await getAssetDetails(normalizedAssetId);
        if (details) {
          setAssetDetails(details);
          setAssetNotFound(false);
        } else {
          setAssetDetails(null);
          setAssetNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch asset details:', error);
        setAssetDetails(null);
        setAssetNotFound(true);
      } finally {
        setIsFetchingAsset(false);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(fetchDetails, 300);
    return () => clearTimeout(timeoutId);
  }, [normalizedAssetId, getAssetDetails]);

  // Check if already registered using normalized ID
  const isAlreadyRegistered = registeredAssets.some(
    (a) => a.assetId === normalizedAssetId,
  );

  const canProceed =
    (normalizedAssetId || normalizedAssetId === '0') &&
    !isAlreadyRegistered &&
    !assetNotFound &&
    !isFetchingAsset;

  const handleRegister = async () => {
    if (!canProceed || !selectedKey) return;

    setIsRegistering(true);
    setActive(1);

    try {
      await registerAsset({
        assetId: normalizedAssetId,
        onProgress: (step) => {
          setRegistrationStep(step);
        },
      });

      // Success - move to completion step
      setActive(2);
    } catch (error) {
      console.error('Registration failed:', error);
      // Error shown in notification
      // Reset to step 0
      setActive(0);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    if (!isRegistering) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Register for Asset"
      size="md"
      closeOnClickOutside={!isRegistering}
      closeOnEscape={!isRegistering}
    >
      <Stepper active={active} orientation="vertical">
        {/* Step 1: Enter Asset ID */}
        <Stepper.Step
          label="Enter Asset ID"
          description="Specify which asset to register for"
        >
          <Stack gap="md" mt="md">
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                Registration links your confidential account with an asset,
                allowing you to receive and hold tokens. You need the asset ID
                from the sender.
              </Text>
            </Alert>

            {!selectedKey ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
              >
                No confidential key selected. Please select a key in the Keys
                page first.
              </Alert>
            ) : (
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Registering Account
                  </Text>
                  <Text size="sm" fw={500}>
                    {selectedKey.alias}
                  </Text>
                  <TruncatedKey value={selectedKey.publicKey} />
                </Stack>
              </Paper>
            )}

            <TextInput
              label="Asset ID"
              placeholder="Enter asset ID (e.g., 123)"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              required
              disabled={!selectedKey}
              description={
                assetId && normalizedAssetId !== assetId
                  ? `Normalized to: ${normalizedAssetId}`
                  : 'The numeric ID of the asset you want to register for'
              }
            />

            {assetDetails && (
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Group justify="space-between" align="start">
                    <div>
                      <Text size="sm" fw={500}>
                        {assetDetails.name || 'Unknown Asset'}
                      </Text>
                      {assetDetails.symbol && (
                        <Text size="xs" c="dimmed">
                          {assetDetails.symbol}
                        </Text>
                      )}
                    </div>
                    {isAlreadyRegistered && (
                      <Badge color="green" size="sm">
                        Already Registered
                      </Badge>
                    )}
                  </Group>
                  {assetDetails.metadata?.description && (
                    <Text size="sm" c="dimmed">
                      {assetDetails.metadata.description}
                    </Text>
                  )}
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">
                      Decimals: {assetDetails.decimals ?? 0}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            )}

            {isFetchingAsset && assetId && (
              <Alert icon={<Loader size={16} />} color="blue" variant="light">
                <Text size="sm">Loading asset details...</Text>
              </Alert>
            )}

            {assetNotFound && assetId && !isFetchingAsset && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
              >
                <Text size="sm">
                  Asset ID {assetId} not found on chain. Please verify the asset
                  ID is correct.
                </Text>
              </Alert>
            )}

            {isAlreadyRegistered && (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                variant="light"
              >
                <Text size="sm">
                  You are already registered for this asset. You can receive and
                  send this asset.
                </Text>
              </Alert>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleRegister} disabled={!canProceed}>
                Register for Asset
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* Step 2: Registering */}
        <Stepper.Step
          label="Registering"
          description="Generating proof and submitting transaction"
          loading={isRegistering}
        >
          <Stack gap="md" mt="md" align="center" py="xl">
            <Loader size="lg" />
            <Text size="sm" fw={500}>
              Registering for asset {normalizedAssetId}...
            </Text>
            {registrationStep && (
              <Text size="xs" c="dimmed">
                {registrationStep}
              </Text>
            )}
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="xs">
                This may take a moment while we generate the zero-knowledge
                proof and submit the transaction to the blockchain.
              </Text>
            </Alert>
          </Stack>
        </Stepper.Step>

        {/* Step 3: Complete */}
        <Stepper.Step label="Complete" description="Successfully registered">
          <Stack gap="md" mt="md" align="center" py="xl">
            <IconCheck size={64} color="green" stroke={1.5} />
            <div style={{ textAlign: 'center' }}>
              <Text size="lg" fw={500}>
                Registration Successful!
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                You can now receive and send this asset.
              </Text>
            </div>

            {assetDetails && (
              <Paper p="md" withBorder w="100%">
                <Stack gap="xs">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Registered Asset
                  </Text>
                  <Text size="sm" fw={500}>
                    {assetDetails.name ||
                      `Asset ${normalizedAssetId}`}
                  </Text>
                  {assetDetails.symbol && (
                    <Text size="sm" c="dimmed">
                      {assetDetails.symbol}
                    </Text>
                  )}
                  <Code style={{ fontSize: '11px' }}>
                    ID: {normalizedAssetId}
                  </Code>
                </Stack>
              </Paper>
            )}

            {selectedKey && (
              <Paper p="md" withBorder w="100%">
                <Stack gap="xs">
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    Registered Account
                  </Text>
                  <Text size="sm" fw={500}>
                    {selectedKey.alias}
                  </Text>
                  <TruncatedKey value={selectedKey.publicKey} />
                </Stack>
              </Paper>
            )}

            <Group justify="center" mt="md">
              <Button onClick={handleClose}>Close</Button>
            </Group>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
