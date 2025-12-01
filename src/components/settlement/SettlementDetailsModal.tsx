/**
 * Settlement Details Modal
 *
 * Modal for viewing and managing settlement instruction details
 * Supports decryption, affirmation, and claiming for all parties
 */

import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import type { SettlementLegDetails, SettlementRole } from '@/types/settlement';
import { formatTokenAmount } from '@/utils/formatNumber';
import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconInfoCircle,
  IconLock,
  IconLockOpen,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { TruncatedKey } from '../TruncatedKey';

interface SettlementDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  settlementId: string;
  // If provided, will auto-decrypt this leg on open
  initialLegId?: number;
  // Called after successful affirmation to refresh parent state
  onAffirmationComplete?: () => void;
}

interface DecryptedLeg {
  details: SettlementLegDetails;
  roles: SettlementRole[];
  status?: string;
  canAffirm?: boolean;
  canClaim?: boolean;
}

type LegStatus = 'Pending' | 'Affirmed' | 'Rejected' | 'Finalized';

interface LegAffirmationStatus {
  sender: LegStatus;
  receiver: LegStatus;
  mediators: Map<number, LegStatus>;
}

export function SettlementDetailsModal({
  opened,
  onClose,
  settlementId,
  initialLegId = 0,
  onAffirmationComplete,
}: SettlementDetailsModalProps) {
  const {
    decryptSettlement,
    affirmAsSender,
    affirmAsReceiver,
    affirmAsMediator,
    claimAssets,
    updateSenderCounter,
    revertSenderAffirmation,
    querySettlementStatus,
  } = useSettlement();
  const { selectedKey } = useConfidentialKey();
  const { polkadotApi } = usePolymesh();
  const { getAssetDetails, registeredAssetBalances, assetDetailsMap } =
    useAsset();

  // State
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingLegs, setIsLoadingLegs] = useState(false);
  const [availableLegIds, setAvailableLegIds] = useState<number[]>([]);
  const [decryptedLegs, setDecryptedLegs] = useState<Map<number, DecryptedLeg>>(
    new Map(),
  );
  const [currentLegId, setCurrentLegId] = useState(initialLegId);
  const [settlementStatus, setSettlementStatus] = useState<{
    status: string;
    pendingAffirmations: number;
  } | null>(null);
  const [settlementMemo, setSettlementMemo] = useState<string | null>(null);
  const [legAffirmationStatus, setLegAffirmationStatus] = useState<
    Map<number, LegAffirmationStatus>
  >(new Map());
  const [error, setError] = useState<string | null>(null);

  // Load settlement status from chain
  const loadSettlementStatus = useCallback(async () => {
    if (!polkadotApi) return;

    try {
      setIsLoadingStatus(true);
      const status = await querySettlementStatus(settlementId);
      setSettlementStatus(status);

      // Load memo
      const memoOption =
        await polkadotApi.query.confidentialAssets.settlementMemo(settlementId);
      const memo = memoOption.isSome ? memoOption.unwrap().toUtf8() : null;
      setSettlementMemo(memo);
    } catch (err) {
      console.error('Failed to query settlement status:', err);
      // Don't show error alert, just log it
    } finally {
      setIsLoadingStatus(false);
    }
  }, [polkadotApi, querySettlementStatus, settlementId]);

  // Load leg affirmation status for all legs
  const loadLegAffirmationStatus = useCallback(
    async (legIds: number[]) => {
      if (!polkadotApi || legIds.length === 0) return;

      try {
        // Initialize status map for all legs
        const statusMap = new Map<number, LegAffirmationStatus>();
        for (const legId of legIds) {
          statusMap.set(legId, {
            sender: 'Pending',
            receiver: 'Pending',
            mediators: new Map(),
          });
        }

        // Query all affirmation status entries for each leg
        // This returns all parties (sender, receiver, and all mediators)
        const allEntries = [];
        for (const legId of legIds) {
          const entries =
            await polkadotApi.query.confidentialAssets.legAffirmationStatus.entries(
              settlementId,
              legId,
            );
          allEntries.push(...entries);
        }

        // Process each entry
        for (const [key, value] of allEntries) {
          try {
            // Key args: [settlementId, legId, party]
            const legId = key.args[1].toNumber();
            const party = key.args[2];

            // Only process legs we're interested in
            if (!statusMap.has(legId)) continue;

            const legStatus = statusMap.get(legId)!;

            // Get status value
            if (value.isSome) {
              const status = value.unwrap().toString() as
                | 'Pending'
                | 'Affirmed'
                | 'Rejected'
                | 'Finalized';

              // Determine party type and update status
              if (party.isSender) {
                legStatus.sender = status;
              } else if (party.isReceiver) {
                legStatus.receiver = status;
              } else if (party.isMediator) {
                // Mediator includes an index (u8)
                const mediatorIndex = party.asMediator.toNumber();
                legStatus.mediators.set(mediatorIndex, status);
              }
            }
          } catch (err) {
            console.warn('Failed to process affirmation status entry:', err);
          }
        }

        setLegAffirmationStatus(statusMap);
      } catch (err) {
        console.error('Failed to query leg affirmation status:', err);
      }
    },
    [polkadotApi, settlementId],
  );

  // Load all settlement legs from chain
  const loadSettlementLegs = useCallback(async () => {
    if (!polkadotApi) return;

    try {
      setIsLoadingLegs(true);
      setError(null);

      // Query all settlement legs entries for this settlement
      // settlementLegs(SettlementRef, u8) - query with just the ref to get all legs
      const entries =
        await polkadotApi.query.confidentialAssets.settlementLegs.entries(
          settlementId,
        );

      // Extract leg IDs from the keys
      const legIds = entries
        .map(([key]) => {
          // Key is [settlementRef, legId]
          // The second argument is the leg ID (u8)
          const args = key.args;
          return args[1].toNumber();
        })
        .sort((a, b) => a - b);

      setAvailableLegIds(legIds);

      if (legIds.length === 0) {
        setError('No legs found for this settlement');
      } else {
        // Load affirmation status for all legs immediately after getting leg IDs
        await loadLegAffirmationStatus(legIds);
      }
    } catch (err) {
      console.error('Failed to query settlement legs:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load settlement legs',
      );
    } finally {
      setIsLoadingLegs(false);
    }
  }, [loadLegAffirmationStatus, polkadotApi, settlementId]);

  // Decrypt a specific leg
  const handleDecryptLeg = useCallback(
    async (legId: number) => {
      if (!selectedKey) {
        console.warn('No key selected, cannot decrypt leg');
        return;
      }

      // Skip if already decrypted
      if (decryptedLegs.has(legId)) {
        setCurrentLegId(legId);
        return;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await decryptSettlement({
          settlementId,
          legId,
        });

        // Load asset details if not already in map
        if (!assetDetailsMap.has(result.leg.assetId)) {
          await getAssetDetails(result.leg.assetId);
        }

        // Store decrypted leg with roles
        setDecryptedLegs((prev) => {
          const newMap = new Map(prev);
          newMap.set(legId, {
            details: result.leg,
            roles: result.roles,
          });
          return newMap;
        });

        setCurrentLegId(legId);
      } catch (err) {
        console.error('Decryption failed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to decrypt settlement leg',
        );
      } finally {
        setIsDecrypting(false);
      }
    },
    [
      assetDetailsMap,
      decryptSettlement,
      decryptedLegs,
      getAssetDetails,
      settlementId,
      selectedKey,
    ],
  );

  // Auto-decrypt all available legs
  useEffect(() => {
    if (selectedKey && availableLegIds.length > 0) {
      // Auto-decrypt legs that haven't been decrypted yet
      availableLegIds.forEach((legId) => {
        if (!decryptedLegs.has(legId)) {
          handleDecryptLeg(legId).catch((err) => {
            console.warn(`Failed to auto-decrypt leg ${legId}:`, err);
          });
        }
      });
    }
  }, [selectedKey, availableLegIds, decryptedLegs, handleDecryptLeg]);

  useEffect(() => {
    if (opened && polkadotApi) {
      setDecryptedLegs(new Map());
      setAvailableLegIds([]);
      setCurrentLegId(initialLegId);
      setSettlementStatus(null);
      setError(null);

      // Load settlement legs and status
      loadSettlementLegs();
      loadSettlementStatus();
    }
  }, [
    opened,
    settlementId,
    polkadotApi,
    initialLegId,
    loadSettlementLegs,
    loadSettlementStatus,
  ]);

  // Affirm as sender
  const handleAffirmSender = async (legId: number) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await affirmAsSender({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);

      // Notify parent to refresh
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Affirmation failed:', err);
    }
  };

  // Affirm as receiver
  const handleAffirmReceiver = async (legId: number) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await affirmAsReceiver({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);

      // Notify parent to refresh
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Affirmation failed:', err);
    }
  };

  // Affirm as mediator
  const handleAffirmMediator = async (legId: number, accept: boolean) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await affirmAsMediator({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
        accept,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);

      // Notify parent to refresh
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Affirmation failed:', err);
    }
  };

  // Claim assets
  const handleClaimAssets = async (legId: number) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await claimAssets({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Claim failed:', err);
    }
  };

  // Update sender counter
  const handleUpdateSenderCounter = async (legId: number) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await updateSenderCounter({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Update counter failed:', err);
    }
  };

  // Revert sender affirmation
  const handleRevertSenderAffirmation = async (legId: number) => {
    const leg = decryptedLegs.get(legId);
    if (!leg) return;

    try {
      await revertSenderAffirmation({
        settlementId,
        legId,
        assetId: leg.details.assetId,
        amount: leg.details.amount,
      });

      // Refresh settlement status and affirmation status
      await loadSettlementStatus();
      await loadLegAffirmationStatus(availableLegIds);
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Revert affirmation failed:', err);
    }
  };

  const currentLeg = decryptedLegs.get(currentLegId);

  return (
    <Modal opened={opened} onClose={onClose} title="Transfer Details" size="lg">
      <Stack gap="md">
        {/* Settlement ID */}
        <Paper p="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Transfer ID
            </Text>
            <TruncatedKey value={settlementId} />
          </Stack>
        </Paper>

        {/* Settlement Status */}
        {settlementStatus && (
          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  Status
                </Text>
                <Badge
                  color={
                    settlementStatus.status === 'Executed'
                      ? 'green'
                      : settlementStatus.status === 'Pending'
                        ? 'yellow'
                        : 'gray'
                  }
                  mt={4}
                >
                  {settlementStatus.status}
                </Badge>
              </div>
              {settlementStatus.pendingAffirmations > 0 && (
                <div>
                  <Text size="xs" c="dimmed">
                    Pending Affirmations
                  </Text>
                  <Badge color="orange" mt={4}>
                    {settlementStatus.pendingAffirmations}
                  </Badge>
                </div>
              )}
              <Tooltip label="Refresh status">
                <ActionIcon
                  variant="subtle"
                  onClick={loadSettlementStatus}
                  loading={isLoadingStatus}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Paper>
        )}

        {/* Settlement Memo */}
        {settlementMemo && (
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Memo
              </Text>
              <Text size="sm" style={{ fontStyle: 'italic' }}>
                {settlementMemo}
              </Text>
            </Stack>
          </Paper>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* No key selected alert */}
        {!selectedKey && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Key Required"
            color="yellow"
            variant="light"
          >
            Please select a confidential key to decrypt and interact with this
            transfer.
          </Alert>
        )}

        {/* Available Legs */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Transfer Legs
              </Text>
              {isLoadingLegs ? (
                <Group gap="xs">
                  <Loader size="xs" />
                  <Text size="xs" c="dimmed">
                    Loading...
                  </Text>
                </Group>
              ) : (
                <Badge>
                  {availableLegIds.length}{' '}
                  {availableLegIds.length === 1 ? 'leg' : 'legs'}
                </Badge>
              )}
            </Group>

            {isLoadingLegs ? (
              <Alert
                icon={<IconInfoCircle size={16} />}
                color="blue"
                variant="light"
              >
                Querying transfer legs from chain...
              </Alert>
            ) : availableLegIds.length === 0 ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="yellow"
                variant="light"
              >
                No legs found for this transfer.
              </Alert>
            ) : (
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  Click a leg below to decrypt and view its details:
                </Text>
                {availableLegIds.map((legId) => {
                  const affirmStatus = legAffirmationStatus.get(legId);
                  const isDecrypted = decryptedLegs.has(legId);

                  return (
                    <Paper key={legId} p="xs" withBorder>
                      <Stack gap="xs">
                        <Button
                          variant={isDecrypted ? 'light' : 'filled'}
                          color={isDecrypted ? 'green' : 'blue'}
                          leftSection={
                            isDecrypted ? (
                              <IconLockOpen size={16} />
                            ) : (
                              <IconLock size={16} />
                            )
                          }
                          onClick={() => handleDecryptLeg(legId)}
                          loading={isDecrypting && currentLegId === legId}
                          disabled={!selectedKey || isDecrypting || isDecrypted}
                          fullWidth
                        >
                          <Group
                            justify="space-between"
                            style={{ width: '100%' }}
                          >
                            <Text>Leg {legId}</Text>
                            {isDecrypted && (
                              <Badge size="sm" color="green" variant="light">
                                Decrypted
                              </Badge>
                            )}
                          </Group>
                        </Button>

                        {/* Show affirmation status if available */}
                        {affirmStatus && (
                          <Stack gap="xs">
                            <Group gap="xs" justify="center" wrap="wrap">
                              <Badge
                                size="sm"
                                color={
                                  affirmStatus.sender === 'Affirmed' ||
                                  affirmStatus.sender === 'Finalized'
                                    ? 'green'
                                    : affirmStatus.sender === 'Rejected'
                                      ? 'red'
                                      : 'gray'
                                }
                                variant="dot"
                              >
                                Sender: {affirmStatus.sender}
                              </Badge>
                              <Badge
                                size="sm"
                                color={
                                  affirmStatus.receiver === 'Affirmed' ||
                                  affirmStatus.receiver === 'Finalized'
                                    ? 'green'
                                    : affirmStatus.receiver === 'Rejected'
                                      ? 'red'
                                      : 'gray'
                                }
                                variant="dot"
                              >
                                Receiver: {affirmStatus.receiver}
                              </Badge>
                            </Group>
                            {affirmStatus.mediators.size > 0 && (
                              <Group gap="xs" justify="center" wrap="wrap">
                                {Array.from(
                                  affirmStatus.mediators.entries(),
                                ).map(([index, status]) => (
                                  <Badge
                                    key={index}
                                    size="sm"
                                    color={
                                      status === 'Affirmed' ||
                                      status === 'Finalized'
                                        ? 'green'
                                        : status === 'Rejected'
                                          ? 'red'
                                          : 'gray'
                                    }
                                    variant="dot"
                                  >
                                    Mediator {index}: {status}
                                  </Badge>
                                ))}
                              </Group>
                            )}
                          </Stack>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Decrypted Leg Details */}
        {currentLeg && (
          <Accordion defaultValue="details">
            <Accordion.Item value="details">
              <Accordion.Control>
                <Group>
                  <Text fw={500}>Leg {currentLegId}</Text>
                  <Group gap="xs">
                    {currentLeg.roles.map((role) => (
                      <Badge
                        key={role}
                        color={
                          role === 'sender'
                            ? 'red'
                            : role === 'receiver'
                              ? 'green'
                              : 'blue'
                        }
                      >
                        {role}
                      </Badge>
                    ))}
                  </Group>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  {/* Asset Info */}
                  <Paper p="sm" withBorder>
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed">
                        Asset
                      </Text>
                      {(() => {
                        const asset = assetDetailsMap.get(
                          currentLeg.details.assetId,
                        );
                        const decimals = asset?.metadata?.decimals ?? 0;
                        const isRegistered = registeredAssetBalances.has(
                          currentLeg.details.assetId,
                        );
                        const needsRegistration =
                          (currentLeg.roles.includes('sender') ||
                            currentLeg.roles.includes('receiver')) &&
                          !isRegistered;

                        return (
                          <>
                            {asset?.metadata?.name && (
                              <Text size="sm" fw={600}>
                                {asset.metadata.name}
                                {asset.metadata.symbol && (
                                  <Text span c="dimmed" ml="xs">
                                    ({asset.metadata.symbol})
                                  </Text>
                                )}
                              </Text>
                            )}
                            <Text
                              size="xs"
                              c="dimmed"
                              style={{ fontFamily: 'monospace' }}
                            >
                              ID: {currentLeg.details.assetId}
                            </Text>
                            {needsRegistration && (
                              <Alert
                                icon={<IconAlertCircle size={14} />}
                                color="yellow"
                                variant="light"
                                p="xs"
                                mt="xs"
                              >
                                <Text size="xs">
                                  You are not registered for this asset. You
                                  must register before you can{' '}
                                  {currentLeg.roles.includes('sender')
                                    ? 'send'
                                    : 'receive'}{' '}
                                  it.
                                </Text>
                              </Alert>
                            )}
                            <Divider my="xs" />
                            <Text size="xs" c="dimmed">
                              Amount
                            </Text>
                            <Text
                              size="lg"
                              fw={600}
                              style={{ fontFamily: 'monospace' }}
                            >
                              {formatTokenAmount(
                                currentLeg.details.amount,
                                decimals,
                              )}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Decimals: {decimals}
                            </Text>
                          </>
                        );
                      })()}
                    </Stack>
                  </Paper>

                  {/* Parties */}
                  <Paper p="sm" withBorder>
                    <Stack gap="sm">
                      <div>
                        <Text size="xs" c="dimmed" mb={4}>
                          Sender
                        </Text>
                        <TruncatedKey
                          value={currentLeg.details.senderPublicKey}
                        />
                      </div>
                      <div>
                        <Text size="xs" c="dimmed" mb={4}>
                          Receiver
                        </Text>
                        <TruncatedKey
                          value={currentLeg.details.receiverPublicKey}
                        />
                      </div>
                    </Stack>
                  </Paper>

                  {/* Actions */}
                  {['Pending', 'Rejected'].includes(
                    settlementStatus?.status || '',
                  ) && (
                    <Stack gap="xs">
                      <Divider label="Actions" />

                      {currentLeg.roles.includes('sender') &&
                        (() => {
                          const affirmStatus =
                            legAffirmationStatus.get(currentLegId);
                          const hasAffirmed =
                            affirmStatus?.sender === 'Affirmed';
                          const isRegistered = registeredAssetBalances.has(
                            currentLeg.details.assetId,
                          );

                          if (hasAffirmed) {
                            return (
                              <Stack gap="xs">
                                <Alert
                                  icon={<IconCheck size={16} />}
                                  color="green"
                                  variant="light"
                                >
                                  You have already affirmed this leg as sender.
                                </Alert>
                                <Button
                                  leftSection={<IconAlertCircle size={16} />}
                                  onClick={() =>
                                    handleRevertSenderAffirmation(currentLegId)
                                  }
                                  color="orange"
                                  variant="light"
                                >
                                  Revert Affirmation
                                </Button>
                              </Stack>
                            );
                          }

                          if (!isRegistered) {
                            return null; // Hide button if not registered
                          }

                          // Only allow affirmation if settlement is pending
                          if (settlementStatus?.status !== 'Pending') {
                            return null;
                          }

                          return (
                            <Button
                              leftSection={<IconCheck size={16} />}
                              onClick={() => handleAffirmSender(currentLegId)}
                              color="red"
                            >
                              Affirm as Sender
                            </Button>
                          );
                        })()}

                      {currentLeg.roles.includes('receiver') &&
                        (() => {
                          const affirmStatus =
                            legAffirmationStatus.get(currentLegId);
                          const hasAffirmed =
                            affirmStatus?.receiver === 'Affirmed';
                          const hasFinalized =
                            affirmStatus?.receiver === 'Finalized';
                          const isRegistered = registeredAssetBalances.has(
                            currentLeg.details.assetId,
                          );

                          if (hasFinalized) {
                            return (
                              <Alert
                                icon={<IconCheck size={16} />}
                                color="green"
                                variant="light"
                              >
                                You have finalized this leg as receiver. Assets
                                have been claimed.
                              </Alert>
                            );
                          }

                          if (hasAffirmed) {
                            return (
                              <Alert
                                icon={<IconCheck size={16} />}
                                color="green"
                                variant="light"
                              >
                                You have already affirmed this leg as receiver.
                              </Alert>
                            );
                          }

                          if (!isRegistered) {
                            return null; // Hide button if not registered
                          }

                          // Only allow affirmation if settlement is pending
                          if (settlementStatus?.status !== 'Pending') {
                            return null;
                          }

                          return (
                            <Button
                              leftSection={<IconCheck size={16} />}
                              onClick={() => handleAffirmReceiver(currentLegId)}
                              color="green"
                            >
                              Affirm as Receiver
                            </Button>
                          );
                        })()}

                      {currentLeg.roles.includes('mediator') &&
                        (() => {
                          // Find the mediator index for this user from the asset details
                          const asset = assetDetailsMap.get(
                            currentLeg.details.assetId,
                          );
                          let myMediatorIndex = -1;

                          if (asset && selectedKey) {
                            const myEncKey = selectedKey.encryptionPublicKey;
                            if (asset.mediators) {
                              myMediatorIndex = asset.mediators.findIndex(
                                (m) => m === myEncKey,
                              );
                            }
                          }

                          const affirmStatus =
                            legAffirmationStatus.get(currentLegId);
                          let hasAffirmed = false;
                          let hasRejected = false;

                          if (myMediatorIndex !== -1 && affirmStatus) {
                            const status =
                              affirmStatus.mediators.get(myMediatorIndex);
                            hasAffirmed =
                              status === 'Affirmed' || status === 'Finalized';
                            hasRejected = status === 'Rejected';
                          }

                          if (hasAffirmed) {
                            return (
                              <Alert
                                icon={<IconCheck size={16} />}
                                color="green"
                                variant="light"
                              >
                                You have already affirmed this leg as mediator.
                              </Alert>
                            );
                          }

                          if (hasRejected) {
                            return (
                              <Alert
                                icon={<IconX size={16} />}
                                color="red"
                                variant="light"
                              >
                                You have rejected this leg as mediator.
                              </Alert>
                            );
                          }

                          // Only allow affirmation/rejection if settlement is pending
                          if (settlementStatus?.status !== 'Pending') {
                            return null;
                          }

                          return (
                            <Group grow>
                              <Button
                                leftSection={<IconCheck size={16} />}
                                onClick={() =>
                                  handleAffirmMediator(currentLegId, true)
                                }
                                color="blue"
                              >
                                Affirm
                              </Button>
                              <Button
                                leftSection={<IconX size={16} />}
                                onClick={() =>
                                  handleAffirmMediator(currentLegId, false)
                                }
                                color="red"
                                variant="light"
                              >
                                Reject
                              </Button>
                            </Group>
                          );
                        })()}
                    </Stack>
                  )}

                  {settlementStatus?.status === 'Executed' &&
                    currentLeg.roles.includes('receiver') &&
                    (() => {
                      const affirmStatus =
                        legAffirmationStatus.get(currentLegId);
                      const hasFinalized =
                        affirmStatus?.receiver === 'Finalized';

                      // Don't show Claim button if already finalized
                      if (hasFinalized) {
                        return null;
                      }

                      return (
                        <Button
                          leftSection={<IconArrowRight size={16} />}
                          onClick={() => handleClaimAssets(currentLegId)}
                          color="green"
                          variant="filled"
                        >
                          Claim Assets
                        </Button>
                      );
                    })()}

                  {settlementStatus?.status === 'Executed' &&
                    currentLeg.roles.includes('sender') &&
                    (() => {
                      const affirmStatus =
                        legAffirmationStatus.get(currentLegId);
                      const hasFinalized = affirmStatus?.sender === 'Finalized';

                      if (hasFinalized) {
                        return (
                          <Alert
                            icon={<IconCheck size={16} />}
                            color="green"
                            variant="light"
                          >
                            Settlement executed. Transaction counter updated.
                          </Alert>
                        );
                      }

                      return (
                        <Stack gap="xs">
                          <Alert
                            icon={<IconCheck size={16} />}
                            color="green"
                            variant="light"
                          >
                            Settlement executed. Assets have been transferred.
                          </Alert>
                          <Button
                            leftSection={<IconArrowRight size={16} />}
                            onClick={() =>
                              handleUpdateSenderCounter(currentLegId)
                            }
                            color="blue"
                            variant="filled"
                          >
                            Update Transaction Counter
                          </Button>
                        </Stack>
                      );
                    })()}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}

        {/* All Decrypted Legs Summary */}
        {decryptedLegs.size > 1 && (
          <Paper p="md" withBorder>
            <Text size="sm" fw={500} mb="md">
              All Decrypted Legs
            </Text>
            <Stack gap="xs">
              {Array.from(decryptedLegs.entries()).map(([legId, leg]) => (
                <Card
                  key={legId}
                  padding="xs"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      legId === currentLegId
                        ? 'var(--mantine-color-gray-0)'
                        : undefined,
                  }}
                  onClick={() => setCurrentLegId(legId)}
                >
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        Leg {legId}
                      </Text>
                      <Group gap="xs">
                        {leg.roles.map((role) => (
                          <Badge
                            key={role}
                            size="xs"
                            color={
                              role === 'sender'
                                ? 'red'
                                : role === 'receiver'
                                  ? 'green'
                                  : 'blue'
                            }
                          >
                            {role}
                          </Badge>
                        ))}
                      </Group>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Asset {leg.details.assetId}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Info about decryption */}
        {!isDecrypting &&
          !isLoadingLegs &&
          decryptedLegs.size === 0 &&
          availableLegIds.length > 0 && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              You must be involved in a leg (sender, receiver, mediator, or
              auditor) to decrypt it. Select a leg above to view its details.
            </Alert>
          )}

        {/* Close button */}
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
