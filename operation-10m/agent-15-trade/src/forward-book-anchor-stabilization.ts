import type {
  GTELCommitmentLedgerHarmonizationSnapshot,
  GTELForwardBookAnchorStabilizationSnapshot,
  GTELPersisted,
  GTELTradeSettlementContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELForwardBookAnchorStabilizationBand = GTELForwardBookAnchorStabilizationSnapshot['band'];

function anchorBand(score: number): GTELForwardBookAnchorStabilizationBand {
  if (score >= 0.78) return 'locked';
  if (score >= 0.58) return 'firm';
  if (score >= 0.4) return 'soft';
  return 'unmoored';
}

export function sanitizeForwardBookAnchorStabilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyForwardBookAnchorStabilizationSnapshot(): GTELForwardBookAnchorStabilizationSnapshot {
  return {
    score: 0.52,
    band: 'firm',
    continuitySupport: 0.1,
    harmonizationLift: 0.08,
    summary: 'Forward book anchors are firm with settlement continuity support.',
  };
}

export function advanceForwardBookAnchorStabilizationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeForwardBookAnchorStabilizationSmoothing(persisted.forwardBookAnchorStabilizationSmoothing);
  const next = gtelClamp(prev * 0.63 + gtelClamp(rawScore, 0.16, 0.92) * 0.37, 0.16, 0.92);
  return { ...persisted, forwardBookAnchorStabilizationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForwardBookAnchorStabilizationSnapshot(input: {
  tradeSettlementContinuity: GTELTradeSettlementContinuitySnapshot;
  commitmentLedgerHarmonization: GTELCommitmentLedgerHarmonizationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForwardBookAnchorStabilizationSnapshot; persisted: GTELPersisted } {
  const continuitySupport =
    input.tradeSettlementContinuity.band === 'anchored'
      ? 0.16
      : input.tradeSettlementContinuity.band === 'tracking'
        ? 0.08
        : input.tradeSettlementContinuity.band === 'drifting'
          ? -0.05
          : -0.11;
  const harmonizationLift =
    input.commitmentLedgerHarmonization.band === 'aligned'
      ? 0.13
      : input.commitmentLedgerHarmonization.band === 'fractured'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.tradeSettlementContinuity.score * 0.46 +
      input.commitmentLedgerHarmonization.score * 0.28 +
      continuitySupport +
      harmonizationLift +
      (1 - input.tradeSettlementContinuity.settlementCarry) * 0.12,
    0.16,
    0.92,
  );
  const persisted = advanceForwardBookAnchorStabilizationSmoothing(input.persisted, rawScore);
  const score = sanitizeForwardBookAnchorStabilizationSmoothing(persisted.forwardBookAnchorStabilizationSmoothing);
  const band = anchorBand(score);

  const summary =
    band === 'locked'
      ? 'Forward book anchors are locked — continuity and harmonized ledgers hold the next window.'
      : band === 'unmoored'
        ? 'Forward book anchors are unmoored; settlement continuity cannot stabilize the next book.'
        : band === 'soft'
          ? 'Book anchors are soft — harmonization support is fading against carry drift.'
          : 'Forward book anchors are firm with settlement continuity support.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuitySupport: Math.round(continuitySupport * 1000) / 1000,
      harmonizationLift: Math.round(harmonizationLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function forwardBookAnchorStabilizationExportScale(
  snapshot: GTELForwardBookAnchorStabilizationSnapshot,
): number {
  if (snapshot.band === 'locked') return gtelClamp(1 + snapshot.score * 0.016, 1, 1.022);
  if (snapshot.band === 'unmoored') return gtelClamp(0.89 + snapshot.score * 0.048, 0.87, 0.94);
  if (snapshot.band === 'soft') return gtelClamp(0.95 + snapshot.score * 0.032, 0.92, 0.99);
  return gtelClamp(0.97 + snapshot.score * 0.011, 0.94, 1.02);
}

export function forwardBookAnchorStabilizationDomesticStressRelief(
  snapshot: GTELForwardBookAnchorStabilizationSnapshot,
): number {
  if (snapshot.band === 'locked') return gtelClamp(snapshot.score * 0.028, 0.01, 0.034);
  if (snapshot.band === 'firm') return gtelClamp(snapshot.score * 0.015, 0, 0.017);
  return 0;
}

export function forwardBookAnchorStabilizationWorldEvent(
  snapshot: GTELForwardBookAnchorStabilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'unmoored' && snapshot.band !== 'soft') return null;
  if (snapshot.continuitySupport > -0.02) return null;
  return {
    id: `gtel_book_anchor_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward book anchor instability',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function forwardBookAnchorStabilizationGiNotes(
  snapshot: GTELForwardBookAnchorStabilizationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Forward book anchor stabilization: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
