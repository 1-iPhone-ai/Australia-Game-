import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave26IntegrationVerificationReport } from './replay-scale-wave-wave26-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave27ExportBlockerKind =
  | 'wave26_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave27ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave27ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave27ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave27ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave27ExportGateInput {
  matchId: string;
  replayScaleWaveWave26IntegrationVerification: Agent24ReplayScaleWaveWave26IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave27ExportGateReport(
  input: Agent24ArchiveScaleWaveWave27ExportGateInput,
): Agent24ArchiveScaleWaveWave27ExportGateReport {
  const waveRound = input.replayScaleWaveWave26IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave27ExportBlocker[] = [];

  if (!input.replayScaleWaveWave26IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave26_integration_not_verified',
      detail: `Wave 26 integration verification open (${input.replayScaleWaveWave26IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww27_w26iv', {
        issues: input.replayScaleWaveWave26IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww27_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww27_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave26IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave27_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave27_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave27ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave26IntegrationVerification = {
    reportId: 'w26iv',
    matchId: 'self',
    waveRound: 28,
    integrationBaselineSha: 'de3079f9',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww26iv_t27', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t27', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t27', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t27', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave27ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave27_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 28 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave27ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
