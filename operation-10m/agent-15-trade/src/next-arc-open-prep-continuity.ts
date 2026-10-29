import type {
  GTELBilateralNextArcOpenPrepGateSnapshot,
  GTELNextArcOpenPrepContinuitySnapshot,
  GTELPersisted,
  GTELRenewalArcPrimingContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELNextArcOpenPrepContinuityBand = GTELNextArcOpenPrepContinuitySnapshot['band'];

function continuityBand(score: number): GTELNextArcOpenPrepContinuityBand {
  if (score >= 0.93) return 'ready';
  if (score >= 0.73) return 'aligned';
  if (score >= 0.55) return 'drifting';
  return 'cleared';
}

export function sanitizeNextArcOpenPrepContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyNextArcOpenPrepContinuitySnapshot(): GTELNextArcOpenPrepContinuitySnapshot {
  return {
    score: 0.52,
    band: 'aligned',
    prepGateSupport: 0.1,
    primingAnchor: 0.08,
    summary: 'Next arc open prep continuity is aligning prepped gate with settled priming.',
  };
}

export function advanceNextArcOpenPrepContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeNextArcOpenPrepContinuitySmoothing(persisted.nextArcOpenPrepContinuitySmoothing);
  const next = gtelClamp(prev * 0.32 + gtelClamp(rawScore, 0.16, 0.92) * 0.68, 0.16, 0.92);
  return { ...persisted, nextArcOpenPrepContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeNextArcOpenPrepContinuitySnapshot(input: {
  bilateralNextArcOpenPrepGate: GTELBilateralNextArcOpenPrepGateSnapshot;
  renewalArcPrimingContinuity: GTELRenewalArcPrimingContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELNextArcOpenPrepContinuitySnapshot; persisted: GTELPersisted } {
  const prepGateSupport =
    input.bilateralNextArcOpenPrepGate.band === 'prepped'
      ? 0.18
      : input.bilateralNextArcOpenPrepGate.band === 'staging'
        ? 0.08
        : input.bilateralNextArcOpenPrepGate.band === 'deferred'
          ? -0.04
          : -0.11;
  const primingAnchor =
    input.renewalArcPrimingContinuity.band === 'settled'
      ? 0.15
      : input.renewalArcPrimingContinuity.band === 'void'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralNextArcOpenPrepGate.score * 0.52 +
      input.renewalArcPrimingContinuity.score * 0.24 +
      prepGateSupport +
      primingAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceNextArcOpenPrepContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeNextArcOpenPrepContinuitySmoothing(persisted.nextArcOpenPrepContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'ready'
      ? 'Next arc open prep continuity is ready — prepped gate and settled priming hold for opening handoff.'
      : band === 'cleared'
        ? 'Prep continuity cleared; blocked gate and void priming diverged.'
        : band === 'drifting'
          ? 'Prep continuity drifting — priming anchor is lagging prepped gate.'
          : 'Next arc open prep continuity is aligning prepped gate with settled priming.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      prepGateSupport: Math.round(prepGateSupport * 1000) / 1000,
      primingAnchor: Math.round(primingAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function nextArcOpenPrepContinuityExportScale(snapshot: GTELNextArcOpenPrepContinuitySnapshot): number {
  if (snapshot.band === 'ready') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'cleared') return gtelClamp(0.956 + snapshot.score * 0.005, 0.95, 0.968);
  if (snapshot.band === 'drifting') return gtelClamp(0.99 + snapshot.score * 0.001, 0.985, 0.993);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function nextArcOpenPrepContinuityDomesticStress(snapshot: GTELNextArcOpenPrepContinuitySnapshot): number {
  if (snapshot.band === 'cleared') return gtelClamp((0.24 - snapshot.score) * 0.028, 0.003, 0.014);
  if (snapshot.band === 'drifting') return gtelClamp((0.36 - snapshot.score) * 0.011, 0.001, 0.004);
  return 0;
}

export function nextArcOpenPrepContinuityWorldEvent(
  snapshot: GTELNextArcOpenPrepContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'cleared' && snapshot.band !== 'drifting') return null;
  if (snapshot.prepGateSupport > -0.02) return null;
  return {
    id: `gtel_prep_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Next arc open prep continuity strain',
    summary: snapshot.summary,
    regionIds: ['VIC', 'QLD', 'NSW'],
  };
}

export function nextArcOpenPrepContinuityGiNotes(
  snapshot: GTELNextArcOpenPrepContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Next arc open prep continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
