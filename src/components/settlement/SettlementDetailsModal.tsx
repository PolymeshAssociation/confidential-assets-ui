import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Button,
  CopyButton,
  Divider,
  Grid,
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
  IconClock,
  IconCopy,
  IconInfoCircle,
  IconLock,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import { TruncatedKey } from '@/components/TruncatedKey';
import { useAsset } from '@/hooks/useAsset';
import { useConfidentialKey } from '@/hooks/useConfidentialKey';
import { useNotification } from '@/hooks/useNotification';
import { usePolymesh } from '@/hooks/usePolymesh';
import { useSettlement } from '@/hooks/useSettlement';
import type {
  DecryptedLegResult,
  LegAffirmationStatus,
  LegStatus,
  SettlementLegDetails,
  SettlementRole,
} from '@/types/settlement';
import { fromSmallestUnit } from '@/utils/tokenAmount';

interface SettlementDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  settlementId: string;
  initialLegId?: number;
  onAffirmationComplete?: () => void;
}

interface DecryptedLeg {
  details: SettlementLegDetails;
  roles: SettlementRole[];
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
    decryptAllLegs,
    querySettlementDetails,
    affirmAsSender,
    affirmAsReceiver,
    affirmAsMediator,
    claimAssets,
    updateSenderCounter,
    revertSenderAffirmation,
  } = useSettlement();
  const { selectedKey } = useConfidentialKey();
  const { polkadotApi } = usePolymesh();
  const { getAssetDetails, assetDetailsMap } = useAsset();
  const { showSuccess } = useNotification();

  // State
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [availableLegIds, setAvailableLegIds] = useState<number[]>([]);
  const [decryptedLegs, setDecryptedLegs] = useState<Map<number, DecryptedLeg>>(
    new Map(),
  );
  const [failedLegs, setFailedLegs] = useState<Set<number>>(new Set());
  const [notInvolvedLegs, setNotInvolvedLegs] = useState<Set<number>>(
    new Set(),
  );
  const [settlementStatus, setSettlementStatus] = useState<{
    status: string;
    pendingAffirmations: number;
    pendingFinalizations: number;
  } | null>(null);
  const [settlementMemo, setSettlementMemo] = useState<string | null>(null);
  const [legAffirmationStatus, setLegAffirmationStatus] = useState<
    Map<number, LegAffirmationStatus>
  >(new Map());
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load settlement details from chain
  const loadSettlementDetails = useCallback(async () => {
    if (!polkadotApi) return;

    try {
      setIsLoadingDetails(true);
      const details = await querySettlementDetails(settlementId);

      setSettlementStatus({
        status: details.status,
        pendingAffirmations: details.pendingAffirmations,
        pendingFinalizations: details.pendingFinalizations,
      });
      setSettlementMemo(details.memo || null);
      setAvailableLegIds(details.legIds);
      setLegAffirmationStatus(details.legAffirmations);
    } catch (err) {
      console.error('Failed to query settlement details:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load settlement details',
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }, [polkadotApi, querySettlementDetails, settlementId]);

  // Refresh just the affirmation status (called after actions)
  const refreshAffirmationStatus = useCallback(async () => {
    if (!polkadotApi || availableLegIds.length === 0) return;

    try {
      const details = await querySettlementDetails(settlementId);
      setLegAffirmationStatus(details.legAffirmations);
      setSettlementStatus({
        status: details.status,
        pendingAffirmations: details.pendingAffirmations,
        pendingFinalizations: details.pendingFinalizations,
      });
      showSuccess('Status refreshed');
    } catch (err) {
      console.error('Failed to refresh affirmation status:', err);
    }
  }, [polkadotApi, querySettlementDetails, settlementId, availableLegIds, showSuccess]);

  // Batch decrypt all legs
  const handleDecryptAllLegs = useCallback(async () => {
    if (!selectedKey || availableLegIds.length === 0 || isDecrypting) return;

    setIsDecrypting(true);
    setDecryptedLegs(new Map());
    setFailedLegs(new Set());
    setNotInvolvedLegs(new Set());

    try {
      await decryptAllLegs({
        settlementId,
        maxConcurrency: 5,
        onLegDecrypted: async (result: DecryptedLegResult) => {
          if (result.status === 'success') {
            // Load asset details if needed
            if (!assetDetailsMap.has(result.leg.assetId)) {
              await getAssetDetails(result.leg.assetId);
            }

            setDecryptedLegs((prev) => {
              const newMap = new Map(prev);
              newMap.set(result.legId, {
                details: result.leg,
                roles: result.roles,
              });
              return newMap;
            });
          } else if (result.status === 'failed') {
            setFailedLegs((prev) => new Set(prev).add(result.legId));
          } else if (result.status === 'not-involved') {
            setNotInvolvedLegs((prev) => new Set(prev).add(result.legId));
          }
        },
      });
    } catch (err) {
      console.error('Batch decryption failed:', err);
    } finally {
      setIsDecrypting(false);
    }
  }, [
    selectedKey,
    availableLegIds,
    isDecrypting,
    decryptAllLegs,
    settlementId,
    assetDetailsMap,
    getAssetDetails,
  ]);

  // Decrypt a specific leg (for retry)
  const handleDecryptLeg = useCallback(
    async (legId: number) => {
      if (!selectedKey) return;
      if (decryptedLegs.has(legId)) return;

      // Remove from failed/not-involved sets
      setFailedLegs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(legId);
        return newSet;
      });
      setNotInvolvedLegs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(legId);
        return newSet;
      });

      try {
        const result = await decryptSettlement({
          settlementId,
          legId,
        });

        if (!assetDetailsMap.has(result.leg.assetId)) {
          await getAssetDetails(result.leg.assetId);
        }

        setDecryptedLegs((prev) => {
          const newMap = new Map(prev);
          newMap.set(legId, {
            details: result.leg,
            roles: result.roles,
          });
          return newMap;
        });
      } catch (err) {
        console.error(`Decryption failed for leg ${legId}:`, err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        const isNotInvolved = errorMsg.includes(
          'You are not involved in this transfer leg',
        );

        if (isNotInvolved) {
          setNotInvolvedLegs((prev) => new Set(prev).add(legId));
        } else {
          setFailedLegs((prev) => new Set(prev).add(legId));
        }
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

  // Auto-decrypt all available legs when modal opens
  useEffect(() => {
    if (
      selectedKey &&
      availableLegIds.length > 0 &&
      decryptedLegs.size === 0 &&
      !isDecrypting
    ) {
      handleDecryptAllLegs();
    }
  }, [
    selectedKey,
    availableLegIds,
    decryptedLegs.size,
    isDecrypting,
    handleDecryptAllLegs,
  ]);

  useEffect(() => {
    if (opened && polkadotApi) {
      setDecryptedLegs(new Map());
      setFailedLegs(new Set());
      setNotInvolvedLegs(new Set());
      setAvailableLegIds([]);
      setSettlementStatus(null);
      setError(null);
      setIsDecrypting(false);
      loadSettlementDetails();
    }
  }, [opened, settlementId, polkadotApi, loadSettlementDetails]);

  // Action handlers
  const handleAction = async <T,>(
    actionFn: (params: T) => Promise<void>,
    params: T,
    actionId: string,
  ) => {
    try {
      setActionLoading(actionId);
      await actionFn(params);
      await refreshAffirmationStatus();
      onAffirmationComplete?.();
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatusBadge = (status: LegStatus, roleLabel: string) => {
    const colors: Record<LegStatus, string> = {
      Pending: 'yellow',
      Affirmed: 'green',
      Rejected: 'red',
      Finalized: 'blue',
    };
    const icons: Record<LegStatus, React.ReactNode> = {
      Pending: <IconClock size={12} />,
      Affirmed: <IconCheck size={12} />,
      Rejected: <IconX size={12} />,
      Finalized: <IconCheck size={12} />,
    };

    const fullLabels: Record<string, string> = {
      S: 'Sender',
      R: 'Receiver',
      M: 'Mediator',
    };

    const roleName = roleLabel.startsWith('M')
      ? `Mediator ${roleLabel.slice(1)}`
      : fullLabels[roleLabel] || roleLabel;

    return (
      <Tooltip label={`${roleName}: ${status}`} withinPortal>
        <Badge
          size="sm"
          color={colors[status]}
          variant="light"
          leftSection={icons[status]}
        >
          {roleLabel}: {status}
        </Badge>
      </Tooltip>
    );
  };

  const renderLegHeader = (legId: number) => {
    const affirmStatus = legAffirmationStatus.get(legId);
    const decryptedLeg = decryptedLegs.get(legId);
    const isFailed = failedLegs.has(legId);
    const isNotInvolved = notInvolvedLegs.has(legId);

    // Determine user's roles for this leg
    const userRoles = decryptedLeg?.roles || [];
    const roleColors: Record<SettlementRole, string> = {
      sender: 'blue',
      receiver: 'green',
      mediator: 'orange',
      auditor: 'violet',
    };

    return (
      <Stack gap="xs" w="100%">
        <Group gap="xs" wrap="wrap">
          <Text fw={500} size="sm">
            Leg {legId}
          </Text>
          {userRoles.length > 0 && (
            <>
              {userRoles.map((role) => (
                <Badge
                  key={role}
                  size="xs"
                  color={roleColors[role]}
                  variant="filled"
                >
                  {role === 'sender'
                    ? 'You: Sender'
                    : role === 'receiver'
                      ? 'You: Receiver'
                      : role === 'mediator'
                        ? 'You: Mediator'
                        : 'You: Auditor'}
                </Badge>
              ))}
            </>
          )}
          {isFailed && (
            <Badge size="xs" color="red" variant="filled">
              Failed
            </Badge>
          )}
          {isNotInvolved && (
            <Badge size="xs" color="gray" variant="light">
              Not Involved
            </Badge>
          )}
        </Group>

        {affirmStatus && (
          <Group gap={6} wrap="wrap">
            {renderStatusBadge(affirmStatus.sender, 'S')}
            <IconArrowRight size={14} style={{ opacity: 0.5 }} />
            {renderStatusBadge(affirmStatus.receiver, 'R')}
            {affirmStatus.mediators.size > 0 && (
              <>
                <Divider orientation="vertical" />
                <Group gap={4}>
                  {Array.from(affirmStatus.mediators.entries()).map(
                    ([idx, status]) => (
                      <div key={idx}>
                        {renderStatusBadge(status, `M${idx}`)}
                      </div>
                    ),
                  )}
                </Group>
              </>
            )}
          </Group>
        )}
      </Stack>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <Text fw={700} size="lg">
            Transfer Details
          </Text>
          {settlementStatus && (
            <Badge
              variant="filled"
              color={
                settlementStatus.status === 'Executed'
                  ? 'green'
                  : settlementStatus.status === 'Pending'
                    ? 'yellow'
                    : 'gray'
              }
            >
              {settlementStatus.status}
            </Badge>
          )}
        </Group>
      }
      size="lg"
      padding="lg"
    >
      <Stack gap="md">
        {/* Header Section */}
        <Paper withBorder p="sm">
          <Stack gap="xs">
            <Group justify="space-between">
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  ID:
                </Text>
                <Text size="sm">
                  {settlementId.substring(0, 8)}...
                  {settlementId.substring(settlementId.length - 8)}
                </Text>
                <CopyButton value={settlementId}>
                  {({ copied, copy }) => (
                    <ActionIcon
                      variant="subtle"
                      color={copied ? 'teal' : 'gray'}
                      onClick={copy}
                      size="xs"
                    >
                      {copied ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconCopy size={14} />
                      )}
                    </ActionIcon>
                  )}
                </CopyButton>
              </Group>

              <Group gap="xs">
                {settlementStatus &&
                  settlementStatus.pendingAffirmations > 0 && (
                    <Badge size="sm" color="orange" variant="light">
                      {settlementStatus.pendingAffirmations} Pending Affirmation
                    </Badge>
                  )}
                {settlementStatus &&
                  settlementStatus.pendingFinalizations > 0 && (
                    <Badge size="sm" color="yellow" variant="light">
                      {settlementStatus.pendingFinalizations} Pending
                      Finalization
                    </Badge>
                  )}
                <Tooltip label="Refresh status">
                  <ActionIcon
                    variant="light"
                    onClick={() => refreshAffirmationStatus()}
                    loading={isLoadingDetails}
                    size="sm"
                  >
                    <IconRefresh size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            {settlementMemo && (
              <Text size="xs" c="dimmed">
                Memo: {settlementMemo}
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Legs List */}
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500} c="dimmed">
              Legs ({availableLegIds.length})
            </Text>
            {isDecrypting && (
              <Group gap="xs">
                <Loader size="xs" />
                <Text size="xs" c="dimmed">
                  Decrypting...
                </Text>
              </Group>
            )}
          </Group>

          <Accordion
            variant="separated"
            radius="md"
            defaultValue={initialLegId.toString()}
          >
            {availableLegIds.map((legId) => {
              const decryptedLeg = decryptedLegs.get(legId);
              const isFailed = failedLegs.has(legId);
              const isNotInvolved = notInvolvedLegs.has(legId);
              const affirmStatus = legAffirmationStatus.get(legId);
              const asset = decryptedLeg
                ? assetDetailsMap.get(decryptedLeg.details.assetId)
                : null;

              // Find user's mediator index if they are a mediator
              const userMediatorIndex =
                selectedKey && asset?.mediators
                  ? asset.mediators.findIndex(
                      (mediator) =>
                        mediator === selectedKey.encryptionPublicKey,
                    )
                  : -1;

              return (
                <Accordion.Item key={legId} value={legId.toString()}>
                  <Accordion.Control>
                    {renderLegHeader(legId)}
                  </Accordion.Control>

                  <Accordion.Panel>
                    {decryptedLeg && (
                      <Stack gap="md">
                        {/* Asset & Amount */}
                        <Paper withBorder p="sm">
                          <Grid align="center">
                            <Grid.Col span={6}>
                              <Stack gap={2}>
                                <Text size="xs" c="dimmed">
                                  Asset
                                </Text>
                                <Text fw={600}>
                                  {asset?.metadata?.symbol ||
                                    asset?.metadata?.name ||
                                    'Unknown Asset'}
                                </Text>
                                <Text size="sm" c="dimmed">
                                  ID: {decryptedLeg.details.assetId}
                                </Text>
                              </Stack>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Stack gap={2} align="flex-end">
                                <Text size="xs" c="dimmed">
                                  Amount
                                </Text>
                                <Text fw={500} size="lg">
                                  {fromSmallestUnit(
                                    decryptedLeg.details.amount,
                                    asset?.metadata?.decimals ?? 6,
                                  )}
                                </Text>
                              </Stack>
                            </Grid.Col>
                          </Grid>
                        </Paper>

                        {/* Parties */}
                        <Grid>
                          <Grid.Col span={6}>
                            <Paper withBorder p="xs">
                              <Stack gap={4}>
                                <Group justify="space-between">
                                  <Text size="xs" c="dimmed">
                                    Sender
                                  </Text>
                                  {decryptedLeg.roles.includes('sender') && (
                                    <Badge size="xs" color="blue">
                                      You
                                    </Badge>
                                  )}
                                </Group>
                                <TruncatedKey
                                  value={decryptedLeg.details.senderPublicKey}
                                  showCopy
                                />
                              </Stack>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Paper withBorder p="xs">
                              <Stack gap={4}>
                                <Group justify="space-between">
                                  <Text size="xs" c="dimmed">
                                    Receiver
                                  </Text>
                                  {decryptedLeg.roles.includes('receiver') && (
                                    <Badge size="xs" color="green">
                                      You
                                    </Badge>
                                  )}
                                </Group>
                                <TruncatedKey
                                  value={decryptedLeg.details.receiverPublicKey}
                                  showCopy
                                />
                              </Stack>
                            </Paper>
                          </Grid.Col>
                        </Grid>

                        {/* Auditor indicator - only show if auditor is the ONLY role */}
                        {decryptedLeg.roles.includes('auditor') &&
                          decryptedLeg.roles.length === 1 && (
                            <Alert
                              icon={<IconInfoCircle size={16} />}
                              color="violet"
                              variant="light"
                            >
                              <Text size="sm">
                                You have auditor access to this leg (view only).
                              </Text>
                            </Alert>
                          )}

                        {/* Actions */}
                        <Stack gap="xs">
                          {(() => {
                            // Helper to render action buttons based on role and status
                            const isSender =
                              decryptedLeg.roles.includes('sender');
                            const isReceiver =
                              decryptedLeg.roles.includes('receiver');
                            const isMediator =
                              decryptedLeg.roles.includes('mediator');
                            const settlementIsPending =
                              settlementStatus?.status === 'Pending';
                            const settlementIsRejected =
                              settlementStatus?.status === 'Rejected';
                            const settlementIsExecuted =
                              settlementStatus?.status === 'Executed';

                            const senderStatus = affirmStatus?.sender;
                            const receiverStatus = affirmStatus?.receiver;
                            const mediatorStatus =
                              userMediatorIndex !== -1 && affirmStatus
                                ? affirmStatus.mediators.get(userMediatorIndex)
                                : undefined;

                            const actions = [];

                            // Sender: Affirm when pending
                            if (
                              isSender &&
                              senderStatus === 'Pending' &&
                              settlementIsPending
                            ) {
                              actions.push(
                                <Button
                                  key="sender-affirm"
                                  color="blue"
                                  loading={actionLoading === `sender-${legId}`}
                                  onClick={() =>
                                    handleAction(
                                      affirmAsSender,
                                      {
                                        settlementId,
                                        legId,
                                        assetId: decryptedLeg.details.assetId,
                                        amount: decryptedLeg.details.amount,
                                      },
                                      `sender-${legId}`,
                                    )
                                  }
                                  fullWidth
                                >
                                  Affirm as Sender
                                </Button>,
                              );
                            }

                            // Sender: Revert when affirmed and settlement rejected
                            if (
                              isSender &&
                              senderStatus === 'Affirmed' &&
                              settlementIsRejected
                            ) {
                              actions.push(
                                <Button
                                  key="sender-revert"
                                  color="orange"
                                  variant="light"
                                  loading={actionLoading === `revert-${legId}`}
                                  onClick={() =>
                                    handleAction(
                                      revertSenderAffirmation,
                                      {
                                        settlementId,
                                        legId,
                                        assetId: decryptedLeg.details.assetId,
                                        amount: decryptedLeg.details.amount,
                                      },
                                      `revert-${legId}`,
                                    )
                                  }
                                  fullWidth
                                >
                                  Revert Affirmation
                                </Button>,
                              );
                            }

                            // Sender: Update counter when affirmed and settlement executed
                            if (
                              isSender &&
                              senderStatus === 'Affirmed' &&
                              settlementIsExecuted
                            ) {
                              actions.push(
                                <Button
                                  key="sender-update"
                                  color="blue"
                                  variant="light"
                                  loading={actionLoading === `update-${legId}`}
                                  onClick={() =>
                                    handleAction(
                                      updateSenderCounter,
                                      {
                                        settlementId,
                                        legId,
                                        assetId: decryptedLeg.details.assetId,
                                        amount: decryptedLeg.details.amount,
                                      },
                                      `update-${legId}`,
                                    )
                                  }
                                  fullWidth
                                >
                                  Update Transaction Counter
                                </Button>,
                              );
                            }

                            // Receiver: Affirm when pending and sender not rejected
                            if (
                              isReceiver &&
                              receiverStatus === 'Pending' &&
                              settlementIsPending &&
                              senderStatus !== 'Rejected'
                            ) {
                              actions.push(
                                <Button
                                  key="receiver-affirm"
                                  color="green"
                                  loading={
                                    actionLoading === `receiver-${legId}`
                                  }
                                  onClick={() =>
                                    handleAction(
                                      affirmAsReceiver,
                                      {
                                        settlementId,
                                        legId,
                                        assetId: decryptedLeg.details.assetId,
                                        amount: decryptedLeg.details.amount,
                                      },
                                      `receiver-${legId}`,
                                    )
                                  }
                                  fullWidth
                                >
                                  Affirm as Receiver
                                </Button>,
                              );
                            }

                            // Receiver: Claim when affirmed and settlement executed
                            if (
                              isReceiver &&
                              receiverStatus === 'Affirmed' &&
                              settlementIsExecuted
                            ) {
                              actions.push(
                                <Button
                                  key="receiver-claim"
                                  color="teal"
                                  loading={actionLoading === `claim-${legId}`}
                                  onClick={() =>
                                    handleAction(
                                      claimAssets,
                                      {
                                        settlementId,
                                        legId,
                                        assetId: decryptedLeg.details.assetId,
                                        amount: decryptedLeg.details.amount,
                                      },
                                      `claim-${legId}`,
                                    )
                                  }
                                  fullWidth
                                >
                                  Claim Assets
                                </Button>,
                              );
                            }

                            // Mediator: Affirm/Reject when pending
                            if (
                              isMediator &&
                              settlementIsPending &&
                              mediatorStatus === 'Pending'
                            ) {
                              actions.push(
                                <Group key="mediator-actions" grow>
                                  <Button
                                    color="red"
                                    variant="light"
                                    loading={
                                      actionLoading ===
                                      `mediator-reject-${legId}`
                                    }
                                    onClick={() =>
                                      handleAction(
                                        affirmAsMediator,
                                        {
                                          settlementId,
                                          legId,
                                          assetId: decryptedLeg.details.assetId,
                                          amount: decryptedLeg.details.amount,
                                          accept: false,
                                        },
                                        `mediator-reject-${legId}`,
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    color="blue"
                                    loading={
                                      actionLoading ===
                                      `mediator-affirm-${legId}`
                                    }
                                    onClick={() =>
                                      handleAction(
                                        affirmAsMediator,
                                        {
                                          settlementId,
                                          legId,
                                          assetId: decryptedLeg.details.assetId,
                                          amount: decryptedLeg.details.amount,
                                          accept: true,
                                        },
                                        `mediator-affirm-${legId}`,
                                      )
                                    }
                                  >
                                    Affirm as Mediator
                                  </Button>
                                </Group>,
                              );
                            }

                            return actions;
                          })()}
                        </Stack>
                      </Stack>
                    )}

                    {isDecrypting && (
                      <Group justify="center" p="xl">
                        <Loader size="sm" />
                        <Text size="sm" c="dimmed">
                          Decrypting leg details...
                        </Text>
                      </Group>
                    )}

                    {isFailed && (
                      <Alert
                        icon={<IconLock size={16} />}
                        title="Decryption Failed"
                        color="red"
                        variant="light"
                      >
                        Failed to decrypt this leg.
                        {selectedKey && (
                          <Button
                            variant="subtle"
                            size="xs"
                            mt="sm"
                            onClick={() => handleDecryptLeg(legId)}
                          >
                            Retry Decryption
                          </Button>
                        )}
                      </Alert>
                    )}

                    {isNotInvolved && (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="Not Involved"
                        color="gray"
                        variant="light"
                      >
                        You are not a party to this leg.
                      </Alert>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Stack>

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
