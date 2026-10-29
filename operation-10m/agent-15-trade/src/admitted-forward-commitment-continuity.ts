import type {
  GTELAdmittedForwardCommitmentContinuitySnapshot,
  GTELBilateralForwardCommitmentAdmissionSnapshot,
  GTELCommitmentArcContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELAdmittedForwardCommitmentContinuityBand =
  GTELAdmittedForwardCommitmentContinuitySnapshot['band'];

function continuityBand(score: number): GTELAdmittedForwardCommitmentContinuityBand {
  if (score >= 0.93) return 'anchored';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'revoked';
}

export function sanitizeAdmittedForwardCommitmentContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyAdmittedForwardCommitmentContinuitySnapshot(): GTELAdmittedForwardCommitmentContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    admissionSupport: 0.1,
    arcContinuityFeed: 0.08,
    summary: 'Admitted forward commitments are holding against arc continuity drift.',
  };
}

export function advanceAdmittedForwardCommitmentContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeAdmittedForwardCommitmentContinuitySmoothing(
    persisted.admittedForwardCommitmentContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.44 + gtelClamp(rawScore, 0.16, 0.92) * 0.56, 0.16, 0.92);
  return {
    ...persisted,
    admittedForwardCommitmentContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeAdmittedForwardCommitmentContinuitySnapshot(input: {
  bilateralForwardCommitmentAdmission: GTELBilateralForwardCommitmentAdmissionSnapshot;
  commitmentArcContinuity: GTELCommitmentArcContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELAdmittedForwardCommitmentContinuitySnapshot; persisted: GTELPersisted } {
  const admissionSupport =
    input.bilateralForwardCommitmentAdmission.band === 'admitted'
      ? 0.17
      : input.bilateralForwardCommitmentAdmission.band === 'staging'
        ? 0.07
        : input.bilateralForwardCommitmentAdmission.band === 'throttled'
          ? -0.05
          : -0.1;
  const arcContinuityFeed =
    input.commitmentArcContinuity.band === 'sustained'
      ? 0.14
      : input.commitmentArcContinuity.band === 'lost'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralForwardCommitmentAdmission.score * 0.51 +
      input.commitmentArcContinuity.score * 0.27 +
      admissionSupport +
      arcContinuityFeed,
    0.16,
    0.92,
  );
  const persisted = advanceAdmittedForwardCommitmentContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeAdmittedForwardCommitmentContinuitySmoothing(
    persisted.admittedForwardCommitmentContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'anchored'
      ? 'Admitted forward commitments are anchored — admission and arc continuity stay aligned.'
      : band === 'revoked'
        ? 'Forward commitment continuity revoked; closed admission broke arc feed.'
        : band === 'slipping'
          ? 'Continuity is slipping — arc feed is lagging admitted slots.'
          : 'Admitted forward commitments are holding against arc continuity drift.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      admissionSupport: Math.round(admissionSupport * 1000) / 1000,
      arcContinuityFeed: Math.round(arcContinuityFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function admittedForwardCommitmentContinuityExportScale(
  snapshot: GTELAdmittedForwardCommitmentContinuitySnapshot,
): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'revoked') return gtelClamp(0.969 + snapshot.score * 0.005, 0.963, 0.981);
  if (snapshot.band === 'slipping') return gtelClamp(0.996 + snapshot.score * 0.001, 0.991, 0.998);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function admittedForwardCommitmentContinuityDomesticStress(
  snapshot: GTELAdmittedForwardCommitmentContinuitySnapshot,
): number {
  if (snapshot.band === 'revoked') return gtelClamp((0.28 - snapshot.score) * 0.04, 0.003, 0.02);
  if (snapshot.band === 'slipping') return gtelClamp((0.4 - snapshot.score) * 0.018, 0.001, 0.01);
  return 0;
}

export function admittedForwardCommitmentContinuityWorldEvent(
  snapshot: GTELAdmittedForwardCommitmentContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'revoked' && snapshot.band !== 'slipping') return null;
  if (snapshot.admissionSupport > -0.02) return null;
  return {
    id: `gtel_admit_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Admitted forward commitment continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function admittedForwardCommitmentContinuityGiNotes(
  snapshot: GTELAdmittedForwardCommitmentContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Admitted forward commitment continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
