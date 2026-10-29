import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchivePublishDispatchReport } from './archive-publish-dispatch.ts';
import type { Agent24ArchivePublishPlan } from './archive-publish-plan.ts';
import type { Agent24ReplayScaleWaveAcceptanceReport } from './replay-scale-wave-acceptance.ts';

export type Agent24ArchiveReleaseBlockerKind =
  | 'wave_not_accepted'
  | 'publish_plan_not_ready'
  | 'dispatch_not_allowed';

export interface Agent24ArchiveReleaseBlocker {
  kind: Agent24ArchiveReleaseBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveReleaseGateReport {
  reportId: string;
  matchId: string;
  releaseAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveReleaseBlocker[];
  releaseScore: number;
  publishableSlotCount: number;
  dispatchedJobCount: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveReleaseGateInput {
  matchId: string;
  replayScaleWaveAcceptance: Agent24ReplayScaleWaveAcceptanceReport;
  archivePublishPlan: Agent24ArchivePublishPlan;
  archivePublishDispatch: Agent24ArchivePublishDispatchReport;
}

export function buildAgent24ArchiveReleaseGateReport(
  input: Agent24ArchiveReleaseGateInput,
): Agent24ArchiveReleaseGateReport {
  const blockers: Agent24ArchiveReleaseBlocker[] = [];

  if (!input.replayScaleWaveAcceptance.accepted) {
    blockers.push({
      kind: 'wave_not_accepted',
      detail: `Scale wave ${input.replayScaleWaveAcceptance.waveRound} not accepted`,
      fingerprint: o6kAgent24Fingerprint('arg_wave', { wave: input.replayScaleWaveAcceptance.waveRound }),
    });
  }
  if (!input.archivePublishPlan.publishReady) {
    blockers.push({
      kind: 'publish_plan_not_ready',
      detail: `Publish plan score ${input.archivePublishPlan.publishScore}`,
      fingerprint: o6kAgent24Fingerprint('arg_plan', { ready: false }),
    });
  }
  if (!input.archivePublishDispatch.dispatchAllowed) {
    blockers.push({
      kind: 'dispatch_not_allowed',
      detail: `Publish dispatch withheld (${input.archivePublishDispatch.withheldJobCount} jobs)`,
      fingerprint: o6kAgent24Fingerprint('arg_dispatch', {
        withheld: input.archivePublishDispatch.withheldJobCount,
      }),
    });
  }

  let releaseScore = 100;
  releaseScore -= blockers.length * 22;
  releaseScore -= Math.max(0, 100 - input.replayScaleWaveAcceptance.acceptanceScore) * 0.12;
  releaseScore = Math.max(0, Math.min(100, Math.round(releaseScore)));

  const releaseAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_release_gate', { matchId: input.matchId }),
    matchId: input.matchId,
    releaseAllowed,
    blockerCount: blockers.length,
    blockers,
    releaseScore,
    publishableSlotCount: input.archivePublishPlan.publishableSlotCount,
    dispatchedJobCount: input.archivePublishDispatch.dispatchedJobCount,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_release_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      releaseAllowed,
      releaseScore,
    }),
  };
}

export function runAgent24ArchiveReleaseGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const waveAcceptance = {
    reportId: 'wa',
    matchId: 'self',
    waveRound: 26,
    accepted: true,
    blockerCount: 0,
    blockers: [],
    acceptanceScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswa_t', { v: 1 }),
  };
  const publishPlan = {
    planId: 'pp',
    matchId: 'self',
    currentTurn: 40,
    publishableSlotCount: 2,
    withheldSlotCount: 0,
    estimatedPublishedEvents: 120,
    publishReady: true,
    slots: [],
    publishScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('app_t', { v: 1 }),
  };
  const publishDispatch = {
    reportId: 'pd',
    matchId: 'self',
    currentTurn: 40,
    dispatchAllowed: true,
    jobCount: 2,
    dispatchedJobCount: 2,
    withheldJobCount: 0,
    estimatedDispatchedEvents: 120,
    jobs: [],
    dispatchScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('apd_t', { v: 1 }),
  };

  const report = buildAgent24ArchiveReleaseGateReport({
    matchId: 'self',
    replayScaleWaveAcceptance: waveAcceptance,
    archivePublishPlan: publishPlan,
    archivePublishDispatch: publishDispatch,
  });

  return [
    { name: 'release_allowed_when_pipeline_ready', passed: report.releaseAllowed && report.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveReleaseGateReport({
          matchId: 'self',
          replayScaleWaveAcceptance: waveAcceptance,
          archivePublishPlan: publishPlan,
          archivePublishDispatch: publishDispatch,
        }).deterministicFingerprint,
    },
  ];
}
