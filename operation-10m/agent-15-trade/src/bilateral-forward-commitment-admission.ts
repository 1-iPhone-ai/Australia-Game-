import type {
  GTELBilateralCommitmentArcOpeningSnapshot,
  GTELBilateralForwardCommitmentAdmissionSnapshot,
  GTELCommitmentArcContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralForwardCommitmentAdmissionBand =
  GTELBilateralForwardCommitmentAdmissionSnapshot['band'];

function admissionBand(score: number): GTELBilateralForwardCommitmentAdmissionBand {
  if (score >= 0.94) return 'admitted';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'throttled';
  return 'closed';
}

export function sanitizeBilateralForwardCommitmentAdmissionSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralForwardCommitmentAdmissionSnapshot(): GTELBilateralForwardCommitmentAdmissionSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    arcGateLift: 0.08,
    summary: 'Forward commitment admission is staging sustained arc continuity.',
  };
}

export function advanceBilateralForwardCommitmentAdmissionSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralForwardCommitmentAdmissionSmoothing(
    persisted.bilateralForwardCommitmentAdmissionSmoothing,
  );
  const next = gtelClamp(prev * 0.45 + gtelClamp(rawScore, 0.16, 0.92) * 0.55, 0.16, 0.92);
  return {
    ...persisted,
    bilateralForwardCommitmentAdmissionSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralForwardCommitmentAdmissionSnapshot(input: {
  commitmentArcContinuity: GTELCommitmentArcContinuitySnapshot;
  bilateralCommitmentArcOpening: GTELBilateralCommitmentArcOpeningSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralForwardCommitmentAdmissionSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.commitmentArcContinuity.band === 'sustained'
      ? 0.18
      : input.commitmentArcContinuity.band === 'tracking'
        ? 0.08
        : input.commitmentArcContinuity.band === 'drifting'
          ? -0.04
          : -0.11;
  const arcGateLift =
    input.bilateralCommitmentArcOpening.band === 'opened'
      ? 0.15
      : input.bilateralCommitmentArcOpening.band === 'sealed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.commitmentArcContinuity.score * 0.52 +
      input.bilateralCommitmentArcOpening.score * 0.24 +
      continuityFeed +
      arcGateLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralForwardCommitmentAdmissionSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralForwardCommitmentAdmissionSmoothing(
    persisted.bilateralForwardCommitmentAdmissionSmoothing,
  );
  const band = admissionBand(score);

  const summary =
    band === 'admitted'
      ? 'Bilateral forward commitments are admitted — sustained arc continuity cleared the gate.'
      : band === 'closed'
        ? 'Forward admission closed; lost continuity blocked new bilateral slots.'
        : band === 'throttled'
          ? 'Admission throttled — arc gate is holding continuity feed at the border.'
          : 'Forward commitment admission is staging sustained arc continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      arcGateLift: Math.round(arcGateLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralForwardCommitmentAdmissionExportScale(
  snapshot: GTELBilateralForwardCommitmentAdmissionSnapshot,
): number {
  if (snapshot.band === 'admitted') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'closed') return gtelClamp(0.968 + snapshot.score * 0.006, 0.962, 0.98);
  if (snapshot.band === 'throttled') return gtelClamp(0.995 + snapshot.score * 0.001, 0.99, 0.998);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralForwardCommitmentAdmissionDomesticStressRelief(
  snapshot: GTELBilateralForwardCommitmentAdmissionSnapshot,
): number {
  if (snapshot.band === 'admitted') return gtelClamp(snapshot.score * 0.013, 0.003, 0.017);
  if (snapshot.band === 'staging') return gtelClamp(snapshot.score * 0.005, 0, 0.006);
  return 0;
}

export function bilateralForwardCommitmentAdmissionWorldEvent(
  snapshot: GTELBilateralForwardCommitmentAdmissionSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'closed' && snapshot.band !== 'throttled') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_fwd_admit_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward commitment admission constrained',
    summary: snapshot.summary,
    regionIds: ['SA', 'WA', 'NSW'],
  };
}

export function bilateralForwardCommitmentAdmissionGiNotes(
  snapshot: GTELBilateralForwardCommitmentAdmissionSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral forward commitment admission: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
