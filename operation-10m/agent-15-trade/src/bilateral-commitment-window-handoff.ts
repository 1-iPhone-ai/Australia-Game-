import type {
  GTELAdmittedForwardCommitmentContinuitySnapshot,
  GTELBilateralCommitmentWindowHandoffSnapshot,
  GTELBilateralTradeWindowContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCommitmentWindowHandoffBand = GTELBilateralCommitmentWindowHandoffSnapshot['band'];

function handoffBand(score: number): GTELBilateralCommitmentWindowHandoffBand {
  if (score >= 0.94) return 'handed_off';
  if (score >= 0.74) return 'aligning';
  if (score >= 0.56) return 'queued';
  return 'blocked';
}

export function sanitizeBilateralCommitmentWindowHandoffSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCommitmentWindowHandoffSnapshot(): GTELBilateralCommitmentWindowHandoffSnapshot {
  return {
    score: 0.52,
    band: 'aligning',
    continuityAnchor: 0.1,
    windowFeed: 0.08,
    summary: 'Commitment window handoff is aligning anchored admissions with trade window continuity.',
  };
}

export function advanceBilateralCommitmentWindowHandoffSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCommitmentWindowHandoffSmoothing(
    persisted.bilateralCommitmentWindowHandoffSmoothing,
  );
  const next = gtelClamp(prev * 0.43 + gtelClamp(rawScore, 0.16, 0.92) * 0.57, 0.16, 0.92);
  return {
    ...persisted,
    bilateralCommitmentWindowHandoffSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralCommitmentWindowHandoffSnapshot(input: {
  admittedForwardCommitmentContinuity: GTELAdmittedForwardCommitmentContinuitySnapshot;
  bilateralTradeWindowContinuity: GTELBilateralTradeWindowContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCommitmentWindowHandoffSnapshot; persisted: GTELPersisted } {
  const continuityAnchor =
    input.admittedForwardCommitmentContinuity.band === 'anchored'
      ? 0.18
      : input.admittedForwardCommitmentContinuity.band === 'holding'
        ? 0.08
        : input.admittedForwardCommitmentContinuity.band === 'slipping'
          ? -0.04
          : -0.11;
  const windowFeed =
    input.bilateralTradeWindowContinuity.band === 'continuous'
      ? 0.15
      : input.bilateralTradeWindowContinuity.band === 'severed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.admittedForwardCommitmentContinuity.score * 0.5 +
      input.bilateralTradeWindowContinuity.score * 0.26 +
      continuityAnchor +
      windowFeed,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCommitmentWindowHandoffSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCommitmentWindowHandoffSmoothing(
    persisted.bilateralCommitmentWindowHandoffSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'handed_off'
      ? 'Bilateral commitment window handoff complete — anchored admissions cleared the next trade window.'
      : band === 'blocked'
        ? 'Window handoff blocked; revoked continuity and severed windows diverged.'
        : band === 'queued'
          ? 'Handoff queued — trade window continuity is lagging anchored admissions.'
          : 'Commitment window handoff is aligning anchored admissions with trade window continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityAnchor: Math.round(continuityAnchor * 1000) / 1000,
      windowFeed: Math.round(windowFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCommitmentWindowHandoffExportScale(
  snapshot: GTELBilateralCommitmentWindowHandoffSnapshot,
): number {
  if (snapshot.band === 'handed_off') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.967 + snapshot.score * 0.006, 0.961, 0.979);
  if (snapshot.band === 'queued') return gtelClamp(0.994 + snapshot.score * 0.001, 0.989, 0.997);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCommitmentWindowHandoffDomesticStressRelief(
  snapshot: GTELBilateralCommitmentWindowHandoffSnapshot,
): number {
  if (snapshot.band === 'handed_off') return gtelClamp(snapshot.score * 0.014, 0.003, 0.018);
  if (snapshot.band === 'aligning') return gtelClamp(snapshot.score * 0.005, 0, 0.006);
  return 0;
}

export function bilateralCommitmentWindowHandoffWorldEvent(
  snapshot: GTELBilateralCommitmentWindowHandoffSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'queued') return null;
  if (snapshot.continuityAnchor > -0.02) return null;
  return {
    id: `gtel_win_handoff_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment window handoff constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NSW'],
  };
}

export function bilateralCommitmentWindowHandoffGiNotes(
  snapshot: GTELBilateralCommitmentWindowHandoffSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral commitment window handoff: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
