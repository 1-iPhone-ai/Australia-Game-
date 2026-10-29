import type {
  GTELBilateralCycleReentryGateSnapshot,
  GTELBilateralScaleWaveReentryGateSnapshot,
  GTELPersisted,
  GTELSealedScaleLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralScaleWaveReentryGateBand = GTELBilateralScaleWaveReentryGateSnapshot['band'];

function reentryBand(score: number): GTELBilateralScaleWaveReentryGateBand {
  if (score >= 0.94) return 'reentered';
  if (score >= 0.74) return 'approaching';
  if (score >= 0.56) return 'stalled';
  return 'closed';
}

export function sanitizeBilateralScaleWaveReentryGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralScaleWaveReentryGateSnapshot(): GTELBilateralScaleWaveReentryGateSnapshot {
  return {
    score: 0.52,
    band: 'approaching',
    sealedContinuityFeed: 0.1,
    cycleReentryLift: 0.08,
    summary: 'Scale wave reentry gate is approaching anchored sealed loop into cycle reentry.',
  };
}

export function advanceBilateralScaleWaveReentryGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralScaleWaveReentryGateSmoothing(persisted.bilateralScaleWaveReentryGateSmoothing);
  const next = gtelClamp(prev * 0.27 + gtelClamp(rawScore, 0.16, 0.92) * 0.73, 0.16, 0.92);
  return {
    ...persisted,
    bilateralScaleWaveReentryGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralScaleWaveReentryGateSnapshot(input: {
  sealedScaleLoopContinuity: GTELSealedScaleLoopContinuitySnapshot;
  bilateralCycleReentryGate: GTELBilateralCycleReentryGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralScaleWaveReentryGateSnapshot; persisted: GTELPersisted } {
  const sealedContinuityFeed =
    input.sealedScaleLoopContinuity.band === 'anchored'
      ? 0.17
      : input.sealedScaleLoopContinuity.band === 'holding'
        ? 0.08
        : input.sealedScaleLoopContinuity.band === 'loosening'
          ? -0.04
          : -0.1;
  const cycleReentryLift =
    input.bilateralCycleReentryGate.band === 'entered'
      ? 0.16
      : input.bilateralCycleReentryGate.band === 'denied'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.sealedScaleLoopContinuity.score * 0.5 +
      input.bilateralCycleReentryGate.score * 0.26 +
      sealedContinuityFeed +
      cycleReentryLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralScaleWaveReentryGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralScaleWaveReentryGateSmoothing(persisted.bilateralScaleWaveReentryGateSmoothing);
  const band = reentryBand(score);

  const summary =
    band === 'reentered'
      ? 'Scale wave reentry gate is open — anchored sealed loop and cycle reentry admit the next wave.'
      : band === 'closed'
        ? 'Wave reentry closed; broken sealed continuity and denied cycle gate blocked passage.'
        : band === 'stalled'
          ? 'Reentry stalled — cycle gate is lagging anchored sealed loop.'
          : 'Scale wave reentry gate is approaching anchored sealed loop into cycle reentry.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sealedContinuityFeed: Math.round(sealedContinuityFeed * 1000) / 1000,
      cycleReentryLift: Math.round(cycleReentryLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralScaleWaveReentryGateExportScale(
  snapshot: GTELBilateralScaleWaveReentryGateSnapshot,
): number {
  if (snapshot.band === 'reentered') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'closed') return gtelClamp(0.951 + snapshot.score * 0.006, 0.945, 0.963);
  if (snapshot.band === 'stalled') return gtelClamp(0.986 + snapshot.score * 0.001, 0.981, 0.989);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralScaleWaveReentryGateDomesticStressRelief(
  snapshot: GTELBilateralScaleWaveReentryGateSnapshot,
): number {
  if (snapshot.band === 'reentered') return gtelClamp(snapshot.score * 0.022, 0.005, 0.026);
  if (snapshot.band === 'approaching') return gtelClamp(snapshot.score * 0.007, 0, 0.008);
  return 0;
}

export function bilateralScaleWaveReentryGateWorldEvent(
  snapshot: GTELBilateralScaleWaveReentryGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'closed' && snapshot.band !== 'stalled') return null;
  if (snapshot.sealedContinuityFeed > -0.02) return null;
  return {
    id: `gtel_wave_reentry_${turn}`,
    turn,
    kind: 'trade',
    title: 'Scale wave reentry constrained',
    summary: snapshot.summary,
    regionIds: ['WA', 'SA', 'NSW'],
  };
}

export function bilateralScaleWaveReentryGateGiNotes(
  snapshot: GTELBilateralScaleWaveReentryGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral scale wave reentry gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
