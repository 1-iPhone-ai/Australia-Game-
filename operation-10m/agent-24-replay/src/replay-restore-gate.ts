import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveCompactionPlan } from './archive-compaction.ts';
import type { Agent24ReplayPlaybackIntegrityReport } from './replay-playback-integrity.ts';
import type { Agent24RewindSafetyReport } from './rewind-safety.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ReplayRestoreBlockerKind =
  | 'seal_unverified'
  | 'seal_not_sealed'
  | 'no_rewind_target'
  | 'playback_not_monotonic'
  | 'compaction_unsafe';

export interface Agent24ReplayRestoreBlocker {
  kind: Agent24ReplayRestoreBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayRestoreGateReport {
  reportId: string;
  matchId: string;
  restoreAllowed: boolean;
  recommendedRestoreTurn: number | null;
  blockerCount: number;
  blockers: Agent24ReplayRestoreBlocker[];
  restoreScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayRestoreGateInput {
  matchId: string;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
  rewindSafety: Agent24RewindSafetyReport;
  playbackIntegrity: Agent24ReplayPlaybackIntegrityReport;
  archiveCompaction: Agent24ArchiveCompactionPlan;
  minIntegrityScore?: number;
}

export function buildAgent24ReplayRestoreGateReport(
  input: Agent24ReplayRestoreGateInput,
): Agent24ReplayRestoreGateReport {
  const minIntegrity = input.minIntegrityScore ?? 70;
  const blockers: Agent24ReplayRestoreBlocker[] = [];

  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_unverified',
      detail: `Seal verification failed (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('restore_seal_verify', { issues: input.sealVerification.issueCount }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'seal_not_sealed',
      detail: 'Snapshot seal is not sealed',
      fingerprint: o6kAgent24Fingerprint('restore_seal', { sealed: false }),
    });
  }
  if (input.rewindSafety.safeTargetCount === 0) {
    blockers.push({
      kind: 'no_rewind_target',
      detail: 'No safe rewind checkpoint for restore anchor',
      fingerprint: o6kAgent24Fingerprint('restore_rewind', { safe: 0 }),
    });
  }
  if (!input.playbackIntegrity.monotonicTurns || input.playbackIntegrity.integrityScore < minIntegrity) {
    blockers.push({
      kind: 'playback_not_monotonic',
      detail: `Playback integrity ${input.playbackIntegrity.integrityScore} (monotonic=${input.playbackIntegrity.monotonicTurns})`,
      fingerprint: o6kAgent24Fingerprint('restore_playback', {
        score: input.playbackIntegrity.integrityScore,
        monotonic: input.playbackIntegrity.monotonicTurns,
      }),
    });
  }
  if (!input.archiveCompaction.compactionSafe) {
    blockers.push({
      kind: 'compaction_unsafe',
      detail: 'Archive compaction plan is not safe for restore',
      fingerprint: o6kAgent24Fingerprint('restore_compaction', { safe: false }),
    });
  }

  blockers.sort((a, b) => a.kind.localeCompare(b.kind));
  let restoreScore = 100;
  restoreScore -= blockers.length * 20;
  restoreScore = Math.max(0, Math.min(100, restoreScore));
  const restoreAllowed = blockers.length === 0;
  const recommendedRestoreTurn = restoreAllowed ? input.rewindSafety.recommendedTurn : null;

  return {
    reportId: o6kAgent24Fingerprint('replay_restore_gate', { matchId: input.matchId, restoreAllowed }),
    matchId: input.matchId,
    restoreAllowed,
    recommendedRestoreTurn,
    blockerCount: blockers.length,
    blockers,
    restoreScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_restore_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      restoreAllowed,
      recommendedRestoreTurn,
      restoreScore,
    }),
  };
}

export function runAgent24ReplayRestoreGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 10,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'c',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_self', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    linkMatchCount: 5,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_self', { v: 1 }),
  };
  const rewind = {
    reportId: 'r',
    matchId: 'self',
    currentTurn: 12,
    targets: [],
    safeTargetCount: 2,
    recommendedTurn: 8,
    deterministicFingerprint: o6kAgent24Fingerprint('rw_self', { v: 1 }),
  };
  const playback = {
    reportId: 'p',
    matchId: 'self',
    eventCount: 2,
    checkpointEventCount: 2,
    issueCount: 0,
    issues: [],
    monotonicTurns: true,
    integrityScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('pb_self', { v: 1 }),
  };
  const compaction = {
    planId: 'c',
    matchId: 'self',
    currentTurn: 12,
    eligibleBandCount: 1,
    protectedBandCount: 1,
    estimatedSlotsReclaimed: 3,
    compactionSafe: true,
    bands: [],
    compactionScore: 88,
    deterministicFingerprint: o6kAgent24Fingerprint('ac_self', { v: 3 }),
  };
  const gate = buildAgent24ReplayRestoreGateReport({
    matchId: 'self',
    snapshotSeal: seal,
    sealVerification,
    rewindSafety: rewind,
    playbackIntegrity: playback,
    archiveCompaction: compaction,
  });
  return [
    { name: 'allows_verified_sealed_bundle', passed: gate.restoreAllowed && gate.recommendedRestoreTurn === 8 },
    {
      name: 'deterministic_fingerprint',
      passed:
        gate.deterministicFingerprint ===
        buildAgent24ReplayRestoreGateReport({
          matchId: 'self',
          snapshotSeal: seal,
          sealVerification,
          rewindSafety: rewind,
          playbackIntegrity: playback,
          archiveCompaction: compaction,
        }).deterministicFingerprint,
    },
  ];
}
