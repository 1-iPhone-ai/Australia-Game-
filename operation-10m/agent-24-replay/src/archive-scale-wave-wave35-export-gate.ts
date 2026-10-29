import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave34IntegrationVerificationReport } from './replay-scale-wave-wave34-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave35ExportBlockerKind =
  | 'wave34_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave35ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave35ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave35ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave35ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave35ExportGateInput {
  matchId: string;
  replayScaleWaveWave34IntegrationVerification: Agent24ReplayScaleWaveWave34IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave35ExportGateReport(
  input: Agent24ArchiveScaleWaveWave35ExportGateInput,
): Agent24ArchiveScaleWaveWave35ExportGateReport {
  const waveRound = input.replayScaleWaveWave34IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave35ExportBlocker[] = [];

  if (!input.replayScaleWaveWave34IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave34_integration_not_verified',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave34IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww35_w31iv', {
        issues: input.replayScaleWaveWave34IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww35_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww35_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave34IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave35_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave35_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave35ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave33IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: 'c5f6d0be',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww33iv_t35', { v: 1 }),
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

  const report = buildAgent24ArchiveScaleWaveWave35ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave34IntegrationVerification: wave33IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave35_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 33 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave35ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave34IntegrationVerification: wave33IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
