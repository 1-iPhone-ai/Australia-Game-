import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchivePublishPlan } from './archive-publish-plan.ts';
import type { Agent24ReplayRestorePlan } from './replay-restore-plan.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24ArchivePublishDispatchJob {
  jobId: string;
  slotId: string;
  fromTurn: number;
  toTurn: number;
  dispatched: boolean;
  reason: string;
  eventSlots: number;
  fingerprint: string;
}

export interface Agent24ArchivePublishDispatchReport {
  reportId: string;
  matchId: string;
  currentTurn: number;
  dispatchAllowed: boolean;
  jobCount: number;
  dispatchedJobCount: number;
  withheldJobCount: number;
  estimatedDispatchedEvents: number;
  jobs: Agent24ArchivePublishDispatchJob[];
  dispatchScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchivePublishDispatchInput {
  matchId: string;
  currentTurn: number;
  snapshotSeal: Agent24SnapshotSeal;
  archivePublishPlan: Agent24ArchivePublishPlan;
  replayRestorePlan: Agent24ReplayRestorePlan;
}

export function buildAgent24ArchivePublishDispatchReport(
  input: Agent24ArchivePublishDispatchInput,
): Agent24ArchivePublishDispatchReport {
  const gatesOpen =
    input.snapshotSeal.sealed &&
    input.archivePublishPlan.publishReady &&
    input.replayRestorePlan.restoreAllowed;

  const jobs: Agent24ArchivePublishDispatchJob[] = input.archivePublishPlan.slots.map(slot => {
    const dispatched = gatesOpen && slot.publishable;
    let reason = dispatched ? 'dispatched_to_cold_archive' : 'withheld';
    if (!input.snapshotSeal.sealed) reason = 'seal_not_sealed';
    else if (!input.archivePublishPlan.publishReady) reason = 'publish_plan_not_ready';
    else if (!input.replayRestorePlan.restoreAllowed) reason = 'restore_plan_not_ready';
    else if (!slot.publishable) reason = slot.reason;

    return {
      jobId: o6kAgent24Fingerprint('publish_dispatch_job', {
        matchId: input.matchId,
        slot: slot.slotId,
      }),
      slotId: slot.slotId,
      fromTurn: slot.fromTurn,
      toTurn: slot.toTurn,
      dispatched,
      reason,
      eventSlots: dispatched ? slot.estimatedEventSlots : 0,
      fingerprint: o6kAgent24Fingerprint('publish_dispatch_job_body', {
        slot: slot.slotId,
        dispatched,
        reason,
        events: dispatched ? slot.estimatedEventSlots : 0,
      }),
    };
  });

  jobs.sort((a, b) => a.fromTurn - b.fromTurn);
  const dispatchedJobCount = jobs.filter(j => j.dispatched).length;
  const withheldJobCount = jobs.length - dispatchedJobCount;
  const estimatedDispatchedEvents = jobs.reduce((sum, j) => sum + j.eventSlots, 0);

  let dispatchScore = 100;
  if (!gatesOpen) dispatchScore -= 35;
  if (dispatchedJobCount === 0 && input.currentTurn > 15) dispatchScore -= 15;
  dispatchScore -= withheldJobCount * 2;
  dispatchScore = Math.max(0, Math.min(100, dispatchScore));

  const dispatchAllowed = gatesOpen && dispatchedJobCount > 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_publish_dispatch', {
      matchId: input.matchId,
      turn: input.currentTurn,
    }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    dispatchAllowed,
    jobCount: jobs.length,
    dispatchedJobCount,
    withheldJobCount,
    estimatedDispatchedEvents,
    jobs,
    dispatchScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_publish_dispatch_body', {
      jobs: jobs.map(j => j.fingerprint),
      dispatchAllowed,
      dispatchedJobCount,
      dispatchScore,
    }),
  };
}

export function runAgent24ArchivePublishDispatchSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 20,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'c',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_disp', { v: 1 }),
  };
  const publishPlan = {
    planId: 'p',
    matchId: 'self',
    currentTurn: 20,
    publishableSlotCount: 1,
    withheldSlotCount: 0,
    estimatedPublishedEvents: 10,
    publishReady: true,
    publishScore: 90,
    slots: [
      {
        slotId: 'slot1',
        fromTurn: 1,
        toTurn: 5,
        publishable: true,
        reason: 'eligible_for_cold_archive',
        estimatedEventSlots: 10,
        fingerprint: o6kAgent24Fingerprint('slot_disp', { v: 1 }),
      },
    ],
    deterministicFingerprint: o6kAgent24Fingerprint('ap_disp', { v: 1 }),
  };
  const restorePlan = {
    planId: 'rp',
    matchId: 'self',
    restoreAllowed: true,
    anchorTurn: 12,
    stepCount: 4,
    requiredStepCount: 3,
    steps: [],
    restorePlanScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rp_disp', { v: 1 }),
  };

  const report = buildAgent24ArchivePublishDispatchReport({
    matchId: 'self',
    currentTurn: 20,
    snapshotSeal: seal,
    archivePublishPlan: publishPlan,
    replayRestorePlan: restorePlan,
  });

  return [
    { name: 'dispatch_jobs_when_gates_open', passed: report.dispatchAllowed && report.dispatchedJobCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchivePublishDispatchReport({
          matchId: 'self',
          currentTurn: 20,
          snapshotSeal: seal,
          archivePublishPlan: publishPlan,
          replayRestorePlan: restorePlan,
        }).deterministicFingerprint,
    },
  ];
}
