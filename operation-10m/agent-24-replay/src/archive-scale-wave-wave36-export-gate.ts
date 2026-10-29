import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave35IntegrationVerificationReport } from './replay-scale-wave-wave35-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave36ExportBlockerKind =
  | 'wave35_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave36ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave36ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave36ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave36ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave36ExportGateInput {
  matchId: string;
  replayScaleWaveWave35IntegrationVerification: Agent24ReplayScaleWaveWave35IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave36ExportGateReport(
  input: Agent24ArchiveScaleWaveWave36ExportGateInput,
): Agent24ArchiveScaleWaveWave36ExportGateReport {
  const waveRound = input.replayScaleWaveWave35IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave36ExportBlocker[] = [];

  if (!input.replayScaleWaveWave35IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave35_integration_not_verified',
      detail: `Wave 35 integration verification open (${input.replayScaleWaveWave35IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww36_w35iv', {
        issues: input.replayScaleWaveWave35IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww36_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww36_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave35IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave36_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave36_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave36ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave35IntegrationVerification = {
    reportId: 'w35iv',
    matchId: 'self',
    waveRound: 35,
    integrationBaselineSha: '1f7d25be',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww35iv_t36', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t36', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t36', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t36', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave36ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave36_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 35 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave36ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
