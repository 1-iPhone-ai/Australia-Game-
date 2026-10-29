import { o6kAgent24Fingerprint } from './fingerprint.ts';
import {
  O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';
import type { Agent24ArchiveScaleWaveFullChunksGateReport } from './archive-scale-wave-full-chunks-gate.ts';
import type { Agent24ReplayScaleWaveDryrunVerificationReport } from './replay-scale-wave-dryrun-verification.ts';
import type { Agent24ReplayScaleWaveFullChunksHandoffSeal } from './replay-scale-wave-full-chunks-handoff.ts';

export interface Agent24ReplayScaleWaveFullChunksVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveFullChunksVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  fullChunksBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveFullChunksVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveFullChunksVerificationInput {
  matchId: string;
  replayScaleWaveFullChunksHandoffSeal: Agent24ReplayScaleWaveFullChunksHandoffSeal;
  archiveScaleWaveFullChunksGate: Agent24ArchiveScaleWaveFullChunksGateReport;
  replayScaleWaveDryrunVerification: Agent24ReplayScaleWaveDryrunVerificationReport;
}

export function buildAgent24ReplayScaleWaveFullChunksVerificationReport(
  input: Agent24ReplayScaleWaveFullChunksVerificationInput,
): Agent24ReplayScaleWaveFullChunksVerificationReport {
  const waveRound = input.replayScaleWaveFullChunksHandoffSeal.waveRound;
  const fullChunksBaselineSha = input.replayScaleWaveFullChunksHandoffSeal.fullChunksBaselineSha;
  const issues: Agent24ReplayScaleWaveFullChunksVerificationIssue[] = [];

  if (!input.replayScaleWaveFullChunksHandoffSeal.handoffReady) {
    issues.push({
      segment: 'full_chunks_handoff',
      detail: `Full-chunks handoff not ready (${input.replayScaleWaveFullChunksHandoffSeal.readyLinkCount}/${input.replayScaleWaveFullChunksHandoffSeal.linkCount})`,
      fingerprint: o6kAgent24Fingerprint('rswfcv_handoff', {
        ready: input.replayScaleWaveFullChunksHandoffSeal.readyLinkCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveFullChunksGate.chunksGateOpen) {
    issues.push({
      segment: 'full_chunks_gate',
      detail: `Full-chunks gate blocked (${input.archiveScaleWaveFullChunksGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswfcv_gate', {
        blockers: input.archiveScaleWaveFullChunksGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveDryrunVerification.verified) {
    issues.push({
      segment: 'dryrun_verification',
      detail: `Dry-run verification open (${input.replayScaleWaveDryrunVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rswfcv_dryrun', {
        issues: input.replayScaleWaveDryrunVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveFullChunksHandoffSeal.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveFullChunksHandoffSeal.handoffReady &&
    input.archiveScaleWaveFullChunksGate.chunksGateOpen &&
    input.replayScaleWaveDryrunVerification.verified;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_full_chunks_verification', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: fullChunksBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    fullChunksBaselineSha,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    handoffScore: input.replayScaleWaveFullChunksHandoffSeal.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_full_chunks_verification_body', {
      waveRound,
      baseline: fullChunksBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveFullChunksVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const dryrunVerification = {
    reportId: 'dv',
    matchId: 'self',
    waveRound: 47,
    dryrunBaselineSha: O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswdv_t23', { v: 1 }),
  };
  const fullChunksGate = {
    reportId: 'fcg',
    matchId: 'self',
    waveRound: 41,
    chunksGateOpen: true,
    blockerCount: 0,
    blockers: [],
    gateScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswfc_t23', { v: 1 }),
  };
  const handoffSeal = {
    sealId: 'fch',
    matchId: 'self',
    waveRound: 47,
    fullChunksBaselineSha: O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswfch_t23', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveFullChunksVerificationReport({
    matchId: 'self',
    replayScaleWaveFullChunksHandoffSeal: handoffSeal,
    archiveScaleWaveFullChunksGate: fullChunksGate,
    replayScaleWaveDryrunVerification: dryrunVerification,
  });

  return [
    { name: 'verified_when_full_chunks_stack_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 47 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveFullChunksVerificationReport({
          matchId: 'self',
          replayScaleWaveFullChunksHandoffSeal: handoffSeal,
          archiveScaleWaveFullChunksGate: fullChunksGate,
          replayScaleWaveDryrunVerification: dryrunVerification,
        }).deterministicFingerprint,
    },
  ];
}
