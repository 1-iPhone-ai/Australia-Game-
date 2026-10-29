import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24CheckpointCoverageReport } from './checkpoint-coverage.ts';
import type { Agent24HistoryReconciliationReport } from './history-reconciliation.ts';
import type { Agent24ReplayAttestation } from './replay-attestation.ts';
import type { Agent24ReplayPlaybackIntegrityReport } from './replay-playback-integrity.ts';
import type { Agent24RewindSafetyReport } from './rewind-safety.ts';

export type Agent24ExportBlockerKind =
  | 'attestation'
  | 'reconciliation'
  | 'checkpoint_coverage'
  | 'playback_integrity'
  | 'rewind_safety';

export interface Agent24ExportReadinessBlocker {
  kind: Agent24ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ExportReadinessReport {
  reportId: string;
  matchId: string;
  ready: boolean;
  readinessScore: number;
  blockerCount: number;
  blockers: Agent24ExportReadinessBlocker[];
  deterministicFingerprint: string;
}

export interface Agent24ExportReadinessInput {
  matchId: string;
  attestation: Agent24ReplayAttestation;
  historyReconciliation: Agent24HistoryReconciliationReport;
  checkpointCoverage: Agent24CheckpointCoverageReport;
  playbackIntegrity: Agent24ReplayPlaybackIntegrityReport;
  rewindSafety: Agent24RewindSafetyReport;
  minCoverageScore?: number;
  minIntegrityScore?: number;
}

export function buildAgent24ExportReadinessReport(input: Agent24ExportReadinessInput): Agent24ExportReadinessReport {
  const minCoverage = input.minCoverageScore ?? 60;
  const minIntegrity = input.minIntegrityScore ?? 70;
  const blockers: Agent24ExportReadinessBlocker[] = [];

  if (input.attestation.status !== 'verified') {
    blockers.push({
      kind: 'attestation',
      detail: `Attestation status is ${input.attestation.status}, expected verified`,
      fingerprint: o6kAgent24Fingerprint('export_block_attest', { status: input.attestation.status }),
    });
  }
  if (!input.historyReconciliation.reconciled) {
    blockers.push({
      kind: 'reconciliation',
      detail: `History reconciliation open (${input.historyReconciliation.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('export_block_recon', { issues: input.historyReconciliation.issueCount }),
    });
  }
  if (input.checkpointCoverage.coverageScore < minCoverage) {
    blockers.push({
      kind: 'checkpoint_coverage',
      detail: `Checkpoint coverage score ${input.checkpointCoverage.coverageScore} below ${minCoverage}`,
      fingerprint: o6kAgent24Fingerprint('export_block_coverage', { score: input.checkpointCoverage.coverageScore }),
    });
  }
  if (!input.playbackIntegrity.monotonicTurns || input.playbackIntegrity.integrityScore < minIntegrity) {
    blockers.push({
      kind: 'playback_integrity',
      detail: `Playback integrity score ${input.playbackIntegrity.integrityScore} (monotonic=${input.playbackIntegrity.monotonicTurns})`,
      fingerprint: o6kAgent24Fingerprint('export_block_playback', {
        score: input.playbackIntegrity.integrityScore,
        monotonic: input.playbackIntegrity.monotonicTurns,
      }),
    });
  }
  if (input.rewindSafety.safeTargetCount === 0) {
    blockers.push({
      kind: 'rewind_safety',
      detail: 'No safe rewind targets — export may not be replayable',
      fingerprint: o6kAgent24Fingerprint('export_block_rewind', { safe: 0 }),
    });
  }

  blockers.sort((a, b) => a.kind.localeCompare(b.kind));
  let readinessScore = 100;
  readinessScore -= blockers.length * 18;
  readinessScore = Math.max(0, Math.min(100, readinessScore));
  const ready = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('export_readiness', { matchId: input.matchId, ready }),
    matchId: input.matchId,
    ready,
    readinessScore,
    blockerCount: blockers.length,
    blockers,
    deterministicFingerprint: o6kAgent24Fingerprint('export_readiness_body', {
      blockers: blockers.map(b => b.fingerprint),
      ready,
      readinessScore,
    }),
  };
}
