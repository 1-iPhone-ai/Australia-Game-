import type {
  GTELBilateralLaunchedWaveSustainGateSnapshot,
  GTELLaunchedWaveSustainContinuitySnapshot,
  GTELPersisted,
  GTELPrimedWaveLaunchContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELLaunchedWaveSustainContinuityBand = GTELLaunchedWaveSustainContinuitySnapshot['band'];

function continuityBand(score: number): GTELLaunchedWaveSustainContinuityBand {
  if (score >= 0.93) return 'firm';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'failed';
}

export function sanitizeLaunchedWaveSustainContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyLaunchedWaveSustainContinuitySnapshot(): GTELLaunchedWaveSustainContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    sustainGateSupport: 0.1,
    launchAnchor: 0.08,
    summary: 'Launched wave sustain continuity is holding sustaining gate against launch anchor.',
  };
}

export function advanceLaunchedWaveSustainContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeLaunchedWaveSustainContinuitySmoothing(persisted.launchedWaveSustainContinuitySmoothing);
  const next = gtelClamp(prev * 0.26 + gtelClamp(rawScore, 0.16, 0.92) * 0.74, 0.16, 0.92);
  return { ...persisted, launchedWaveSustainContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeLaunchedWaveSustainContinuitySnapshot(input: {
  bilateralLaunchedWaveSustainGate: GTELBilateralLaunchedWaveSustainGateSnapshot;
  primedWaveLaunchContinuity: GTELPrimedWaveLaunchContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELLaunchedWaveSustainContinuitySnapshot; persisted: GTELPersisted } {
  const sustainGateSupport =
    input.bilateralLaunchedWaveSustainGate.band === 'sustaining'
      ? 0.18
      : input.bilateralLaunchedWaveSustainGate.band === 'ramping'
        ? 0.08
        : input.bilateralLaunchedWaveSustainGate.band === 'paused'
          ? -0.04
          : -0.11;
  const launchAnchor =
    input.primedWaveLaunchContinuity.band === 'sustained'
      ? 0.15
      : input.primedWaveLaunchContinuity.band === 'collapsed'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralLaunchedWaveSustainGate.score * 0.51 +
      input.primedWaveLaunchContinuity.score * 0.25 +
      sustainGateSupport +
      launchAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceLaunchedWaveSustainContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeLaunchedWaveSustainContinuitySmoothing(persisted.launchedWaveSustainContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'firm'
      ? 'Launched wave sustain continuity is firm — sustaining gate and sustained launch anchor throughput.'
      : band === 'failed'
        ? 'Sustain continuity failed; blocked gate and collapsed launch diverged.'
        : band === 'slipping'
          ? 'Sustain continuity slipping — launch anchor is lagging sustaining gate.'
          : 'Launched wave sustain continuity is holding sustaining gate against launch anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sustainGateSupport: Math.round(sustainGateSupport * 1000) / 1000,
      launchAnchor: Math.round(launchAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function launchedWaveSustainContinuityExportScale(snapshot: GTELLaunchedWaveSustainContinuitySnapshot): number {
  if (snapshot.band === 'firm') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'failed') return gtelClamp(0.949 + snapshot.score * 0.005, 0.943, 0.961);
  if (snapshot.band === 'slipping') return gtelClamp(0.985 + snapshot.score * 0.001, 0.98, 0.988);
  return gtelClamp(0.983 + snapshot.score * 0.001, 0.95, 1.02);
}

export function launchedWaveSustainContinuityDomesticStress(snapshot: GTELLaunchedWaveSustainContinuitySnapshot): number {
  if (snapshot.band === 'failed') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'slipping') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function launchedWaveSustainContinuityWorldEvent(
  snapshot: GTELLaunchedWaveSustainContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'failed' && snapshot.band !== 'slipping') return null;
  if (snapshot.sustainGateSupport > -0.02) return null;
  return {
    id: `gtel_lwsc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Launched wave sustain continuity strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'VIC'],
  };
}

export function launchedWaveSustainContinuityGiNotes(
  snapshot: GTELLaunchedWaveSustainContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Launched wave sustain continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
