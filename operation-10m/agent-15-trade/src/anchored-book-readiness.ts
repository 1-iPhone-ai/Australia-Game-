import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELForwardBookAnchorStabilizationSnapshot,
  GTELPersisted,
  GTELTradeSettlementContinuitySnapshot,
  GTELTradeThroughputOrchestrationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELAnchoredBookReadinessBand = GTELAnchoredBookReadinessSnapshot['band'];

function readinessBand(score: number): GTELAnchoredBookReadinessBand {
  if (score >= 0.79) return 'ready';
  if (score >= 0.59) return 'staging';
  if (score >= 0.41) return 'constrained';
  return 'blocked';
}

export function sanitizeAnchoredBookReadinessSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyAnchoredBookReadinessSnapshot(): GTELAnchoredBookReadinessSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    anchorSupport: 0.1,
    continuityLift: 0.08,
    summary: 'Anchored book readiness is staging for the next commitment window.',
  };
}

export function advanceAnchoredBookReadinessSmoothing(persisted: GTELPersisted, rawScore: number): GTELPersisted {
  const prev = sanitizeAnchoredBookReadinessSmoothing(persisted.anchoredBookReadinessSmoothing);
  const next = gtelClamp(prev * 0.62 + gtelClamp(rawScore, 0.16, 0.92) * 0.38, 0.16, 0.92);
  return { ...persisted, anchoredBookReadinessSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeAnchoredBookReadinessSnapshot(input: {
  forwardBookAnchorStabilization: GTELForwardBookAnchorStabilizationSnapshot;
  tradeSettlementContinuity: GTELTradeSettlementContinuitySnapshot;
  tradeThroughputOrchestration: GTELTradeThroughputOrchestrationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELAnchoredBookReadinessSnapshot; persisted: GTELPersisted } {
  const anchorSupport =
    input.forwardBookAnchorStabilization.band === 'locked'
      ? 0.17
      : input.forwardBookAnchorStabilization.band === 'firm'
        ? 0.09
        : input.forwardBookAnchorStabilization.band === 'soft'
          ? -0.04
          : -0.11;
  const continuityLift =
    input.tradeSettlementContinuity.band === 'anchored'
      ? 0.14
      : input.tradeSettlementContinuity.band === 'broken'
        ? -0.1
        : 0.05;
  const orchestrationGate =
    input.tradeThroughputOrchestration.band === 'fluid'
      ? 0.1
      : input.tradeThroughputOrchestration.band === 'stalled'
        ? -0.08
        : 0.03;
  const rawScore = gtelClamp(
    input.forwardBookAnchorStabilization.score * 0.42 +
      input.tradeSettlementContinuity.score * 0.28 +
      input.tradeThroughputOrchestration.score * 0.14 +
      anchorSupport +
      continuityLift +
      orchestrationGate,
    0.16,
    0.92,
  );
  const persisted = advanceAnchoredBookReadinessSmoothing(input.persisted, rawScore);
  const score = sanitizeAnchoredBookReadinessSmoothing(persisted.anchoredBookReadinessSmoothing);
  const band = readinessBand(score);

  const summary =
    band === 'ready'
      ? 'Anchored books are ready — anchors, continuity, and orchestration align for new commitments.'
      : band === 'blocked'
        ? 'Book readiness is blocked; unmoored anchors cannot open the next commitment window.'
        : band === 'constrained'
          ? 'Readiness is constrained — orchestration headroom is limiting new forward slots.'
          : 'Anchored book readiness is staging for the next commitment window.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      anchorSupport: Math.round(anchorSupport * 1000) / 1000,
      continuityLift: Math.round(continuityLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function anchoredBookReadinessExportScale(snapshot: GTELAnchoredBookReadinessSnapshot): number {
  if (snapshot.band === 'ready') return gtelClamp(1 + snapshot.score * 0.015, 1, 1.021);
  if (snapshot.band === 'blocked') return gtelClamp(0.9 + snapshot.score * 0.045, 0.88, 0.94);
  if (snapshot.band === 'constrained') return gtelClamp(0.95 + snapshot.score * 0.03, 0.92, 0.99);
  return gtelClamp(0.97 + snapshot.score * 0.01, 0.94, 1.02);
}

export function anchoredBookReadinessDomesticStress(snapshot: GTELAnchoredBookReadinessSnapshot): number {
  if (snapshot.band === 'blocked') return gtelClamp((0.34 - snapshot.score) * 0.085, 0.015, 0.055);
  if (snapshot.band === 'constrained') return gtelClamp((0.46 - snapshot.score) * 0.05, 0.006, 0.03);
  return 0;
}

export function anchoredBookReadinessWorldEvent(
  snapshot: GTELAnchoredBookReadinessSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'constrained') return null;
  if (snapshot.anchorSupport > -0.03) return null;
  return {
    id: `gtel_book_ready_${turn}`,
    turn,
    kind: 'trade',
    title: 'Anchored book readiness strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function anchoredBookReadinessGiNotes(snapshot: GTELAnchoredBookReadinessSnapshot | null | undefined): string[] {
  if (!snapshot) return [];
  return [
    `Anchored book readiness: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
