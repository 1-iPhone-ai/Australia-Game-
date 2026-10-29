import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave40IntegrationVerificationReport } from './replay-scale-wave-wave40-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave41ExportBlockerKind =
  | 'wave40_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave41ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave41ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave41ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave41ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave41ExportGateInput {
  matchId: string;
  replayScaleWaveWave40IntegrationVerification: Agent24ReplayScaleWaveWave40IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave41ExportGateReport(
  input: Agent24ArchiveScaleWaveWave41ExportGateInput,
): Agent24ArchiveScaleWaveWave41ExportGateReport {
  const waveRound = input.replayScaleWaveWave40IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave41ExportBlocker[] = [];

  if (!input.replayScaleWaveWave40IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave40_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave40IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww41_w36iv', {
        issues: input.replayScaleWaveWave40IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww41_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww41_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave40IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave41_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave41_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave41ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave40IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 40,
    integrationBaselineSha: '6f7fa49e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww40iv_t41', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t41', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t41', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t41', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave41ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave41_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 40 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave41ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
