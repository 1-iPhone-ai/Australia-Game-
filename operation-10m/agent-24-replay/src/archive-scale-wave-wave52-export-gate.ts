import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave51IntegrationVerificationReport } from './replay-scale-wave-wave51-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave52ExportBlockerKind =
  | 'wave51_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave52ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave52ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave52ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave52ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave52ExportGateInput {
  matchId: string;
  replayScaleWaveWave51IntegrationVerification: Agent24ReplayScaleWaveWave51IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave52ExportGateReport(
  input: Agent24ArchiveScaleWaveWave52ExportGateInput,
): Agent24ArchiveScaleWaveWave52ExportGateReport {
  const waveRound = input.replayScaleWaveWave51IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave52ExportBlocker[] = [];

  if (!input.replayScaleWaveWave51IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave51_integration_not_verified',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave51IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww52_w36iv', {
        issues: input.replayScaleWaveWave51IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww52_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww52_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave51IntegrationVerification.verificationScore) * 0.08;
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

export function runAgent24ArchiveScaleWaveWave52ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave51IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 51,
    integrationBaselineSha: '875d6f3e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww51iv_t52', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 51,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t52', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t52', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t52', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave52ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave51IntegrationVerification: wave51IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave52_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 51 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave52ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave51IntegrationVerification: wave51IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
