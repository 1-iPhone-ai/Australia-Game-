import type {
  GTELBilateralClearedWaveHandoffGateSnapshot,
  GTELPersisted,
  GTELResumedLoopContinuitySnapshot,
  GTELSustainedWaveThroughputContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralClearedWaveHandoffGateBand = GTELBilateralClearedWaveHandoffGateSnapshot['band'];

function handoffBand(score: number): GTELBilateralClearedWaveHandoffGateBand {
  if (score >= 0.94) return 'handed';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'deferred';
  return 'blocked';
}

export function sanitizeBilateralClearedWaveHandoffGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralClearedWaveHandoffGateSnapshot(): GTELBilateralClearedWaveHandoffGateSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    loopContinuityLift: 0.08,
    summary: 'Cleared wave handoff gate is staging steady throughput continuity into resumed loop.',
  };
}

export function advanceBilateralClearedWaveHandoffGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralClearedWaveHandoffGateSmoothing(persisted.bilateralClearedWaveHandoffGateSmoothing);
  const next = gtelClamp(prev * 0.21 + gtelClamp(rawScore, 0.16, 0.92) * 0.79, 0.16, 0.92);
  return {
    ...persisted,
    bilateralClearedWaveHandoffGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralClearedWaveHandoffGateSnapshot(input: {
  sustainedWaveThroughputContinuity: GTELSustainedWaveThroughputContinuitySnapshot;
  resumedLoopContinuity: GTELResumedLoopContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralClearedWaveHandoffGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.sustainedWaveThroughputContinuity.band === 'steady'
      ? 0.17
      : input.sustainedWaveThroughputContinuity.band === 'aligned'
        ? 0.08
        : input.sustainedWaveThroughputContinuity.band === 'fraying'
          ? -0.04
          : -0.1;
  const loopContinuityLift =
    input.resumedLoopContinuity.band === 'continuous'
      ? 0.16
      : input.resumedLoopContinuity.band === 'broken'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.sustainedWaveThroughputContinuity.score * 0.5 +
      input.resumedLoopContinuity.score * 0.26 +
      continuityFeed +
      loopContinuityLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralClearedWaveHandoffGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralClearedWaveHandoffGateSmoothing(
    persisted.bilateralClearedWaveHandoffGateSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'handed'
      ? 'Cleared wave handoff gate is handed — steady throughput continuity and continuous loop admit the next arc.'
      : band === 'blocked'
        ? 'Wave handoff blocked; severed throughput continuity and broken loop withheld staging.'
        : band === 'deferred'
          ? 'Handoff deferred — resumed loop continuity is lagging steady throughput.'
          : 'Cleared wave handoff gate is staging steady throughput continuity into resumed loop.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      loopContinuityLift: Math.round(loopContinuityLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralClearedWaveHandoffGateExportScale(
  snapshot: GTELBilateralClearedWaveHandoffGateSnapshot,
): number {
  if (snapshot.band === 'handed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.945 + snapshot.score * 0.006, 0.939, 0.957);
  if (snapshot.band === 'deferred') return gtelClamp(0.981 + snapshot.score * 0.001, 0.976, 0.984);
  return gtelClamp(0.983 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralClearedWaveHandoffGateDomesticStressRelief(
  snapshot: GTELBilateralClearedWaveHandoffGateSnapshot,
): number {
  if (snapshot.band === 'handed') return gtelClamp(snapshot.score * 0.027, 0.005, 0.031);
  if (snapshot.band === 'staging') return gtelClamp(snapshot.score * 0.009, 0, 0.01);
  return 0;
}

export function bilateralClearedWaveHandoffGateWorldEvent(
  snapshot: GTELBilateralClearedWaveHandoffGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'deferred') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_wave_hand_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cleared wave handoff constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'QLD', 'NSW'],
  };
}

export function bilateralClearedWaveHandoffGateGiNotes(
  snapshot: GTELBilateralClearedWaveHandoffGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral cleared wave handoff gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
