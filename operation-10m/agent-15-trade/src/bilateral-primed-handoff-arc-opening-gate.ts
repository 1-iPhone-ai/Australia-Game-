import type {
  GTELBilateralCommitmentArcOpeningSnapshot,
  GTELBilateralPrimedHandoffArcOpeningGateSnapshot,
  GTELHandedWaveCyclePrimingContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralPrimedHandoffArcOpeningGateBand =
  GTELBilateralPrimedHandoffArcOpeningGateSnapshot['band'];

function openingBand(score: number): GTELBilateralPrimedHandoffArcOpeningGateBand {
  if (score >= 0.94) return 'opened';
  if (score >= 0.74) return 'unlocking';
  if (score >= 0.56) return 'latched';
  return 'sealed';
}

export function sanitizeBilateralPrimedHandoffArcOpeningGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralPrimedHandoffArcOpeningGateSnapshot(): GTELBilateralPrimedHandoffArcOpeningGateSnapshot {
  return {
    score: 0.52,
    band: 'unlocking',
    continuityFeed: 0.1,
    arcOpeningLift: 0.08,
    summary: 'Primed handoff arc opening gate is unlocking settled priming continuity into commitment arc.',
  };
}

export function advanceBilateralPrimedHandoffArcOpeningGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralPrimedHandoffArcOpeningGateSmoothing(
    persisted.bilateralPrimedHandoffArcOpeningGateSmoothing,
  );
  const next = gtelClamp(prev * 0.19 + gtelClamp(rawScore, 0.16, 0.92) * 0.81, 0.16, 0.92);
  return {
    ...persisted,
    bilateralPrimedHandoffArcOpeningGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralPrimedHandoffArcOpeningGateSnapshot(input: {
  handedWaveCyclePrimingContinuity: GTELHandedWaveCyclePrimingContinuitySnapshot;
  bilateralCommitmentArcOpening: GTELBilateralCommitmentArcOpeningSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralPrimedHandoffArcOpeningGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.handedWaveCyclePrimingContinuity.band === 'settled'
      ? 0.17
      : input.handedWaveCyclePrimingContinuity.band === 'holding'
        ? 0.08
        : input.handedWaveCyclePrimingContinuity.band === 'unsettled'
          ? -0.04
          : -0.1;
  const arcOpeningLift =
    input.bilateralCommitmentArcOpening.band === 'opened'
      ? 0.16
      : input.bilateralCommitmentArcOpening.band === 'sealed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.handedWaveCyclePrimingContinuity.score * 0.5 +
      input.bilateralCommitmentArcOpening.score * 0.26 +
      continuityFeed +
      arcOpeningLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralPrimedHandoffArcOpeningGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralPrimedHandoffArcOpeningGateSmoothing(
    persisted.bilateralPrimedHandoffArcOpeningGateSmoothing,
  );
  const band = openingBand(score);

  const summary =
    band === 'opened'
      ? 'Primed handoff arc opening gate is opened — settled priming continuity and opened arc admit commitments.'
      : band === 'sealed'
        ? 'Arc opening sealed; void priming continuity and sealed arc withheld unlock.'
        : band === 'latched'
          ? 'Opening latched — commitment arc is lagging settled priming continuity.'
          : 'Primed handoff arc opening gate is unlocking settled priming continuity into commitment arc.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      arcOpeningLift: Math.round(arcOpeningLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralPrimedHandoffArcOpeningGateExportScale(
  snapshot: GTELBilateralPrimedHandoffArcOpeningGateSnapshot,
): number {
  if (snapshot.band === 'opened') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'sealed') return gtelClamp(0.943 + snapshot.score * 0.006, 0.937, 0.955);
  if (snapshot.band === 'latched') return gtelClamp(0.979 + snapshot.score * 0.001, 0.974, 0.982);
  return gtelClamp(0.981 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralPrimedHandoffArcOpeningGateDomesticStressRelief(
  snapshot: GTELBilateralPrimedHandoffArcOpeningGateSnapshot,
): number {
  if (snapshot.band === 'opened') return gtelClamp(snapshot.score * 0.029, 0.005, 0.033);
  if (snapshot.band === 'unlocking') return gtelClamp(snapshot.score * 0.01, 0, 0.011);
  return 0;
}

export function bilateralPrimedHandoffArcOpeningGateWorldEvent(
  snapshot: GTELBilateralPrimedHandoffArcOpeningGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'sealed' && snapshot.band !== 'latched') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_phao_${turn}`,
    turn,
    kind: 'trade',
    title: 'Primed handoff arc opening constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'NSW', 'SA'],
  };
}

export function bilateralPrimedHandoffArcOpeningGateGiNotes(
  snapshot: GTELBilateralPrimedHandoffArcOpeningGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral primed handoff arc opening gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
