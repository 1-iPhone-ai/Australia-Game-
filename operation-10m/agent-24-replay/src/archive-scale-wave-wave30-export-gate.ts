import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave29IntegrationVerificationReport } from './replay-scale-wave-wave29-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave30ExportBlockerKind =
  | 'wave29_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave30ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave30ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave30ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave30ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave30ExportGateInput {
  matchId: string;
  replayScaleWaveWave29IntegrationVerification: Agent24ReplayScaleWaveWave29IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave30ExportGateReport(
  input: Agent24ArchiveScaleWaveWave30ExportGateInput,
): Agent24ArchiveScaleWaveWave30ExportGateReport {
  const waveRound = input.replayScaleWaveWave29IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave30ExportBlocker[] = [];

  if (!input.replayScaleWaveWave29IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave29_integration_not_verified',
      detail: `Wave 29 integration verification open (${input.replayScaleWaveWave29IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww30_w29iv', {
        issues: input.replayScaleWaveWave29IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww30_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww30_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave29IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave30_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave30_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave30ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave29IntegrationVerification = {
    reportId: 'w29iv',
    matchId: 'self',
    waveRound: 30,
    integrationBaselineSha: '70df4aee',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww29iv_t30', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t30', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t30', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t30', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave30ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave30_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave30ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
