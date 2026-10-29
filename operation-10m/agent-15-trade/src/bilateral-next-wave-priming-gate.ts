import type {
  GTELBilateralNextWavePrimingGateSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELPersisted,
  GTELScaleWaveReentryContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralNextWavePrimingGateBand = GTELBilateralNextWavePrimingGateSnapshot['band'];

function primingBand(score: number): GTELBilateralNextWavePrimingGateBand {
  if (score >= 0.94) return 'primed';
  if (score >= 0.74) return 'charging';
  if (score >= 0.56) return 'idle';
  return 'blocked';
}

export function sanitizeBilateralNextWavePrimingGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralNextWavePrimingGateSnapshot(): GTELBilateralNextWavePrimingGateSnapshot {
  return {
    score: 0.52,
    band: 'charging',
    reentryContinuityFeed: 0.1,
    renewalLift: 0.08,
    summary: 'Next wave priming gate is charging established reentry continuity into renewal priming.',
  };
}

export function advanceBilateralNextWavePrimingGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralNextWavePrimingGateSmoothing(persisted.bilateralNextWavePrimingGateSmoothing);
  const next = gtelClamp(prev * 0.25 + gtelClamp(rawScore, 0.16, 0.92) * 0.75, 0.16, 0.92);
  return {
    ...persisted,
    bilateralNextWavePrimingGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralNextWavePrimingGateSnapshot(input: {
  scaleWaveReentryContinuity: GTELScaleWaveReentryContinuitySnapshot;
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralNextWavePrimingGateSnapshot; persisted: GTELPersisted } {
  const reentryContinuityFeed =
    input.scaleWaveReentryContinuity.band === 'established'
      ? 0.17
      : input.scaleWaveReentryContinuity.band === 'linked'
        ? 0.08
        : input.scaleWaveReentryContinuity.band === 'fading'
          ? -0.04
          : -0.1;
  const renewalLift =
    input.capacityRenewalPriming.band === 'primed'
      ? 0.16
      : input.capacityRenewalPriming.band === 'starved'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.scaleWaveReentryContinuity.score * 0.5 +
      input.capacityRenewalPriming.score * 0.26 +
      reentryContinuityFeed +
      renewalLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralNextWavePrimingGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralNextWavePrimingGateSmoothing(persisted.bilateralNextWavePrimingGateSmoothing);
  const band = primingBand(score);

  const summary =
    band === 'primed'
      ? 'Next wave priming gate is primed — established reentry continuity feeds the next scale wave.'
      : band === 'blocked'
        ? 'Next wave priming blocked; lost reentry continuity and starved renewal withheld charge.'
        : band === 'idle'
          ? 'Priming idle — renewal feed is lagging established reentry continuity.'
          : 'Next wave priming gate is charging established reentry continuity into renewal priming.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      reentryContinuityFeed: Math.round(reentryContinuityFeed * 1000) / 1000,
      renewalLift: Math.round(renewalLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralNextWavePrimingGateExportScale(
  snapshot: GTELBilateralNextWavePrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.949 + snapshot.score * 0.006, 0.943, 0.961);
  if (snapshot.band === 'idle') return gtelClamp(0.985 + snapshot.score * 0.001, 0.98, 0.988);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralNextWavePrimingGateDomesticStressRelief(
  snapshot: GTELBilateralNextWavePrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(snapshot.score * 0.023, 0.005, 0.027);
  if (snapshot.band === 'charging') return gtelClamp(snapshot.score * 0.007, 0, 0.008);
  return 0;
}

export function bilateralNextWavePrimingGateWorldEvent(
  snapshot: GTELBilateralNextWavePrimingGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'idle') return null;
  if (snapshot.reentryContinuityFeed > -0.02) return null;
  return {
    id: `gtel_next_wave_${turn}`,
    turn,
    kind: 'trade',
    title: 'Next wave priming constrained',
    summary: snapshot.summary,
    regionIds: ['WA', 'SA', 'NSW'],
  };
}

export function bilateralNextWavePrimingGateGiNotes(
  snapshot: GTELBilateralNextWavePrimingGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral next wave priming gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
