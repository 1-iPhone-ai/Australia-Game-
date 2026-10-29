import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveFullChunksGateReport } from './archive-scale-wave-full-chunks-gate.ts';
import type { Agent24ReplayScaleWaveDryrunVerificationReport } from './replay-scale-wave-dryrun-verification.ts';
import {
  O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

export { O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveFullChunksHandoffLink {
  linkId: string;
  segment: 'dryrun_verified' | 'full_chunks_gate' | 'wave22_baseline';
  ready: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveFullChunksHandoffSeal {
  sealId: string;
  matchId: string;
  waveRound: number;
  fullChunksBaselineSha: string;
  handoffReady: boolean;
  linkCount: number;
  readyLinkCount: number;
  links: Agent24ReplayScaleWaveFullChunksHandoffLink[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveFullChunksHandoffSealInput {
  matchId: string;
  archiveScaleWaveFullChunksGate: Agent24ArchiveScaleWaveFullChunksGateReport;
  replayScaleWaveDryrunVerification: Agent24ReplayScaleWaveDryrunVerificationReport;
  fullChunksBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveFullChunksHandoffSeal(
  input: Agent24ReplayScaleWaveFullChunksHandoffSealInput,
): Agent24ReplayScaleWaveFullChunksHandoffSeal {
  const waveRound = input.replayScaleWaveDryrunVerification.waveRound;
  const fullChunksBaselineSha =
    input.fullChunksBaselineSha ??
    (waveRound >= 32
      ? O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA
      : waveRound >= 31
      ? O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA
      : waveRound >= 30
      ? O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA
      : waveRound >= 29
      ? O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA
      : waveRound >= 28
      ? O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA
      : waveRound >= 27
      ? O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA
      : waveRound >= 26
        ? O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA
        : waveRound >= 25
        ? O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA
        : waveRound >= 24
        ? O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA
        : waveRound >= 23
        ? O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA
        : O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA);
  const baselineAligned = input.replayScaleWaveDryrunVerification.dryrunBaselineSha === fullChunksBaselineSha;

  const links: Agent24ReplayScaleWaveFullChunksHandoffLink[] = [
    {
      linkId: o6kAgent24Fingerprint('scale_wave_full_chunks_link', { seg: 'dryrun_verified', wave: waveRound }),
      segment: 'dryrun_verified',
      ready: input.replayScaleWaveDryrunVerification.verified,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_full_chunks_link', { seg: 'full_chunks_gate', wave: waveRound }),
      segment: 'full_chunks_gate',
      ready: input.archiveScaleWaveFullChunksGate.chunksGateOpen,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_full_chunks_link', { seg: 'wave22_baseline', wave: waveRound }),
      segment: 'wave22_baseline',
      ready: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.fingerprint = o6kAgent24Fingerprint('scale_wave_full_chunks_link_body', {
      segment: link.segment,
      ready: link.ready,
      wave: waveRound,
      baseline: fullChunksBaselineSha,
    });
  }

  const readyLinkCount = links.filter(l => l.ready).length;

  let handoffScore = 100;
  handoffScore -= (links.length - readyLinkCount) * 15;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveFullChunksGate.gateScore) * 0.07;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffReady = readyLinkCount === links.length && links.length > 0;

  return {
    sealId: o6kAgent24Fingerprint('replay_scale_wave_full_chunks_handoff', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: fullChunksBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    fullChunksBaselineSha,
    handoffReady,
    linkCount: links.length,
    readyLinkCount,
    links,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_full_chunks_handoff_body', {
      waveRound,
      baseline: fullChunksBaselineSha,
      links: links.map(l => l.fingerprint),
      handoffReady,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveFullChunksHandoffSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const dryrunVerification = {
    reportId: 'dv',
    matchId: 'self',
    waveRound: 32,
    dryrunBaselineSha: O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswdv_t22', { v: 3 }),
  };
  const fullChunksGate = {
    reportId: 'fcg',
    matchId: 'self',
    waveRound: 32,
    chunksGateOpen: true,
    blockerCount: 0,
    blockers: [],
    gateScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswfc_t22', { v: 1 }),
  };

  const seal = buildAgent24ReplayScaleWaveFullChunksHandoffSeal({
    matchId: 'self',
    archiveScaleWaveFullChunksGate: fullChunksGate,
    replayScaleWaveDryrunVerification: dryrunVerification,
  });

  return [
    {
      name: 'handoff_ready_at_full_chunks_baseline',
      passed:
        seal.handoffReady &&
        seal.fullChunksBaselineSha === O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: seal.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        seal.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveFullChunksHandoffSeal({
          matchId: 'self',
          archiveScaleWaveFullChunksGate: fullChunksGate,
          replayScaleWaveDryrunVerification: dryrunVerification,
        }).deterministicFingerprint,
    },
  ];
}
