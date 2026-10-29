import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave28IntegrationVerificationReport } from './replay-scale-wave-wave28-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave29ExportBlockerKind =
  | 'wave28_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave29ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave29ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave29ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave29ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave29ExportGateInput {
  matchId: string;
  replayScaleWaveWave28IntegrationVerification: Agent24ReplayScaleWaveWave28IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave29ExportGateReport(
  input: Agent24ArchiveScaleWaveWave29ExportGateInput,
): Agent24ArchiveScaleWaveWave29ExportGateReport {
  const waveRound = input.replayScaleWaveWave28IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave29ExportBlocker[] = [];

  if (!input.replayScaleWaveWave28IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave28_integration_not_verified',
      detail: `Wave 28 integration verification open (${input.replayScaleWaveWave28IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww29_w28iv', {
        issues: input.replayScaleWaveWave28IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww29_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww29_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave28IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave29_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave29_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave29ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave28IntegrationVerification = {
    reportId: 'w28iv',
    matchId: 'self',
    waveRound: 30,
    integrationBaselineSha: 'b9e129bd',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww28iv_t29', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t29', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t29', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t29', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave29ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave29_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave29ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
