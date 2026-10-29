import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave30IntegrationVerificationReport } from './replay-scale-wave-wave30-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave31ExportBlockerKind =
  | 'wave30_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave31ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave31ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave31ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave31ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave31ExportGateInput {
  matchId: string;
  replayScaleWaveWave30IntegrationVerification: Agent24ReplayScaleWaveWave30IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave31ExportGateReport(
  input: Agent24ArchiveScaleWaveWave31ExportGateInput,
): Agent24ArchiveScaleWaveWave31ExportGateReport {
  const waveRound = input.replayScaleWaveWave30IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave31ExportBlocker[] = [];

  if (!input.replayScaleWaveWave30IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave30_integration_not_verified',
      detail: `Wave 30 integration verification open (${input.replayScaleWaveWave30IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww31_w30iv', {
        issues: input.replayScaleWaveWave30IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww31_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww31_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave30IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave31_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave31_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave31ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave30IntegrationVerification = {
    reportId: 'w30iv',
    matchId: 'self',
    waveRound: 32,
    integrationBaselineSha: '88fa570e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww30iv_t31', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t31', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t31', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t31', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave31ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave31_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave31ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
