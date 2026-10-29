import type {
  GTELBilateralCommitmentArcOpeningSnapshot,
  GTELBilateralPreparedArcOpeningHandoffSnapshot,
  GTELNextArcOpenPrepContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralPreparedArcOpeningHandoffBand = GTELBilateralPreparedArcOpeningHandoffSnapshot['band'];

function handoffBand(score: number): GTELBilateralPreparedArcOpeningHandoffBand {
  if (score >= 0.94) return 'handed_off';
  if (score >= 0.74) return 'coupling';
  if (score >= 0.56) return 'queued';
  return 'withheld';
}

export function sanitizeBilateralPreparedArcOpeningHandoffSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralPreparedArcOpeningHandoffSnapshot(): GTELBilateralPreparedArcOpeningHandoffSnapshot {
  return {
    score: 0.52,
    band: 'coupling',
    prepContinuityFeed: 0.1,
    arcOpeningLift: 0.08,
    summary: 'Prepared arc opening handoff is coupling ready prep continuity into commitment arc opening.',
  };
}

export function advanceBilateralPreparedArcOpeningHandoffSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralPreparedArcOpeningHandoffSmoothing(
    persisted.bilateralPreparedArcOpeningHandoffSmoothing,
  );
  const next = gtelClamp(prev * 0.31 + gtelClamp(rawScore, 0.16, 0.92) * 0.69, 0.16, 0.92);
  return {
    ...persisted,
    bilateralPreparedArcOpeningHandoffSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralPreparedArcOpeningHandoffSnapshot(input: {
  nextArcOpenPrepContinuity: GTELNextArcOpenPrepContinuitySnapshot;
  bilateralCommitmentArcOpening: GTELBilateralCommitmentArcOpeningSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralPreparedArcOpeningHandoffSnapshot; persisted: GTELPersisted } {
  const prepContinuityFeed =
    input.nextArcOpenPrepContinuity.band === 'ready'
      ? 0.17
      : input.nextArcOpenPrepContinuity.band === 'aligned'
        ? 0.08
        : input.nextArcOpenPrepContinuity.band === 'drifting'
          ? -0.04
          : -0.1;
  const arcOpeningLift =
    input.bilateralCommitmentArcOpening.band === 'opened'
      ? 0.16
      : input.bilateralCommitmentArcOpening.band === 'sealed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.nextArcOpenPrepContinuity.score * 0.5 +
      input.bilateralCommitmentArcOpening.score * 0.26 +
      prepContinuityFeed +
      arcOpeningLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralPreparedArcOpeningHandoffSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralPreparedArcOpeningHandoffSmoothing(
    persisted.bilateralPreparedArcOpeningHandoffSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'handed_off'
      ? 'Prepared arc opening handoff complete — ready prep continuity meets opened commitment arc.'
      : band === 'withheld'
        ? 'Arc opening handoff withheld; cleared prep and sealed arc diverged.'
        : band === 'queued'
          ? 'Handoff queued — arc opening is lagging ready prep continuity.'
          : 'Prepared arc opening handoff is coupling ready prep continuity into commitment arc opening.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      prepContinuityFeed: Math.round(prepContinuityFeed * 1000) / 1000,
      arcOpeningLift: Math.round(arcOpeningLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralPreparedArcOpeningHandoffExportScale(
  snapshot: GTELBilateralPreparedArcOpeningHandoffSnapshot,
): number {
  if (snapshot.band === 'handed_off') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'withheld') return gtelClamp(0.955 + snapshot.score * 0.006, 0.949, 0.967);
  if (snapshot.band === 'queued') return gtelClamp(0.989 + snapshot.score * 0.001, 0.984, 0.992);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralPreparedArcOpeningHandoffDomesticStressRelief(
  snapshot: GTELBilateralPreparedArcOpeningHandoffSnapshot,
): number {
  if (snapshot.band === 'handed_off') return gtelClamp(snapshot.score * 0.02, 0.005, 0.024);
  if (snapshot.band === 'coupling') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralPreparedArcOpeningHandoffWorldEvent(
  snapshot: GTELBilateralPreparedArcOpeningHandoffSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'withheld' && snapshot.band !== 'queued') return null;
  if (snapshot.prepContinuityFeed > -0.02) return null;
  return {
    id: `gtel_prep_handoff_${turn}`,
    turn,
    kind: 'trade',
    title: 'Prepared arc opening handoff constrained',
    summary: snapshot.summary,
    regionIds: ['SA', 'WA', 'NSW'],
  };
}

export function bilateralPreparedArcOpeningHandoffGiNotes(
  snapshot: GTELBilateralPreparedArcOpeningHandoffSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral prepared arc opening handoff: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
