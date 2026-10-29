import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave24IntegrationVerificationReport } from './replay-scale-wave-wave24-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave25ExportBlockerKind =
  | 'wave24_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave25ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave25ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave25ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave25ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave25ExportGateInput {
  matchId: string;
  replayScaleWaveWave24IntegrationVerification: Agent24ReplayScaleWaveWave24IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave25ExportGateReport(
  input: Agent24ArchiveScaleWaveWave25ExportGateInput,
): Agent24ArchiveScaleWaveWave25ExportGateReport {
  const waveRound = input.replayScaleWaveWave24IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave25ExportBlocker[] = [];

  if (!input.replayScaleWaveWave24IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave24_integration_not_verified',
      detail: `Wave 24 integration verification open (${input.replayScaleWaveWave24IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww25_w24iv', {
        issues: input.replayScaleWaveWave24IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww25_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww25_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave24IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave25_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave25_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave25ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave24IntegrationVerification = {
    reportId: 'w24iv',
    matchId: 'self',
    waveRound: 25,
    integrationBaselineSha: 'b64a7aa8',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww24iv_t25', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t25', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t25', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t25', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave25ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave24IntegrationVerification: wave24IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave25_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 25 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave25ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave24IntegrationVerification: wave24IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
