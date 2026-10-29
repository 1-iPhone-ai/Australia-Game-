import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralTradeWindowContinuitySnapshot,
  GTELCapacityHandoffAbsorptionSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralTradeWindowContinuityBand = GTELBilateralTradeWindowContinuitySnapshot['band'];

function continuityBand(score: number): GTELBilateralTradeWindowContinuityBand {
  if (score >= 0.84) return 'continuous';
  if (score >= 0.64) return 'bridging';
  if (score >= 0.46) return 'gapped';
  return 'severed';
}

export function sanitizeBilateralTradeWindowContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralTradeWindowContinuitySnapshot(): GTELBilateralTradeWindowContinuitySnapshot {
  return {
    score: 0.52,
    band: 'bridging',
    absorptionSupport: 0.1,
    readinessAnchor: 0.08,
    summary: 'Trade window continuity is bridging absorbed capacity into the next cycle.',
  };
}

export function advanceBilateralTradeWindowContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralTradeWindowContinuitySmoothing(persisted.bilateralTradeWindowContinuitySmoothing);
  const next = gtelClamp(prev * 0.57 + gtelClamp(rawScore, 0.16, 0.92) * 0.43, 0.16, 0.92);
  return { ...persisted, bilateralTradeWindowContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralTradeWindowContinuitySnapshot(input: {
  capacityHandoffAbsorption: GTELCapacityHandoffAbsorptionSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralTradeWindowContinuitySnapshot; persisted: GTELPersisted } {
  const absorptionSupport =
    input.capacityHandoffAbsorption.band === 'absorbed'
      ? 0.16
      : input.capacityHandoffAbsorption.band === 'integrating'
        ? 0.08
        : input.capacityHandoffAbsorption.band === 'leaking'
          ? -0.04
          : -0.1;
  const readinessAnchor =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.13
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.capacityHandoffAbsorption.score * 0.5 +
      input.anchoredBookReadiness.score * 0.26 +
      absorptionSupport +
      readinessAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralTradeWindowContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralTradeWindowContinuitySmoothing(persisted.bilateralTradeWindowContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'continuous'
      ? 'Trade window continuity is continuous — absorbed capacity bridges cleanly into the next cycle.'
      : band === 'severed'
        ? 'Window continuity is severed; handoff absorption failed to bridge the trade cycle.'
        : band === 'gapped'
          ? 'Continuity has gaps — readiness anchors are not holding the bridged window.'
          : 'Trade window continuity is bridging absorbed capacity into the next cycle.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      absorptionSupport: Math.round(absorptionSupport * 1000) / 1000,
      readinessAnchor: Math.round(readinessAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralTradeWindowContinuityExportScale(
  snapshot: GTELBilateralTradeWindowContinuitySnapshot,
): number {
  if (snapshot.band === 'continuous') return gtelClamp(1 + snapshot.score * 0.01, 1, 1.016);
  if (snapshot.band === 'severed') return gtelClamp(0.945 + snapshot.score * 0.025, 0.93, 0.97);
  if (snapshot.band === 'gapped') return gtelClamp(0.975 + snapshot.score * 0.015, 0.95, 0.99);
  return gtelClamp(0.976 + snapshot.score * 0.005, 0.95, 1.02);
}

export function bilateralTradeWindowContinuityDomesticStressRelief(
  snapshot: GTELBilateralTradeWindowContinuitySnapshot,
): number {
  if (snapshot.band === 'continuous') return gtelClamp(snapshot.score * 0.022, 0.008, 0.028);
  if (snapshot.band === 'bridging') return gtelClamp(snapshot.score * 0.009, 0, 0.01);
  return 0;
}

export function bilateralTradeWindowContinuityWorldEvent(
  snapshot: GTELBilateralTradeWindowContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severed' && snapshot.band !== 'gapped') return null;
  if (snapshot.absorptionSupport > -0.02) return null;
  return {
    id: `gtel_window_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade window continuity break',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralTradeWindowContinuityGiNotes(
  snapshot: GTELBilateralTradeWindowContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral trade window continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
