import type {
  GTELBilateralPrimedHandoffArcOpeningGateSnapshot,
  GTELHandedWaveCyclePrimingContinuitySnapshot,
  GTELPersisted,
  GTELPrimedHandoffArcOpeningContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELPrimedHandoffArcOpeningContinuityBand = GTELPrimedHandoffArcOpeningContinuitySnapshot['band'];

function continuityBand(score: number): GTELPrimedHandoffArcOpeningContinuityBand {
  if (score >= 0.93) return 'engaged';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'broken';
}

export function sanitizePrimedHandoffArcOpeningContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyPrimedHandoffArcOpeningContinuitySnapshot(): GTELPrimedHandoffArcOpeningContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    openingGateSupport: 0.1,
    primingAnchor: 0.08,
    summary: 'Primed handoff arc opening continuity is holding opened gate against settled priming anchor.',
  };
}

export function advancePrimedHandoffArcOpeningContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizePrimedHandoffArcOpeningContinuitySmoothing(
    persisted.primedHandoffArcOpeningContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.3 + gtelClamp(rawScore, 0.16, 0.92) * 0.7, 0.16, 0.92);
  return {
    ...persisted,
    primedHandoffArcOpeningContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computePrimedHandoffArcOpeningContinuitySnapshot(input: {
  bilateralPrimedHandoffArcOpeningGate: GTELBilateralPrimedHandoffArcOpeningGateSnapshot;
  handedWaveCyclePrimingContinuity: GTELHandedWaveCyclePrimingContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELPrimedHandoffArcOpeningContinuitySnapshot; persisted: GTELPersisted } {
  const openingGateSupport =
    input.bilateralPrimedHandoffArcOpeningGate.band === 'opened'
      ? 0.18
      : input.bilateralPrimedHandoffArcOpeningGate.band === 'unlocking'
        ? 0.08
        : input.bilateralPrimedHandoffArcOpeningGate.band === 'latched'
          ? -0.04
          : -0.11;
  const primingAnchor =
    input.handedWaveCyclePrimingContinuity.band === 'settled'
      ? 0.15
      : input.handedWaveCyclePrimingContinuity.band === 'void'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralPrimedHandoffArcOpeningGate.score * 0.51 +
      input.handedWaveCyclePrimingContinuity.score * 0.25 +
      openingGateSupport +
      primingAnchor,
    0.16,
    0.92,
  );
  const persisted = advancePrimedHandoffArcOpeningContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizePrimedHandoffArcOpeningContinuitySmoothing(
    persisted.primedHandoffArcOpeningContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'engaged'
      ? 'Primed handoff arc opening continuity is engaged — opened gate and settled priming anchor forward admission.'
      : band === 'broken'
        ? 'Arc opening continuity broken; sealed gate and void priming diverged.'
        : band === 'slipping'
          ? 'Opening continuity slipping — priming anchor is lagging opened gate.'
          : 'Primed handoff arc opening continuity is holding opened gate against settled priming anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      openingGateSupport: Math.round(openingGateSupport * 1000) / 1000,
      primingAnchor: Math.round(primingAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function primedHandoffArcOpeningContinuityExportScale(
  snapshot: GTELPrimedHandoffArcOpeningContinuitySnapshot,
): number {
  if (snapshot.band === 'engaged') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.945 + snapshot.score * 0.005, 0.939, 0.957);
  if (snapshot.band === 'slipping') return gtelClamp(0.981 + snapshot.score * 0.001, 0.976, 0.984);
  return gtelClamp(0.979 + snapshot.score * 0.001, 0.95, 1.02);
}

export function primedHandoffArcOpeningContinuityDomesticStress(
  snapshot: GTELPrimedHandoffArcOpeningContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'slipping') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function primedHandoffArcOpeningContinuityWorldEvent(
  snapshot: GTELPrimedHandoffArcOpeningContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'slipping') return null;
  if (snapshot.openingGateSupport > -0.02) return null;
  return {
    id: `gtel_phaoc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Primed handoff arc opening continuity strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NSW'],
  };
}

export function primedHandoffArcOpeningContinuityGiNotes(
  snapshot: GTELPrimedHandoffArcOpeningContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Primed handoff arc opening continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
