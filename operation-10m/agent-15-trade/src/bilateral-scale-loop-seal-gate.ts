import type {
  GTELBilateralScaleLoopSealGateSnapshot,
  GTELPersisted,
  GTELPreparedArcHandoffContinuitySnapshot,
  GTELTradeCycleSealVerificationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralScaleLoopSealGateBand = GTELBilateralScaleLoopSealGateSnapshot['band'];

function sealGateBand(score: number): GTELBilateralScaleLoopSealGateBand {
  if (score >= 0.94) return 'sealed';
  if (score >= 0.74) return 'tightening';
  if (score >= 0.56) return 'pending';
  return 'open';
}

export function sanitizeBilateralScaleLoopSealGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralScaleLoopSealGateSnapshot(): GTELBilateralScaleLoopSealGateSnapshot {
  return {
    score: 0.52,
    band: 'tightening',
    handoffContinuityFeed: 0.1,
    cycleSealLift: 0.08,
    summary: 'Scale loop seal gate is tightening locked handoff continuity against cycle verification.',
  };
}

export function advanceBilateralScaleLoopSealGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralScaleLoopSealGateSmoothing(persisted.bilateralScaleLoopSealGateSmoothing);
  const next = gtelClamp(prev * 0.29 + gtelClamp(rawScore, 0.16, 0.92) * 0.71, 0.16, 0.92);
  return { ...persisted, bilateralScaleLoopSealGateSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralScaleLoopSealGateSnapshot(input: {
  preparedArcHandoffContinuity: GTELPreparedArcHandoffContinuitySnapshot;
  tradeCycleSealVerification: GTELTradeCycleSealVerificationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralScaleLoopSealGateSnapshot; persisted: GTELPersisted } {
  const handoffContinuityFeed =
    input.preparedArcHandoffContinuity.band === 'locked'
      ? 0.17
      : input.preparedArcHandoffContinuity.band === 'tracking'
        ? 0.08
        : input.preparedArcHandoffContinuity.band === 'slack'
          ? -0.04
          : -0.1;
  const cycleSealLift =
    input.tradeCycleSealVerification.band === 'verified'
      ? 0.16
      : input.tradeCycleSealVerification.band === 'failed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.preparedArcHandoffContinuity.score * 0.5 +
      input.tradeCycleSealVerification.score * 0.26 +
      handoffContinuityFeed +
      cycleSealLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralScaleLoopSealGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralScaleLoopSealGateSmoothing(persisted.bilateralScaleLoopSealGateSmoothing);
  const band = sealGateBand(score);

  const summary =
    band === 'sealed'
      ? 'Scale loop seal gate is sealed — locked handoff continuity and verified cycle close the wave loop.'
      : band === 'open'
        ? 'Loop seal open; broken handoff and failed verification withheld closure.'
        : band === 'pending'
          ? 'Seal pending — cycle verification is lagging locked handoff continuity.'
          : 'Scale loop seal gate is tightening locked handoff continuity against cycle verification.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffContinuityFeed: Math.round(handoffContinuityFeed * 1000) / 1000,
      cycleSealLift: Math.round(cycleSealLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralScaleLoopSealGateExportScale(snapshot: GTELBilateralScaleLoopSealGateSnapshot): number {
  if (snapshot.band === 'sealed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'open') return gtelClamp(0.953 + snapshot.score * 0.006, 0.947, 0.965);
  if (snapshot.band === 'pending') return gtelClamp(0.988 + snapshot.score * 0.001, 0.983, 0.991);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralScaleLoopSealGateDomesticStressRelief(
  snapshot: GTELBilateralScaleLoopSealGateSnapshot,
): number {
  if (snapshot.band === 'sealed') return gtelClamp(snapshot.score * 0.021, 0.005, 0.025);
  if (snapshot.band === 'tightening') return gtelClamp(snapshot.score * 0.007, 0, 0.008);
  return 0;
}

export function bilateralScaleLoopSealGateWorldEvent(
  snapshot: GTELBilateralScaleLoopSealGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'open' && snapshot.band !== 'pending') return null;
  if (snapshot.handoffContinuityFeed > -0.02) return null;
  return {
    id: `gtel_loop_seal_${turn}`,
    turn,
    kind: 'trade',
    title: 'Scale loop seal constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralScaleLoopSealGateGiNotes(
  snapshot: GTELBilateralScaleLoopSealGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral scale loop seal gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
