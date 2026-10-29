import type {
  GTELAcknowledgedCyclePrimingSnapshot,
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralCommitmentArcOpeningSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCommitmentArcOpeningBand = GTELBilateralCommitmentArcOpeningSnapshot['band'];

function arcBand(score: number): GTELBilateralCommitmentArcOpeningBand {
  if (score >= 0.94) return 'opened';
  if (score >= 0.74) return 'unlocking';
  if (score >= 0.56) return 'latched';
  return 'sealed';
}

export function sanitizeBilateralCommitmentArcOpeningSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCommitmentArcOpeningSnapshot(): GTELBilateralCommitmentArcOpeningSnapshot {
  return {
    score: 0.52,
    band: 'unlocking',
    primingSupport: 0.1,
    readinessAnchor: 0.08,
    summary: 'Commitment arc opening is unlocking as primed cycle meets book readiness.',
  };
}

export function advanceBilateralCommitmentArcOpeningSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCommitmentArcOpeningSmoothing(persisted.bilateralCommitmentArcOpeningSmoothing);
  const next = gtelClamp(prev * 0.47 + gtelClamp(rawScore, 0.16, 0.92) * 0.53, 0.16, 0.92);
  return { ...persisted, bilateralCommitmentArcOpeningSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCommitmentArcOpeningSnapshot(input: {
  acknowledgedCyclePriming: GTELAcknowledgedCyclePrimingSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCommitmentArcOpeningSnapshot; persisted: GTELPersisted } {
  const primingSupport =
    input.acknowledgedCyclePriming.band === 'primed'
      ? 0.16
      : input.acknowledgedCyclePriming.band === 'charging'
        ? 0.07
        : input.acknowledgedCyclePriming.band === 'weak'
          ? -0.04
          : -0.08;
  const readinessAnchor =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.14
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.acknowledgedCyclePriming.score * 0.54 +
      input.anchoredBookReadiness.score * 0.24 +
      primingSupport +
      readinessAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCommitmentArcOpeningSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCommitmentArcOpeningSmoothing(persisted.bilateralCommitmentArcOpeningSmoothing);
  const band = arcBand(score);

  const summary =
    band === 'opened'
      ? 'Bilateral commitment arc is opened — primed cycle and ready books admit new forward slots.'
      : band === 'sealed'
        ? 'Arc opening sealed; empty priming withheld the next commitment window.'
        : band === 'latched'
          ? 'Arc opening latched — readiness anchor is holding priming at the gate.'
          : 'Commitment arc opening is unlocking as primed cycle meets book readiness.';

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

export function bilateralCommitmentArcOpeningExportScale(
  snapshot: GTELBilateralCommitmentArcOpeningSnapshot,
): number {
  if (snapshot.band === 'opened') return gtelClamp(1 + snapshot.score * 0.001, 1, 1.005);
  if (snapshot.band === 'sealed') return gtelClamp(0.992 + snapshot.score * 0.003, 0.985, 0.996);
  if (snapshot.band === 'latched') return gtelClamp(0.999 + snapshot.score * 0.0008, 0.997, 1.001);
  return gtelClamp(0.986 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCommitmentArcOpeningDomesticStressRelief(
  snapshot: GTELBilateralCommitmentArcOpeningSnapshot,
): number {
  if (snapshot.band === 'opened') return gtelClamp(snapshot.score * 0.012, 0.002, 0.016);
  if (snapshot.band === 'unlocking') return gtelClamp(snapshot.score * 0.004, 0, 0.005);
  return 0;
}

export function bilateralCommitmentArcOpeningWorldEvent(
  snapshot: GTELBilateralCommitmentArcOpeningSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'sealed' && snapshot.band !== 'latched') return null;
  if (snapshot.primingSupport > -0.02) return null;
  return {
    id: `gtel_arc_open_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment arc opening constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralCommitmentArcOpeningGiNotes(
  snapshot: GTELBilateralCommitmentArcOpeningSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral commitment arc opening: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
