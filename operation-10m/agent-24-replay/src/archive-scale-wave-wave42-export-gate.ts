import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave41IntegrationVerificationReport } from './replay-scale-wave-wave41-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave42ExportBlockerKind =
  | 'wave41_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave42ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave42ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave42ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave42ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave42ExportGateInput {
  matchId: string;
  replayScaleWaveWave41IntegrationVerification: Agent24ReplayScaleWaveWave41IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave42ExportGateReport(
  input: Agent24ArchiveScaleWaveWave42ExportGateInput,
): Agent24ArchiveScaleWaveWave42ExportGateReport {
  const waveRound = input.replayScaleWaveWave41IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave42ExportBlocker[] = [];

  if (!input.replayScaleWaveWave41IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave41_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave41IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww42_w36iv', {
        issues: input.replayScaleWaveWave41IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww42_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww42_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave41IntegrationVerification.verificationScore) * 0.08;
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

export function runAgent24ArchiveScaleWaveWave42ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave41IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 41,
    integrationBaselineSha: '875d6f3e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww41iv_t42', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 41,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t42', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t42', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t42', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave42ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave42_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 41 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave42ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
