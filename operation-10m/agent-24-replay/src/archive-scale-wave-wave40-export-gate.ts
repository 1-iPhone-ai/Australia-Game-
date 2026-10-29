import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave39IntegrationVerificationReport } from './replay-scale-wave-wave39-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave40ExportBlockerKind =
  | 'wave39_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave40ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave40ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave40ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave40ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave40ExportGateInput {
  matchId: string;
  replayScaleWaveWave39IntegrationVerification: Agent24ReplayScaleWaveWave39IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave40ExportGateReport(
  input: Agent24ArchiveScaleWaveWave40ExportGateInput,
): Agent24ArchiveScaleWaveWave40ExportGateReport {
  const waveRound = input.replayScaleWaveWave39IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave40ExportBlocker[] = [];

  if (!input.replayScaleWaveWave39IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave39_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave39IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww40_w36iv', {
        issues: input.replayScaleWaveWave39IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww40_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww40_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave39IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave40_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave40_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave40ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave39IntegrationVerification = {
    reportId: 'w39iv',
    matchId: 'self',
    waveRound: 38,
    integrationBaselineSha: '6f7fa49e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww39iv_t40', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t40', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t40', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t40', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave40ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave40_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 39 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave40ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
