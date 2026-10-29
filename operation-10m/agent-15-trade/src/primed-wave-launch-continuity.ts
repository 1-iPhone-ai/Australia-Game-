import type {
  GTELBilateralPrimedWaveLaunchGateSnapshot,
  GTELNextWavePrimingContinuitySnapshot,
  GTELPersisted,
  GTELPrimedWaveLaunchContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELPrimedWaveLaunchContinuityBand = GTELPrimedWaveLaunchContinuitySnapshot['band'];

function continuityBand(score: number): GTELPrimedWaveLaunchContinuityBand {
  if (score >= 0.93) return 'sustained';
  if (score >= 0.73) return 'tracking';
  if (score >= 0.55) return 'drifting';
  return 'collapsed';
}

export function sanitizePrimedWaveLaunchContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyPrimedWaveLaunchContinuitySnapshot(): GTELPrimedWaveLaunchContinuitySnapshot {
  return {
    score: 0.52,
    band: 'tracking',
    launchSupport: 0.1,
    primingAnchor: 0.08,
    summary: 'Primed wave launch continuity is tracking launched gate against priming anchor.',
  };
}

export function advancePrimedWaveLaunchContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizePrimedWaveLaunchContinuitySmoothing(persisted.primedWaveLaunchContinuitySmoothing);
  const next = gtelClamp(prev * 0.28 + gtelClamp(rawScore, 0.16, 0.92) * 0.72, 0.16, 0.92);
  return { ...persisted, primedWaveLaunchContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computePrimedWaveLaunchContinuitySnapshot(input: {
  bilateralPrimedWaveLaunchGate: GTELBilateralPrimedWaveLaunchGateSnapshot;
  nextWavePrimingContinuity: GTELNextWavePrimingContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELPrimedWaveLaunchContinuitySnapshot; persisted: GTELPersisted } {
  const launchSupport =
    input.bilateralPrimedWaveLaunchGate.band === 'launched'
      ? 0.18
      : input.bilateralPrimedWaveLaunchGate.band === 'arming'
        ? 0.08
        : input.bilateralPrimedWaveLaunchGate.band === 'held'
          ? -0.04
          : -0.11;
  const primingAnchor =
    input.nextWavePrimingContinuity.band === 'settled'
      ? 0.15
      : input.nextWavePrimingContinuity.band === 'void'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralPrimedWaveLaunchGate.score * 0.51 +
      input.nextWavePrimingContinuity.score * 0.25 +
      launchSupport +
      primingAnchor,
    0.16,
    0.92,
  );
  const persisted = advancePrimedWaveLaunchContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizePrimedWaveLaunchContinuitySmoothing(persisted.primedWaveLaunchContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'sustained'
      ? 'Primed wave launch continuity is sustained — launched gate and settled priming hold the scale wave.'
      : band === 'collapsed'
        ? 'Launch continuity collapsed; blocked gate and void priming diverged.'
        : band === 'drifting'
          ? 'Launch continuity drifting — priming anchor is lagging launched gate.'
          : 'Primed wave launch continuity is tracking launched gate against priming anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      launchSupport: Math.round(launchSupport * 1000) / 1000,
      primingAnchor: Math.round(primingAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function primedWaveLaunchContinuityExportScale(snapshot: GTELPrimedWaveLaunchContinuitySnapshot): number {
  if (snapshot.band === 'sustained') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'collapsed') return gtelClamp(0.95 + snapshot.score * 0.005, 0.944, 0.962);
  if (snapshot.band === 'drifting') return gtelClamp(0.986 + snapshot.score * 0.001, 0.981, 0.989);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function primedWaveLaunchContinuityDomesticStress(snapshot: GTELPrimedWaveLaunchContinuitySnapshot): number {
  if (snapshot.band === 'collapsed') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'drifting') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function primedWaveLaunchContinuityWorldEvent(
  snapshot: GTELPrimedWaveLaunchContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'collapsed' && snapshot.band !== 'drifting') return null;
  if (snapshot.launchSupport > -0.02) return null;
  return {
    id: `gtel_pwlc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Primed wave launch continuity strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NSW'],
  };
}

export function primedWaveLaunchContinuityGiNotes(
  snapshot: GTELPrimedWaveLaunchContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Primed wave launch continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
