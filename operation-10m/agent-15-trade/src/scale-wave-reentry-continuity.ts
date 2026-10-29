import type {
  GTELBilateralScaleWaveReentryGateSnapshot,
  GTELPersisted,
  GTELSealedScaleLoopContinuitySnapshot,
  GTELScaleWaveReentryContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELScaleWaveReentryContinuityBand = GTELScaleWaveReentryContinuitySnapshot['band'];

function continuityBand(score: number): GTELScaleWaveReentryContinuityBand {
  if (score >= 0.93) return 'established';
  if (score >= 0.73) return 'linked';
  if (score >= 0.55) return 'fading';
  return 'lost';
}

export function sanitizeScaleWaveReentryContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyScaleWaveReentryContinuitySnapshot(): GTELScaleWaveReentryContinuitySnapshot {
  return {
    score: 0.52,
    band: 'linked',
    reentrySupport: 0.1,
    sealedAnchor: 0.08,
    summary: 'Scale wave reentry continuity is linking reentered gate to anchored sealed loop.',
  };
}

export function advanceScaleWaveReentryContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeScaleWaveReentryContinuitySmoothing(persisted.scaleWaveReentryContinuitySmoothing);
  const next = gtelClamp(prev * 0.26 + gtelClamp(rawScore, 0.16, 0.92) * 0.74, 0.16, 0.92);
  return { ...persisted, scaleWaveReentryContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeScaleWaveReentryContinuitySnapshot(input: {
  bilateralScaleWaveReentryGate: GTELBilateralScaleWaveReentryGateSnapshot;
  sealedScaleLoopContinuity: GTELSealedScaleLoopContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELScaleWaveReentryContinuitySnapshot; persisted: GTELPersisted } {
  const reentrySupport =
    input.bilateralScaleWaveReentryGate.band === 'reentered'
      ? 0.18
      : input.bilateralScaleWaveReentryGate.band === 'approaching'
        ? 0.08
        : input.bilateralScaleWaveReentryGate.band === 'stalled'
          ? -0.04
          : -0.11;
  const sealedAnchor =
    input.sealedScaleLoopContinuity.band === 'anchored'
      ? 0.15
      : input.sealedScaleLoopContinuity.band === 'broken'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralScaleWaveReentryGate.score * 0.51 +
      input.sealedScaleLoopContinuity.score * 0.25 +
      reentrySupport +
      sealedAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceScaleWaveReentryContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeScaleWaveReentryContinuitySmoothing(persisted.scaleWaveReentryContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'established'
      ? 'Scale wave reentry continuity is established — reentered gate and anchored seal hold for the next wave.'
      : band === 'lost'
        ? 'Reentry continuity lost; closed gate and broken sealed loop diverged.'
        : band === 'fading'
          ? 'Reentry continuity fading — sealed anchor is lagging wave reentry.'
          : 'Scale wave reentry continuity is linking reentered gate to anchored sealed loop.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      reentrySupport: Math.round(reentrySupport * 1000) / 1000,
      sealedAnchor: Math.round(sealedAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function scaleWaveReentryContinuityExportScale(snapshot: GTELScaleWaveReentryContinuitySnapshot): number {
  if (snapshot.band === 'established') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'lost') return gtelClamp(0.95 + snapshot.score * 0.005, 0.944, 0.962);
  if (snapshot.band === 'fading') return gtelClamp(0.986 + snapshot.score * 0.001, 0.981, 0.989);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function scaleWaveReentryContinuityDomesticStress(snapshot: GTELScaleWaveReentryContinuitySnapshot): number {
  if (snapshot.band === 'lost') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'fading') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function scaleWaveReentryContinuityWorldEvent(
  snapshot: GTELScaleWaveReentryContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'lost' && snapshot.band !== 'fading') return null;
  if (snapshot.reentrySupport > -0.02) return null;
  return {
    id: `gtel_wave_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Scale wave reentry continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'VIC'],
  };
}

export function scaleWaveReentryContinuityGiNotes(
  snapshot: GTELScaleWaveReentryContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Scale wave reentry continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
