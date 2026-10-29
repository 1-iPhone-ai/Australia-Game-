import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave32IntegrationVerificationReport } from './replay-scale-wave-wave32-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave33ExportBlockerKind =
  | 'wave32_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave33ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave33ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave33ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave33ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave33ExportGateInput {
  matchId: string;
  replayScaleWaveWave32IntegrationVerification: Agent24ReplayScaleWaveWave32IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave33ExportGateReport(
  input: Agent24ArchiveScaleWaveWave33ExportGateInput,
): Agent24ArchiveScaleWaveWave33ExportGateReport {
  const waveRound = input.replayScaleWaveWave32IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave33ExportBlocker[] = [];

  if (!input.replayScaleWaveWave32IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave32_integration_not_verified',
      detail: `Wave 31 integration verification open (${input.replayScaleWaveWave32IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww33_w31iv', {
        issues: input.replayScaleWaveWave32IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww33_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww33_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave32IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave33_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave33_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave33ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave32IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: 'aa70dace',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww31iv_t33', { v: 1 }),
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

  const report = buildAgent24ArchiveScaleWaveWave33ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave32IntegrationVerification: wave32IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave33_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 33 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave33ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave32IntegrationVerification: wave32IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
