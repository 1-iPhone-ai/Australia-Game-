import type {
  GTELAcknowledgedCyclePrimingSnapshot,
  GTELBilateralHandedWaveCyclePrimingGateSnapshot,
  GTELClearedWaveHandoffContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralHandedWaveCyclePrimingGateBand =
  GTELBilateralHandedWaveCyclePrimingGateSnapshot['band'];

function primingBand(score: number): GTELBilateralHandedWaveCyclePrimingGateBand {
  if (score >= 0.94) return 'primed';
  if (score >= 0.74) return 'charging';
  if (score >= 0.56) return 'deferred';
  return 'blocked';
}

export function sanitizeBilateralHandedWaveCyclePrimingGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralHandedWaveCyclePrimingGateSnapshot(): GTELBilateralHandedWaveCyclePrimingGateSnapshot {
  return {
    score: 0.52,
    band: 'charging',
    continuityFeed: 0.1,
    cyclePrimingLift: 0.08,
    summary: 'Handed wave cycle priming gate is charging secured handoff continuity into acknowledged cycle.',
  };
}

export function advanceBilateralHandedWaveCyclePrimingGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralHandedWaveCyclePrimingGateSmoothing(
    persisted.bilateralHandedWaveCyclePrimingGateSmoothing,
  );
  const next = gtelClamp(prev * 0.2 + gtelClamp(rawScore, 0.16, 0.92) * 0.8, 0.16, 0.92);
  return {
    ...persisted,
    bilateralHandedWaveCyclePrimingGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralHandedWaveCyclePrimingGateSnapshot(input: {
  clearedWaveHandoffContinuity: GTELClearedWaveHandoffContinuitySnapshot;
  acknowledgedCyclePriming: GTELAcknowledgedCyclePrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralHandedWaveCyclePrimingGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.clearedWaveHandoffContinuity.band === 'secured'
      ? 0.17
      : input.clearedWaveHandoffContinuity.band === 'holding'
        ? 0.08
        : input.clearedWaveHandoffContinuity.band === 'slipping'
          ? -0.04
          : -0.1;
  const cyclePrimingLift =
    input.acknowledgedCyclePriming.band === 'primed'
      ? 0.16
      : input.acknowledgedCyclePriming.band === 'empty'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.clearedWaveHandoffContinuity.score * 0.5 +
      input.acknowledgedCyclePriming.score * 0.26 +
      continuityFeed +
      cyclePrimingLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralHandedWaveCyclePrimingGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralHandedWaveCyclePrimingGateSmoothing(
    persisted.bilateralHandedWaveCyclePrimingGateSmoothing,
  );
  const band = primingBand(score);

  const summary =
    band === 'primed'
      ? 'Handed wave cycle priming gate is primed — secured handoff continuity and primed cycle admit the next arc.'
      : band === 'blocked'
        ? 'Cycle priming blocked; broken handoff continuity and empty cycle priming withheld charge.'
        : band === 'deferred'
          ? 'Priming deferred — acknowledged cycle priming is lagging secured handoff continuity.'
          : 'Handed wave cycle priming gate is charging secured handoff continuity into acknowledged cycle.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      cyclePrimingLift: Math.round(cyclePrimingLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralHandedWaveCyclePrimingGateExportScale(
  snapshot: GTELBilateralHandedWaveCyclePrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.944 + snapshot.score * 0.006, 0.938, 0.956);
  if (snapshot.band === 'deferred') return gtelClamp(0.98 + snapshot.score * 0.001, 0.975, 0.983);
  return gtelClamp(0.982 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralHandedWaveCyclePrimingGateDomesticStressRelief(
  snapshot: GTELBilateralHandedWaveCyclePrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(snapshot.score * 0.028, 0.005, 0.032);
  if (snapshot.band === 'charging') return gtelClamp(snapshot.score * 0.009, 0, 0.01);
  return 0;
}

export function bilateralHandedWaveCyclePrimingGateWorldEvent(
  snapshot: GTELBilateralHandedWaveCyclePrimingGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'deferred') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_hwcp_${turn}`,
    turn,
    kind: 'trade',
    title: 'Handed wave cycle priming constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralHandedWaveCyclePrimingGateGiNotes(
  snapshot: GTELBilateralHandedWaveCyclePrimingGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral handed wave cycle priming gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
