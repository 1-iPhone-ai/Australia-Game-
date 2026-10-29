import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave38IntegrationVerificationReport } from './replay-scale-wave-wave38-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave39ExportBlockerKind =
  | 'wave38_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave39ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave39ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave39ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave39ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave39ExportGateInput {
  matchId: string;
  replayScaleWaveWave38IntegrationVerification: Agent24ReplayScaleWaveWave38IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave39ExportGateReport(
  input: Agent24ArchiveScaleWaveWave39ExportGateInput,
): Agent24ArchiveScaleWaveWave39ExportGateReport {
  const waveRound = input.replayScaleWaveWave38IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave39ExportBlocker[] = [];

  if (!input.replayScaleWaveWave38IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave38_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave38IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww39_w36iv', {
        issues: input.replayScaleWaveWave38IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww39_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww39_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave38IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave39_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave39_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave39ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave38IntegrationVerification = {
    reportId: 'w38iv',
    matchId: 'self',
    waveRound: 38,
    integrationBaselineSha: 'b44b36fe',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww38iv_t39', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t39', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t39', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t39', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave39ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave39_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 38 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave39ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
