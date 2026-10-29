import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave36IntegrationVerificationReport } from './replay-scale-wave-wave36-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave37ExportBlockerKind =
  | 'wave36_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave37ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave37ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave37ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave37ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave37ExportGateInput {
  matchId: string;
  replayScaleWaveWave36IntegrationVerification: Agent24ReplayScaleWaveWave36IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave37ExportGateReport(
  input: Agent24ArchiveScaleWaveWave37ExportGateInput,
): Agent24ArchiveScaleWaveWave37ExportGateReport {
  const waveRound = input.replayScaleWaveWave36IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave37ExportBlocker[] = [];

  if (!input.replayScaleWaveWave36IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave36_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave36IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww37_w36iv', {
        issues: input.replayScaleWaveWave36IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww37_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww37_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave36IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave37_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave37_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave37ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave36IntegrationVerification = {
    reportId: 'w36iv',
    matchId: 'self',
    waveRound: 36,
    integrationBaselineSha: 'ea2bb03e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww36iv_t37', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t37', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t37', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t37', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave37ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave37_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 36 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave37ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
