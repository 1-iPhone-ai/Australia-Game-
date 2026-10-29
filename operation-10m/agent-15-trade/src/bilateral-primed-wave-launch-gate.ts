import type {
  GTELBilateralCycleReentryGateSnapshot,
  GTELBilateralPrimedWaveLaunchGateSnapshot,
  GTELNextWavePrimingContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralPrimedWaveLaunchGateBand = GTELBilateralPrimedWaveLaunchGateSnapshot['band'];

function launchBand(score: number): GTELBilateralPrimedWaveLaunchGateBand {
  if (score >= 0.94) return 'launched';
  if (score >= 0.74) return 'arming';
  if (score >= 0.56) return 'held';
  return 'blocked';
}

export function sanitizeBilateralPrimedWaveLaunchGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralPrimedWaveLaunchGateSnapshot(): GTELBilateralPrimedWaveLaunchGateSnapshot {
  return {
    score: 0.52,
    band: 'arming',
    continuityFeed: 0.1,
    cycleReentryLift: 0.08,
    summary: 'Primed wave launch gate is arming settled priming continuity into cycle reentry.',
  };
}

export function advanceBilateralPrimedWaveLaunchGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralPrimedWaveLaunchGateSmoothing(persisted.bilateralPrimedWaveLaunchGateSmoothing);
  const next = gtelClamp(prev * 0.24 + gtelClamp(rawScore, 0.16, 0.92) * 0.76, 0.16, 0.92);
  return {
    ...persisted,
    bilateralPrimedWaveLaunchGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralPrimedWaveLaunchGateSnapshot(input: {
  nextWavePrimingContinuity: GTELNextWavePrimingContinuitySnapshot;
  bilateralCycleReentryGate: GTELBilateralCycleReentryGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralPrimedWaveLaunchGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.nextWavePrimingContinuity.band === 'settled'
      ? 0.17
      : input.nextWavePrimingContinuity.band === 'holding'
        ? 0.08
        : input.nextWavePrimingContinuity.band === 'unsettled'
          ? -0.04
          : -0.1;
  const cycleReentryLift =
    input.bilateralCycleReentryGate.band === 'entered'
      ? 0.16
      : input.bilateralCycleReentryGate.band === 'denied'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.nextWavePrimingContinuity.score * 0.5 +
      input.bilateralCycleReentryGate.score * 0.26 +
      continuityFeed +
      cycleReentryLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralPrimedWaveLaunchGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralPrimedWaveLaunchGateSmoothing(persisted.bilateralPrimedWaveLaunchGateSmoothing);
  const band = launchBand(score);

  const summary =
    band === 'launched'
      ? 'Primed wave launch gate is launched — settled continuity and entered cycle admit the next scale wave.'
      : band === 'blocked'
        ? 'Wave launch blocked; void continuity and denied cycle reentry withheld launch.'
        : band === 'held'
          ? 'Launch held — cycle reentry is lagging settled priming continuity.'
          : 'Primed wave launch gate is arming settled priming continuity into cycle reentry.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      cycleReentryLift: Math.round(cycleReentryLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralPrimedWaveLaunchGateExportScale(
  snapshot: GTELBilateralPrimedWaveLaunchGateSnapshot,
): number {
  if (snapshot.band === 'launched') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.948 + snapshot.score * 0.006, 0.942, 0.96);
  if (snapshot.band === 'held') return gtelClamp(0.984 + snapshot.score * 0.001, 0.979, 0.987);
  return gtelClamp(0.986 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralPrimedWaveLaunchGateDomesticStressRelief(
  snapshot: GTELBilateralPrimedWaveLaunchGateSnapshot,
): number {
  if (snapshot.band === 'launched') return gtelClamp(snapshot.score * 0.024, 0.005, 0.028);
  if (snapshot.band === 'arming') return gtelClamp(snapshot.score * 0.008, 0, 0.009);
  return 0;
}

export function bilateralPrimedWaveLaunchGateWorldEvent(
  snapshot: GTELBilateralPrimedWaveLaunchGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'held') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_wave_launch_${turn}`,
    turn,
    kind: 'trade',
    title: 'Primed wave launch constrained',
    summary: snapshot.summary,
    regionIds: ['SA', 'VIC', 'NSW'],
  };
}

export function bilateralPrimedWaveLaunchGateGiNotes(
  snapshot: GTELBilateralPrimedWaveLaunchGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral primed wave launch gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
