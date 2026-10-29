import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave25IntegrationVerificationReport } from './replay-scale-wave-wave25-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave26ExportBlockerKind =
  | 'wave25_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave26ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave26ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave26ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave26ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave26ExportGateInput {
  matchId: string;
  replayScaleWaveWave25IntegrationVerification: Agent24ReplayScaleWaveWave25IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave26ExportGateReport(
  input: Agent24ArchiveScaleWaveWave26ExportGateInput,
): Agent24ArchiveScaleWaveWave26ExportGateReport {
  const waveRound = input.replayScaleWaveWave25IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave26ExportBlocker[] = [];

  if (!input.replayScaleWaveWave25IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave25_integration_not_verified',
      detail: `Wave 25 integration verification open (${input.replayScaleWaveWave25IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww26_w25iv', {
        issues: input.replayScaleWaveWave25IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww26_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww26_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave25IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave26_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave26_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave26ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave25IntegrationVerification = {
    reportId: 'w25iv',
    matchId: 'self',
    waveRound: 26,
    integrationBaselineSha: '8d741ac7',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww25iv_t26', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t26', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t26', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t26', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave26ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave26_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 26 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave26ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
