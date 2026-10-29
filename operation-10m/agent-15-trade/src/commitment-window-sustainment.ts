import type {
  GTELAdmittedForwardCommitmentContinuitySnapshot,
  GTELBilateralCommitmentWindowHandoffSnapshot,
  GTELCommitmentWindowSustainmentSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCommitmentWindowSustainmentBand = GTELCommitmentWindowSustainmentSnapshot['band'];

function sustainmentBand(score: number): GTELCommitmentWindowSustainmentBand {
  if (score >= 0.93) return 'sustained';
  if (score >= 0.73) return 'carrying';
  if (score >= 0.55) return 'fading';
  return 'dropped';
}

export function sanitizeCommitmentWindowSustainmentSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCommitmentWindowSustainmentSnapshot(): GTELCommitmentWindowSustainmentSnapshot {
  return {
    score: 0.52,
    band: 'carrying',
    handoffSupport: 0.1,
    admittedAnchor: 0.08,
    summary: 'Commitment window sustainment is carrying handed-off admissions.',
  };
}

export function advanceCommitmentWindowSustainmentSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCommitmentWindowSustainmentSmoothing(persisted.commitmentWindowSustainmentSmoothing);
  const next = gtelClamp(prev * 0.42 + gtelClamp(rawScore, 0.16, 0.92) * 0.58, 0.16, 0.92);
  return { ...persisted, commitmentWindowSustainmentSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCommitmentWindowSustainmentSnapshot(input: {
  bilateralCommitmentWindowHandoff: GTELBilateralCommitmentWindowHandoffSnapshot;
  admittedForwardCommitmentContinuity: GTELAdmittedForwardCommitmentContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCommitmentWindowSustainmentSnapshot; persisted: GTELPersisted } {
  const handoffSupport =
    input.bilateralCommitmentWindowHandoff.band === 'handed_off'
      ? 0.18
      : input.bilateralCommitmentWindowHandoff.band === 'aligning'
        ? 0.08
        : input.bilateralCommitmentWindowHandoff.band === 'queued'
          ? -0.04
          : -0.11;
  const admittedAnchor =
    input.admittedForwardCommitmentContinuity.band === 'anchored'
      ? 0.14
      : input.admittedForwardCommitmentContinuity.band === 'revoked'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCommitmentWindowHandoff.score * 0.5 +
      input.admittedForwardCommitmentContinuity.score * 0.26 +
      handoffSupport +
      admittedAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceCommitmentWindowSustainmentSmoothing(input.persisted, rawScore);
  const score = sanitizeCommitmentWindowSustainmentSmoothing(persisted.commitmentWindowSustainmentSmoothing);
  const band = sustainmentBand(score);

  const summary =
    band === 'sustained'
      ? 'Commitment window sustainment is sustained — handed-off window holds anchored admissions.'
      : band === 'dropped'
        ? 'Window sustainment dropped; blocked handoff broke admitted anchor.'
        : band === 'fading'
          ? 'Sustainment is fading — admitted anchor is lagging window handoff.'
          : 'Commitment window sustainment is carrying handed-off admissions.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffSupport: Math.round(handoffSupport * 1000) / 1000,
      admittedAnchor: Math.round(admittedAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function commitmentWindowSustainmentExportScale(snapshot: GTELCommitmentWindowSustainmentSnapshot): number {
  if (snapshot.band === 'sustained') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'dropped') return gtelClamp(0.966 + snapshot.score * 0.005, 0.96, 0.978);
  if (snapshot.band === 'fading') return gtelClamp(0.995 + snapshot.score * 0.001, 0.99, 0.998);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function commitmentWindowSustainmentDomesticStress(snapshot: GTELCommitmentWindowSustainmentSnapshot): number {
  if (snapshot.band === 'dropped') return gtelClamp((0.29 - snapshot.score) * 0.038, 0.003, 0.019);
  if (snapshot.band === 'fading') return gtelClamp((0.41 - snapshot.score) * 0.016, 0.001, 0.009);
  return 0;
}

export function commitmentWindowSustainmentWorldEvent(
  snapshot: GTELCommitmentWindowSustainmentSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'dropped' && snapshot.band !== 'fading') return null;
  if (snapshot.handoffSupport > -0.02) return null;
  return {
    id: `gtel_win_sustain_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment window sustainment strain',
    summary: snapshot.summary,
    regionIds: ['VIC', 'QLD', 'NSW'],
  };
}

export function commitmentWindowSustainmentGiNotes(
  snapshot: GTELCommitmentWindowSustainmentSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Commitment window sustainment: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
