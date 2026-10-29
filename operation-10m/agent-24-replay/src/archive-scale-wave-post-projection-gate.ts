import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ContinuityExportGateReport } from './continuity-export-gate.ts';
import type { Agent24ReplayScaleWaveProjectionVerificationReport } from './replay-scale-wave-projection-verification.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';

export type Agent24ArchiveScaleWavePostProjectionBlockerKind =
  | 'projection_not_verified'
  | 'transfer_not_ready'
  | 'continuity_export_blocked';

export interface Agent24ArchiveScaleWavePostProjectionBlocker {
  kind: Agent24ArchiveScaleWavePostProjectionBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWavePostProjectionGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  gateOpen: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWavePostProjectionBlocker[];
  gateScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWavePostProjectionGateInput {
  matchId: string;
  replayScaleWaveProjectionVerification: Agent24ReplayScaleWaveProjectionVerificationReport;
  replayTransferGate: Agent24ReplayTransferGateReport;
  continuityExportGate: Agent24ContinuityExportGateReport;
}

export function buildAgent24ArchiveScaleWavePostProjectionGateReport(
  input: Agent24ArchiveScaleWavePostProjectionGateInput,
): Agent24ArchiveScaleWavePostProjectionGateReport {
  const waveRound = input.replayScaleWaveProjectionVerification.waveRound;
  const blockers: Agent24ArchiveScaleWavePostProjectionBlocker[] = [];

  if (!input.replayScaleWaveProjectionVerification.verified) {
    blockers.push({
      kind: 'projection_not_verified',
      detail: `Projection verification open (${input.replayScaleWaveProjectionVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswpp_proj', {
        issues: input.replayScaleWaveProjectionVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayTransferGate.transferAllowed) {
    blockers.push({
      kind: 'transfer_not_ready',
      detail: `Replay transfer gate blocked (${input.replayTransferGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('aswpp_transfer', {
        blockers: input.replayTransferGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.continuityExportGate.exportAllowed) {
    blockers.push({
      kind: 'continuity_export_blocked',
      detail: `Continuity export gate blocked (${input.continuityExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('aswpp_cex', {
        blockers: input.continuityExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }

  let gateScore = 100;
  gateScore -= blockers.length * 17;
  gateScore -= Math.max(0, 100 - input.replayScaleWaveProjectionVerification.verificationScore) * 0.08;
  gateScore = Math.max(0, Math.min(100, Math.round(gateScore)));

  const gateOpen = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_post_projection_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    gateOpen,
    blockerCount: blockers.length,
    blockers,
    gateScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_post_projection_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      gateOpen,
      gateScore,
    }),
  };
}

export function runAgent24ArchiveScaleWavePostProjectionGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const projectionVerification = {
    reportId: 'pv',
    matchId: 'self',
    waveRound: 33,
    projectionBaselineSha: '99f2e72b',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswpv_t21', { v: 2 }),
  };
  const transferGate = {
    reportId: 'tg',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rtg_t21', { v: 1 }),
  };
  const continuityExportGate = {
    reportId: 'ceg',
    matchId: 'self',
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportGateScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('ceg_t21', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWavePostProjectionGateReport({
    matchId: 'self',
    replayScaleWaveProjectionVerification: projectionVerification,
    replayTransferGate: transferGate,
    continuityExportGate,
  });

  return [
    { name: 'gate_open_when_post_projection_stack_ready', passed: report.gateOpen && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWavePostProjectionGateReport({
          matchId: 'self',
          replayScaleWaveProjectionVerification: projectionVerification,
          replayTransferGate: transferGate,
          continuityExportGate,
        }).deterministicFingerprint,
    },
  ];
}
