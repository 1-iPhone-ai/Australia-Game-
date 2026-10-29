import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveHandoffSeal } from './archive-handoff-seal.ts';
import type { Agent24ArchiveRoundtripGateReport } from './archive-roundtrip-gate.ts';
import type { Agent24ReplayPipelineCloseoutReport } from './replay-pipeline-closeout.ts';

export type Agent24ArchiveContinuityFinalizationBlockerKind =
  | 'closeout_incomplete'
  | 'handoff_not_ready'
  | 'roundtrip_blocked';

export interface Agent24ArchiveContinuityFinalizationBlocker {
  kind: Agent24ArchiveContinuityFinalizationBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveContinuityFinalizationReport {
  reportId: string;
  matchId: string;
  finalized: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveContinuityFinalizationBlocker[];
  finalizationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveContinuityFinalizationInput {
  matchId: string;
  replayPipelineCloseout: Agent24ReplayPipelineCloseoutReport;
  archiveHandoffSeal: Agent24ArchiveHandoffSeal;
  archiveRoundtripGate: Agent24ArchiveRoundtripGateReport;
}

export function buildAgent24ArchiveContinuityFinalizationReport(
  input: Agent24ArchiveContinuityFinalizationInput,
): Agent24ArchiveContinuityFinalizationReport {
  const blockers: Agent24ArchiveContinuityFinalizationBlocker[] = [];

  if (!input.replayPipelineCloseout.closeoutComplete) {
    blockers.push({
      kind: 'closeout_incomplete',
      detail: `Pipeline closeout ${input.replayPipelineCloseout.satisfiedCheckpointCount}/${input.replayPipelineCloseout.checkpointCount}`,
      fingerprint: o6kAgent24Fingerprint('acf_closeout', {
        satisfied: input.replayPipelineCloseout.satisfiedCheckpointCount,
      }),
    });
  }
  if (!input.archiveHandoffSeal.handoffReady) {
    blockers.push({
      kind: 'handoff_not_ready',
      detail: 'Archive handoff seal not ready',
      fingerprint: o6kAgent24Fingerprint('acf_handoff', { ready: false }),
    });
  }
  if (!input.archiveRoundtripGate.roundtripAllowed) {
    blockers.push({
      kind: 'roundtrip_blocked',
      detail: `Roundtrip gate blocked (${input.archiveRoundtripGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('acf_roundtrip', {
        blockers: input.archiveRoundtripGate.blockerCount,
      }),
    });
  }

  let finalizationScore = 100;
  finalizationScore -= blockers.length * 24;
  finalizationScore -= Math.max(0, 100 - input.replayPipelineCloseout.closeoutScore) * 0.15;
  finalizationScore = Math.max(0, Math.min(100, Math.round(finalizationScore)));

  const finalized = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_continuity_finalization', { matchId: input.matchId }),
    matchId: input.matchId,
    finalized,
    blockerCount: blockers.length,
    blockers,
    finalizationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_continuity_finalization_body', {
      blockers: blockers.map(b => b.fingerprint),
      finalized,
      finalizationScore,
    }),
  };
}

export function runAgent24ArchiveContinuityFinalizationSelfTests(): Array<{ name: string; passed: boolean }> {
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    currentTurn: 40,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rpc_f', { v: 1 }),
  };
  const handoff = {
    sealId: 'h',
    matchId: 'self',
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('ahs_f', { v: 1 }),
  };
  const roundtripGate = {
    reportId: 'rg',
    matchId: 'self',
    roundtripAllowed: true,
    blockerCount: 0,
    blockers: [],
    roundtripScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rtg_f', { v: 1 }),
  };

  const report = buildAgent24ArchiveContinuityFinalizationReport({
    matchId: 'self',
    replayPipelineCloseout: closeout,
    archiveHandoffSeal: handoff,
    archiveRoundtripGate: roundtripGate,
  });

  return [
    { name: 'finalized_when_pipeline_complete', passed: report.finalized && report.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveContinuityFinalizationReport({
          matchId: 'self',
          replayPipelineCloseout: closeout,
          archiveHandoffSeal: handoff,
          archiveRoundtripGate: roundtripGate,
        }).deterministicFingerprint,
    },
  ];
}
