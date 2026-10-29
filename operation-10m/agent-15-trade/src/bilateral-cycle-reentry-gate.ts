import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralCycleReentryGateSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCycleReentryGateBand = GTELBilateralCycleReentryGateSnapshot['band'];

function reentryBand(score: number): GTELBilateralCycleReentryGateBand {
  if (score >= 0.88) return 'entered';
  if (score >= 0.68) return 'approaching';
  if (score >= 0.5) return 'held';
  return 'denied';
}

export function sanitizeBilateralCycleReentryGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCycleReentryGateSnapshot(): GTELBilateralCycleReentryGateSnapshot {
  return {
    score: 0.52,
    band: 'approaching',
    primingSupport: 0.1,
    readinessAnchor: 0.08,
    summary: 'Cycle reentry gate is approaching as primed capacity meets book readiness.',
  };
}

export function advanceBilateralCycleReentryGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCycleReentryGateSmoothing(persisted.bilateralCycleReentryGateSmoothing);
  const next = gtelClamp(prev * 0.53 + gtelClamp(rawScore, 0.16, 0.92) * 0.47, 0.16, 0.92);
  return { ...persisted, bilateralCycleReentryGateSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCycleReentryGateSnapshot(input: {
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCycleReentryGateSnapshot; persisted: GTELPersisted } {
  const primingSupport =
    input.capacityRenewalPriming.band === 'primed'
      ? 0.16
      : input.capacityRenewalPriming.band === 'charging'
        ? 0.07
        : input.capacityRenewalPriming.band === 'underfed'
          ? -0.04
          : -0.1;
  const readinessAnchor =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.14
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.capacityRenewalPriming.score * 0.52 +
      input.anchoredBookReadiness.score * 0.26 +
      primingSupport +
      readinessAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCycleReentryGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCycleReentryGateSmoothing(persisted.bilateralCycleReentryGateSmoothing);
  const band = reentryBand(score);

  const summary =
    band === 'entered'
      ? 'Cycle reentry gate is entered — primed capacity and ready books open the next bilateral loop.'
      : band === 'denied'
        ? 'Reentry denied; priming starved before readiness could admit the next cycle.'
        : band === 'held'
          ? 'Reentry held — book readiness is lagging primed capacity.'
          : 'Cycle reentry gate is approaching as primed capacity meets book readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      primingSupport: Math.round(primingSupport * 1000) / 1000,
      readinessAnchor: Math.round(readinessAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCycleReentryGateExportScale(snapshot: GTELBilateralCycleReentryGateSnapshot): number {
  if (snapshot.band === 'entered') return gtelClamp(1 + snapshot.score * 0.006, 1, 1.012);
  if (snapshot.band === 'denied') return gtelClamp(0.97 + snapshot.score * 0.012, 0.955, 0.985);
  if (snapshot.band === 'held') return gtelClamp(0.992 + snapshot.score * 0.006, 0.98, 0.998);
  return gtelClamp(0.98 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCycleReentryGateDomesticStressRelief(
  snapshot: GTELBilateralCycleReentryGateSnapshot,
): number {
  if (snapshot.band === 'entered') return gtelClamp(snapshot.score * 0.018, 0.005, 0.022);
  if (snapshot.band === 'approaching') return gtelClamp(snapshot.score * 0.007, 0, 0.008);
  return 0;
}

export function bilateralCycleReentryGateWorldEvent(
  snapshot: GTELBilateralCycleReentryGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'denied' && snapshot.band !== 'held') return null;
  if (snapshot.primingSupport > -0.02) return null;
  return {
    id: `gtel_reentry_${turn}`,
    turn,
    kind: 'trade',
    title: 'Bilateral cycle reentry constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralCycleReentryGateGiNotes(
  snapshot: GTELBilateralCycleReentryGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral cycle reentry gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
