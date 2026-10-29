import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveReleaseVerificationReport } from './archive-release-verification.ts';
import type { Agent24ArchiveReleaseGateReport } from './archive-release-gate.ts';
import type { Agent24ReplayScaleWaveAcceptanceReport } from './replay-scale-wave-acceptance.ts';

export interface Agent24ReplayScaleWaveHandoffLink {
  linkId: string;
  segment: 'wave_accepted' | 'release_allowed' | 'release_verified';
  ready: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveHandoffSeal {
  sealId: string;
  matchId: string;
  waveRound: number;
  handoffReady: boolean;
  linkCount: number;
  readyLinkCount: number;
  links: Agent24ReplayScaleWaveHandoffLink[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveHandoffSealInput {
  matchId: string;
  replayScaleWaveAcceptance: Agent24ReplayScaleWaveAcceptanceReport;
  archiveReleaseGate: Agent24ArchiveReleaseGateReport;
  archiveReleaseVerification: Agent24ArchiveReleaseVerificationReport;
}

export function buildAgent24ReplayScaleWaveHandoffSeal(
  input: Agent24ReplayScaleWaveHandoffSealInput,
): Agent24ReplayScaleWaveHandoffSeal {
  const waveRound = input.replayScaleWaveAcceptance.waveRound;

  const links: Agent24ReplayScaleWaveHandoffLink[] = [
    {
      linkId: o6kAgent24Fingerprint('scale_wave_handoff_link', { seg: 'wave_accepted', wave: waveRound }),
      segment: 'wave_accepted',
      ready: input.replayScaleWaveAcceptance.accepted,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_handoff_link', { seg: 'release_allowed', wave: waveRound }),
      segment: 'release_allowed',
      ready: input.archiveReleaseGate.releaseAllowed,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_handoff_link', { seg: 'release_verified', wave: waveRound }),
      segment: 'release_verified',
      ready: input.archiveReleaseVerification.verified,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.fingerprint = o6kAgent24Fingerprint('scale_wave_handoff_link_body', {
      segment: link.segment,
      ready: link.ready,
      wave: waveRound,
    });
  }

  const readyLinkCount = links.filter(l => l.ready).length;

  let handoffScore = 100;
  handoffScore -= (links.length - readyLinkCount) * 17;
  handoffScore -= Math.max(0, 100 - input.replayScaleWaveAcceptance.acceptanceScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffReady = readyLinkCount === links.length && links.length > 0;

  return {
    sealId: o6kAgent24Fingerprint('replay_scale_wave_handoff_seal', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    handoffReady,
    linkCount: links.length,
    readyLinkCount,
    links,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_handoff_seal_body', {
      waveRound,
      links: links.map(l => l.fingerprint),
      handoffReady,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveHandoffSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const waveAcceptance = {
    reportId: 'wa',
    matchId: 'self',
    waveRound: 28,
    accepted: true,
    blockerCount: 0,
    blockers: [],
    acceptanceScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswa_t', { v: 2 }),
  };
  const releaseGate = {
    reportId: 'rg',
    matchId: 'self',
    releaseAllowed: true,
    blockerCount: 0,
    blockers: [],
    releaseScore: 100,
    publishableSlotCount: 2,
    dispatchedJobCount: 2,
    deterministicFingerprint: o6kAgent24Fingerprint('arg_t', { v: 1 }),
  };
  const releaseVerification = {
    reportId: 'rv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    releaseScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('arv_t', { v: 1 }),
  };

  const seal = buildAgent24ReplayScaleWaveHandoffSeal({
    matchId: 'self',
    replayScaleWaveAcceptance: waveAcceptance,
    archiveReleaseGate: releaseGate,
    archiveReleaseVerification: releaseVerification,
  });

  return [
    { name: 'handoff_ready_when_wave_release_aligned', passed: seal.handoffReady && seal.readyLinkCount === 3 },
    { name: 'wave_round_pinned', passed: seal.waveRound === 28 },
    {
      name: 'deterministic_fingerprint',
      passed:
        seal.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveHandoffSeal({
          matchId: 'self',
          replayScaleWaveAcceptance: waveAcceptance,
          archiveReleaseGate: releaseGate,
          archiveReleaseVerification: releaseVerification,
        }).deterministicFingerprint,
    },
  ];
}
