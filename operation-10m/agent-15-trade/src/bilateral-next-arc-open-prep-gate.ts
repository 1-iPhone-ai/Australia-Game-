import type {
  GTELAcknowledgedCyclePrimingSnapshot,
  GTELBilateralNextArcOpenPrepGateSnapshot,
  GTELPersisted,
  GTELRenewalArcPrimingContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralNextArcOpenPrepGateBand = GTELBilateralNextArcOpenPrepGateSnapshot['band'];

function prepBand(score: number): GTELBilateralNextArcOpenPrepGateBand {
  if (score >= 0.94) return 'prepped';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'deferred';
  return 'blocked';
}

export function sanitizeBilateralNextArcOpenPrepGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralNextArcOpenPrepGateSnapshot(): GTELBilateralNextArcOpenPrepGateSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    cyclePrimingLift: 0.08,
    summary: 'Next arc open prep gate is staging settled priming continuity into cycle charge.',
  };
}

export function advanceBilateralNextArcOpenPrepGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralNextArcOpenPrepGateSmoothing(persisted.bilateralNextArcOpenPrepGateSmoothing);
  const next = gtelClamp(prev * 0.33 + gtelClamp(rawScore, 0.16, 0.92) * 0.67, 0.16, 0.92);
  return {
    ...persisted,
    bilateralNextArcOpenPrepGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralNextArcOpenPrepGateSnapshot(input: {
  renewalArcPrimingContinuity: GTELRenewalArcPrimingContinuitySnapshot;
  acknowledgedCyclePriming: GTELAcknowledgedCyclePrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralNextArcOpenPrepGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.renewalArcPrimingContinuity.band === 'settled'
      ? 0.17
      : input.renewalArcPrimingContinuity.band === 'holding'
        ? 0.08
        : input.renewalArcPrimingContinuity.band === 'unsettled'
          ? -0.04
          : -0.1;
  const cyclePrimingLift =
    input.acknowledgedCyclePriming.band === 'primed'
      ? 0.16
      : input.acknowledgedCyclePriming.band === 'empty'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.renewalArcPrimingContinuity.score * 0.5 +
      input.acknowledgedCyclePriming.score * 0.26 +
      continuityFeed +
      cyclePrimingLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralNextArcOpenPrepGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralNextArcOpenPrepGateSmoothing(persisted.bilateralNextArcOpenPrepGateSmoothing);
  const band = prepBand(score);

  const summary =
    band === 'prepped'
      ? 'Next arc open prep gate is prepped — settled continuity and primed cycle admit the next opening.'
      : band === 'blocked'
        ? 'Arc open prep blocked; void continuity and empty cycle priming withheld the window.'
        : band === 'deferred'
          ? 'Prep deferred — acknowledged cycle priming is lagging settled continuity.'
          : 'Next arc open prep gate is staging settled priming continuity into cycle charge.';

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

export function bilateralNextArcOpenPrepGateExportScale(snapshot: GTELBilateralNextArcOpenPrepGateSnapshot): number {
  if (snapshot.band === 'prepped') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.957 + snapshot.score * 0.006, 0.951, 0.969);
  if (snapshot.band === 'deferred') return gtelClamp(0.99 + snapshot.score * 0.001, 0.985, 0.993);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralNextArcOpenPrepGateDomesticStressRelief(
  snapshot: GTELBilateralNextArcOpenPrepGateSnapshot,
): number {
  if (snapshot.band === 'prepped') return gtelClamp(snapshot.score * 0.019, 0.004, 0.023);
  if (snapshot.band === 'staging') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralNextArcOpenPrepGateWorldEvent(
  snapshot: GTELBilateralNextArcOpenPrepGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'deferred') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_arc_prep_${turn}`,
    turn,
    kind: 'trade',
    title: 'Next arc open prep constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NSW'],
  };
}

export function bilateralNextArcOpenPrepGateGiNotes(
  snapshot: GTELBilateralNextArcOpenPrepGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral next arc open prep gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
