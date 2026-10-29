import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveWave23IntegrationVerificationReport } from './replay-scale-wave-wave23-integration-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave24ExportBlockerKind =
  | 'wave23_integration_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave24ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave24ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave24ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave24ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave24ExportGateInput {
  matchId: string;
  replayScaleWaveWave23IntegrationVerification: Agent24ReplayScaleWaveWave23IntegrationVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave24ExportGateReport(
  input: Agent24ArchiveScaleWaveWave24ExportGateInput,
): Agent24ArchiveScaleWaveWave24ExportGateReport {
  const waveRound = input.replayScaleWaveWave23IntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave24ExportBlocker[] = [];

  if (!input.replayScaleWaveWave23IntegrationVerification.verified) {
    blockers.push({
      kind: 'wave23_integration_not_verified',
      detail: `Wave 23 integration verification open (${input.replayScaleWaveWave23IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww24_w23iv', {
        issues: input.replayScaleWaveWave23IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww24_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww24_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveWave23IntegrationVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave24_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave24_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave24ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave23IntegrationVerification = {
    reportId: 'w23iv',
    matchId: 'self',
    waveRound: 24,
    integrationBaselineSha: 'b23e1449',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww23iv_t24', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t24', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t24', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t24', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave24ExportGateReport({
    matchId: 'self',
    replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave24_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 24 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave24ExportGateReport({
          matchId: 'self',
          replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
