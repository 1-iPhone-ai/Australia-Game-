import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave31IntegrationVerificationReport } from './replay-scale-wave-wave31-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave32ExportBlockerKind =
  | 'wave31_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave32ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave32ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave32ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave32ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave32ExportGateInput {
  matchId: string;
  replayScaleWaveWave31IntegrationVerification: Agent24ReplayScaleWaveWave31IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave32ExportGateReport(
  input: Agent24ArchiveScaleWaveWave32ExportGateInput,
): Agent24ArchiveScaleWaveWave32ExportGateReport {
  const waveRound = input.replayScaleWaveWave31IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave32ExportBlocker[] = [];

  if (!input.replayScaleWaveWave31IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave31_integration_not_verified',
      detail: `Wave 31 integration verification open (${input.replayScaleWaveWave31IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww32_w31iv', {
        issues: input.replayScaleWaveWave31IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww32_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww32_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave31IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave32_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave32_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave32ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave31IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 32,
    integrationBaselineSha: '81b50b8e',
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

  const report = buildAgent24ArchiveScaleWaveWave32ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave32_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave32ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
