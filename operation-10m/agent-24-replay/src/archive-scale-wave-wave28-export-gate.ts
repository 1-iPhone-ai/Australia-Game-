import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave27IntegrationVerificationReport } from './replay-scale-wave-wave27-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave28ExportBlockerKind =
  | 'wave27_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave28ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave28ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave28ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave28ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave28ExportGateInput {
  matchId: string;
  replayScaleWaveWave27IntegrationVerification: Agent24ReplayScaleWaveWave27IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave28ExportGateReport(
  input: Agent24ArchiveScaleWaveWave28ExportGateInput,
): Agent24ArchiveScaleWaveWave28ExportGateReport {
  const waveRound = input.replayScaleWaveWave27IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave28ExportBlocker[] = [];

  if (!input.replayScaleWaveWave27IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave27_integration_not_verified',
      detail: `Wave 27 integration verification open (${input.replayScaleWaveWave27IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww28_w26iv', {
        issues: input.replayScaleWaveWave27IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww28_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww28_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave27IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave28_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave28_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave28ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave27IntegrationVerification = {
    reportId: 'w26iv',
    matchId: 'self',
    waveRound: 29,
    integrationBaselineSha: 'de3079f9',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww27iv_t28', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t28', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t28', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t28', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave28ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave28_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 29 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave28ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
