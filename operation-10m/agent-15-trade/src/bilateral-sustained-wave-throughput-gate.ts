import type {
  GTELBilateralLoopResumptionGateSnapshot,
  GTELBilateralSustainedWaveThroughputGateSnapshot,
  GTELLaunchedWaveSustainContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralSustainedWaveThroughputGateBand =
  GTELBilateralSustainedWaveThroughputGateSnapshot['band'];

function throughputBand(score: number): GTELBilateralSustainedWaveThroughputGateBand {
  if (score >= 0.94) return 'cleared';
  if (score >= 0.74) return 'building';
  if (score >= 0.56) return 'throttled';
  return 'blocked';
}

export function sanitizeBilateralSustainedWaveThroughputGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralSustainedWaveThroughputGateSnapshot(): GTELBilateralSustainedWaveThroughputGateSnapshot {
  return {
    score: 0.52,
    band: 'building',
    continuityFeed: 0.1,
    loopResumptionLift: 0.08,
    summary: 'Sustained wave throughput gate is building firm sustain continuity into loop resumption.',
  };
}

export function advanceBilateralSustainedWaveThroughputGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralSustainedWaveThroughputGateSmoothing(
    persisted.bilateralSustainedWaveThroughputGateSmoothing,
  );
  const next = gtelClamp(prev * 0.22 + gtelClamp(rawScore, 0.16, 0.92) * 0.78, 0.16, 0.92);
  return {
    ...persisted,
    bilateralSustainedWaveThroughputGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralSustainedWaveThroughputGateSnapshot(input: {
  launchedWaveSustainContinuity: GTELLaunchedWaveSustainContinuitySnapshot;
  bilateralLoopResumptionGate: GTELBilateralLoopResumptionGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralSustainedWaveThroughputGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.launchedWaveSustainContinuity.band === 'firm'
      ? 0.17
      : input.launchedWaveSustainContinuity.band === 'holding'
        ? 0.08
        : input.launchedWaveSustainContinuity.band === 'slipping'
          ? -0.04
          : -0.1;
  const loopResumptionLift =
    input.bilateralLoopResumptionGate.band === 'resumed'
      ? 0.16
      : input.bilateralLoopResumptionGate.band === 'closed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.launchedWaveSustainContinuity.score * 0.5 +
      input.bilateralLoopResumptionGate.score * 0.26 +
      continuityFeed +
      loopResumptionLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralSustainedWaveThroughputGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralSustainedWaveThroughputGateSmoothing(
    persisted.bilateralSustainedWaveThroughputGateSmoothing,
  );
  const band = throughputBand(score);

  const summary =
    band === 'cleared'
      ? 'Sustained wave throughput gate is cleared — firm continuity and resumed loop admit export scale.'
      : band === 'blocked'
        ? 'Throughput gate blocked; failed sustain continuity and closed loop withheld clearance.'
        : band === 'throttled'
          ? 'Throughput throttled — loop resumption is lagging firm sustain continuity.'
          : 'Sustained wave throughput gate is building firm sustain continuity into loop resumption.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      loopResumptionLift: Math.round(loopResumptionLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralSustainedWaveThroughputGateExportScale(
  snapshot: GTELBilateralSustainedWaveThroughputGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.946 + snapshot.score * 0.006, 0.94, 0.958);
  if (snapshot.band === 'throttled') return gtelClamp(0.982 + snapshot.score * 0.001, 0.977, 0.985);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralSustainedWaveThroughputGateDomesticStressRelief(
  snapshot: GTELBilateralSustainedWaveThroughputGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp(snapshot.score * 0.026, 0.005, 0.03);
  if (snapshot.band === 'building') return gtelClamp(snapshot.score * 0.009, 0, 0.01);
  return 0;
}

export function bilateralSustainedWaveThroughputGateWorldEvent(
  snapshot: GTELBilateralSustainedWaveThroughputGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'throttled') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_wave_tp_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sustained wave throughput constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralSustainedWaveThroughputGateGiNotes(
  snapshot: GTELBilateralSustainedWaveThroughputGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral sustained wave throughput gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
