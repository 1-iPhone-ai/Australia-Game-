import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveExportGateReport } from './archive-scale-wave-export-gate.ts';
import type { Agent24ReplayScaleWaveIntegrationVerificationReport } from './replay-scale-wave-integration-verification.ts';
import {
  O6K_AGENT24_WAVE19_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE20_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

export { O6K_AGENT24_WAVE20_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveProjectionHandoffLink {
  linkId: string;
  segment: 'integration_verified' | 'export_allowed' | 'projection_baseline';
  ready: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveProjectionHandoffSeal {
  sealId: string;
  matchId: string;
  waveRound: number;
  projectionBaselineSha: string;
  handoffReady: boolean;
  linkCount: number;
  readyLinkCount: number;
  links: Agent24ReplayScaleWaveProjectionHandoffLink[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveProjectionHandoffSealInput {
  matchId: string;
  archiveScaleWaveExportGate: Agent24ArchiveScaleWaveExportGateReport;
  replayScaleWaveIntegrationVerification: Agent24ReplayScaleWaveIntegrationVerificationReport;
  projectionBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveProjectionHandoffSeal(
  input: Agent24ReplayScaleWaveProjectionHandoffSealInput,
): Agent24ReplayScaleWaveProjectionHandoffSeal {
  const waveRound = input.replayScaleWaveIntegrationVerification.waveRound;
  const projectionBaselineSha =
    input.projectionBaselineSha ??
    (waveRound >= 30
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
        : waveRound >= 22
        ? O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA
        : waveRound >= 21
          ? O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA
          : waveRound >= 20
            ? O6K_AGENT24_WAVE20_INTEGRATION_BASELINE_SHA
            : O6K_AGENT24_WAVE19_INTEGRATION_BASELINE_SHA);
  const baselineMatches =
    input.replayScaleWaveIntegrationVerification.integrationBaselineSha === projectionBaselineSha;

  const links: Agent24ReplayScaleWaveProjectionHandoffLink[] = [
    {
      linkId: o6kAgent24Fingerprint('scale_wave_projection_link', { seg: 'integration_verified', wave: waveRound }),
      segment: 'integration_verified',
      ready: input.replayScaleWaveIntegrationVerification.verified,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_projection_link', { seg: 'export_allowed', wave: waveRound }),
      segment: 'export_allowed',
      ready: input.archiveScaleWaveExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('scale_wave_projection_link', { seg: 'projection_baseline', wave: waveRound }),
      segment: 'projection_baseline',
      ready: baselineMatches && projectionBaselineSha.length > 0,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.fingerprint = o6kAgent24Fingerprint('scale_wave_projection_link_body', {
      segment: link.segment,
      ready: link.ready,
      wave: waveRound,
      baseline: projectionBaselineSha,
    });
  }

  const readyLinkCount = links.filter(l => l.ready).length;

  let handoffScore = 100;
  handoffScore -= (links.length - readyLinkCount) * 16;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveExportGate.exportScore) * 0.07;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffReady = readyLinkCount === links.length && links.length > 0;

  return {
    sealId: o6kAgent24Fingerprint('replay_scale_wave_projection_handoff', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: projectionBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    projectionBaselineSha,
    handoffReady,
    linkCount: links.length,
    readyLinkCount,
    links,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_projection_handoff_body', {
      waveRound,
      baseline: projectionBaselineSha,
      links: links.map(l => l.fingerprint),
      handoffReady,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveProjectionHandoffSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const integrationVerification = {
    reportId: 'iv',
    matchId: 'self',
    waveRound: 30,
    integrationBaselineSha: O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswiv_t20', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg',
    matchId: 'self',
    waveRound: 30,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asweg_t20', { v: 1 }),
  };

  const seal = buildAgent24ReplayScaleWaveProjectionHandoffSeal({
    matchId: 'self',
    archiveScaleWaveExportGate: exportGate,
    replayScaleWaveIntegrationVerification: integrationVerification,
  });

  return [
    {
      name: 'handoff_ready_at_projection_baseline',
      passed:
        seal.handoffReady &&
        seal.projectionBaselineSha === O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: seal.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        seal.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveProjectionHandoffSeal({
          matchId: 'self',
          archiveScaleWaveExportGate: exportGate,
          replayScaleWaveIntegrationVerification: integrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
