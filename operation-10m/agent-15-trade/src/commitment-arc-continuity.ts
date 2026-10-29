import type {
  GTELBilateralCommitmentArcOpeningSnapshot,
  GTELCommitmentArcContinuitySnapshot,
  GTELPersisted,
  GTELResumedLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCommitmentArcContinuityBand = GTELCommitmentArcContinuitySnapshot['band'];

function continuityBand(score: number): GTELCommitmentArcContinuityBand {
  if (score >= 0.93) return 'sustained';
  if (score >= 0.73) return 'tracking';
  if (score >= 0.55) return 'drifting';
  return 'lost';
}

export function sanitizeCommitmentArcContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCommitmentArcContinuitySnapshot(): GTELCommitmentArcContinuitySnapshot {
  return {
    score: 0.52,
    band: 'tracking',
    arcOpeningSupport: 0.1,
    loopAlignment: 0.08,
    summary: 'Commitment arc continuity is tracking opened arc against resumed loop.',
  };
}

export function advanceCommitmentArcContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCommitmentArcContinuitySmoothing(persisted.commitmentArcContinuitySmoothing);
  const next = gtelClamp(prev * 0.46 + gtelClamp(rawScore, 0.16, 0.92) * 0.54, 0.16, 0.92);
  return { ...persisted, commitmentArcContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCommitmentArcContinuitySnapshot(input: {
  bilateralCommitmentArcOpening: GTELBilateralCommitmentArcOpeningSnapshot;
  resumedLoopContinuity: GTELResumedLoopContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCommitmentArcContinuitySnapshot; persisted: GTELPersisted } {
  const arcOpeningSupport =
    input.bilateralCommitmentArcOpening.band === 'opened'
      ? 0.17
      : input.bilateralCommitmentArcOpening.band === 'unlocking'
        ? 0.08
        : input.bilateralCommitmentArcOpening.band === 'latched'
          ? -0.03
          : -0.1;
  const loopAlignment =
    input.resumedLoopContinuity.band === 'continuous'
      ? 0.14
      : input.resumedLoopContinuity.band === 'broken'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCommitmentArcOpening.score * 0.5 +
      input.resumedLoopContinuity.score * 0.28 +
      arcOpeningSupport +
      loopAlignment,
    0.16,
    0.92,
  );
  const persisted = advanceCommitmentArcContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeCommitmentArcContinuitySmoothing(persisted.commitmentArcContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'sustained'
      ? 'Commitment arc continuity is sustained — opened arc and resumed loop stay aligned.'
      : band === 'lost'
        ? 'Arc continuity lost; sealed opening and broken loop diverged.'
        : band === 'drifting'
          ? 'Continuity is drifting — loop alignment is lagging arc opening.'
          : 'Commitment arc continuity is tracking opened arc against resumed loop.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      arcOpeningSupport: Math.round(arcOpeningSupport * 1000) / 1000,
      loopAlignment: Math.round(loopAlignment * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function commitmentArcContinuityExportScale(snapshot: GTELCommitmentArcContinuitySnapshot): number {
  if (snapshot.band === 'sustained') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'lost') return gtelClamp(0.97 + snapshot.score * 0.005, 0.965, 0.982);
  if (snapshot.band === 'drifting') return gtelClamp(0.996 + snapshot.score * 0.001, 0.992, 0.999);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function commitmentArcContinuityDomesticStress(snapshot: GTELCommitmentArcContinuitySnapshot): number {
  if (snapshot.band === 'lost') return gtelClamp((0.3 - snapshot.score) * 0.045, 0.004, 0.022);
  if (snapshot.band === 'drifting') return gtelClamp((0.42 - snapshot.score) * 0.02, 0.001, 0.012);
  return 0;
}

export function commitmentArcContinuityWorldEvent(
  snapshot: GTELCommitmentArcContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'lost' && snapshot.band !== 'drifting') return null;
  if (snapshot.arcOpeningSupport > -0.02) return null;
  return {
    id: `gtel_arc_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment arc continuity strain',
    summary: snapshot.summary,
    regionIds: ['VIC', 'NSW', 'QLD'],
  };
}

export function commitmentArcContinuityGiNotes(
  snapshot: GTELCommitmentArcContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Commitment arc continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
