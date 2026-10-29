import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveFullChunksVerificationReport } from './replay-scale-wave-full-chunks-verification.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24ArchiveScaleWaveWave23ExportBlockerKind =
  | 'full_chunks_not_verified'
  | 'snapshot_not_verified'
  | 'seal_verification_failed';

export interface Agent24ArchiveScaleWaveWave23ExportBlocker {
  kind: Agent24ArchiveScaleWaveWave23ExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave23ExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveWave23ExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveWave23ExportGateInput {
  matchId: string;
  replayScaleWaveFullChunksVerification: Agent24ReplayScaleWaveFullChunksVerificationReport;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24ArchiveScaleWaveWave23ExportGateReport(
  input: Agent24ArchiveScaleWaveWave23ExportGateInput,
): Agent24ArchiveScaleWaveWave23ExportGateReport {
  const waveRound = input.replayScaleWaveFullChunksVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveWave23ExportBlocker[] = [];

  if (!input.replayScaleWaveFullChunksVerification.verified) {
    blockers.push({
      kind: 'full_chunks_not_verified',
      detail: `Full-chunks verification open (${input.replayScaleWaveFullChunksVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww23_fc', {
        issues: input.replayScaleWaveFullChunksVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.snapshotSeal.sealed) {
    blockers.push({
      kind: 'snapshot_not_verified',
      detail: 'Snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('asww23_snap', { sealed: false, wave: waveRound }),
    });
  }
  if (!input.sealVerification.verified) {
    blockers.push({
      kind: 'seal_verification_failed',
      detail: `Seal verification open (${input.sealVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asww23_seal', {
        issues: input.sealVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 17;
  exportScore -= Math.max(0, 100 - input.replayScaleWaveFullChunksVerification.verificationScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_wave23_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_wave23_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveWave23ExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const fullChunksVerification = {
    reportId: 'fcv',
    matchId: 'self',
    waveRound: 23,
    fullChunksBaselineSha: 'b23e1449',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswfcv_t23', { v: 1 }),
  };
  const snapshotSeal = {
    sealId: 'ss',
    matchId: 'self',
    turn: 40,
    sealed: true,
    sealScore: 100,
    compositeBundleFingerprint: o6kAgent24Fingerprint('ss_t23', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('ss_body_t23', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'sv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_t23', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveWave23ExportGateReport({
    matchId: 'self',
    replayScaleWaveFullChunksVerification: fullChunksVerification,
    snapshotSeal,
    sealVerification,
  });

  return [
    { name: 'export_allowed_when_wave23_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 23 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveWave23ExportGateReport({
          matchId: 'self',
          replayScaleWaveFullChunksVerification: fullChunksVerification,
          snapshotSeal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
