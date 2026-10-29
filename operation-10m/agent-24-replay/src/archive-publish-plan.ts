import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveCompactionPlan } from './archive-compaction.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24ArchivePublishSlot {
  slotId: string;
  fromTurn: number;
  toTurn: number;
  publishable: boolean;
  reason: string;
  estimatedEventSlots: number;
  fingerprint: string;
}

export interface Agent24ArchivePublishPlan {
  planId: string;
  matchId: string;
  currentTurn: number;
  publishableSlotCount: number;
  withheldSlotCount: number;
  estimatedPublishedEvents: number;
  publishReady: boolean;
  slots: Agent24ArchivePublishSlot[];
  publishScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchivePublishPlanInput {
  matchId: string;
  currentTurn: number;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
  replayTransferGate: Agent24ReplayTransferGateReport;
  archiveCompaction: Agent24ArchiveCompactionPlan;
}

export function buildAgent24ArchivePublishPlan(input: Agent24ArchivePublishPlanInput): Agent24ArchivePublishPlan {
  const gatesOpen =
    input.snapshotSeal.sealed &&
    input.sealVerification.verified &&
    input.replayTransferGate.transferAllowed &&
    input.archiveCompaction.compactionSafe;

  const slots: Agent24ArchivePublishSlot[] = input.archiveCompaction.bands.map(band => {
    const publishable = gatesOpen && band.eligible && band.estimatedEventSlots > 0;
    let reason = publishable ? 'eligible_for_cold_archive' : 'withheld_by_gate_or_band';
    if (!gatesOpen) reason = 'publish_gates_not_open';
    else if (!band.eligible) reason = band.reason;
    return {
      slotId: o6kAgent24Fingerprint('publish_slot', {
        matchId: input.matchId,
        from: band.fromTurn,
        to: band.toTurn,
      }),
      fromTurn: band.fromTurn,
      toTurn: band.toTurn,
      publishable,
      reason,
      estimatedEventSlots: publishable ? band.estimatedEventSlots : 0,
      fingerprint: o6kAgent24Fingerprint('archive_publish_slot', {
        from: band.fromTurn,
        to: band.toTurn,
        publishable,
        reason,
      }),
    };
  });

  slots.sort((a, b) => a.fromTurn - b.fromTurn);
  const publishableSlotCount = slots.filter(s => s.publishable).length;
  const withheldSlotCount = slots.length - publishableSlotCount;
  const estimatedPublishedEvents = slots.reduce((sum, s) => sum + s.estimatedEventSlots, 0);

  let publishScore = 100;
  if (!gatesOpen) publishScore -= 40;
  if (publishableSlotCount === 0 && input.currentTurn > 12) publishScore -= 15;
  publishScore -= withheldSlotCount * 3;
  publishScore = Math.max(0, Math.min(100, publishScore));

  const publishReady = gatesOpen && publishableSlotCount > 0;

  return {
    planId: o6kAgent24Fingerprint('archive_publish_plan', { matchId: input.matchId, turn: input.currentTurn }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    publishableSlotCount,
    withheldSlotCount,
    estimatedPublishedEvents,
    publishReady,
    slots,
    publishScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_publish_plan_body', {
      slots: slots.map(s => s.fingerprint),
      publishReady,
      publishableSlotCount,
      publishScore,
    }),
  };
}

export function runAgent24ArchivePublishPlanSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 10,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'c',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_pub', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    linkMatchCount: 5,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_pub', { v: 1 }),
  };
  const transfer = {
    reportId: 't',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('tg_pub', { v: 1 }),
  };
  const compaction = {
    planId: 'c',
    matchId: 'self',
    currentTurn: 20,
    eligibleBandCount: 1,
    protectedBandCount: 1,
    estimatedSlotsReclaimed: 12,
    compactionSafe: true,
    bands: [
      {
        fromTurn: 1,
        toTurn: 5,
        eligible: true,
        reason: 'outside_prune_safe_window',
        estimatedEventSlots: 12,
        fingerprint: o6kAgent24Fingerprint('band_pub', { v: 1 }),
      },
    ],
    compactionScore: 90,
    deterministicFingerprint: o6kAgent24Fingerprint('ac_pub', { v: 1 }),
  };
  const plan = buildAgent24ArchivePublishPlan({
    matchId: 'self',
    currentTurn: 20,
    snapshotSeal: seal,
    sealVerification,
    replayTransferGate: transfer,
    archiveCompaction: compaction,
  });
  return [
    { name: 'publish_ready_with_eligible_band', passed: plan.publishReady && plan.publishableSlotCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        plan.deterministicFingerprint ===
        buildAgent24ArchivePublishPlan({
          matchId: 'self',
          currentTurn: 20,
          snapshotSeal: seal,
          sealVerification,
          replayTransferGate: transfer,
          archiveCompaction: compaction,
        }).deterministicFingerprint,
    },
  ];
}
