import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_DEBUG_EXPORT_NARRATIVE_CAP = 20;

/** Bounded, JSON-safe snapshot for dashboards / replay tooling (no full memory graph). */
export function buildExplainabilityDebugExport(pack: TurnExplainabilityPack): Record<string, unknown> {
  return {
    schema: 'agent19.explainability.v1',
    turn: pack.turn,
    horizon: {
      beforeEvents: pack.horizonBefore.shortTermEventCount,
      afterEvents: pack.horizonAfter.shortTermEventCount,
      priorActive: pack.horizonAfter.longTermPriorActive,
    },
    influence: {
      influenced: pack.influenceSummary.influencedDecisionCount,
      totalDelta: pack.influenceSummary.totalInfluenceDelta,
      auditOk: pack.influenceSummary.auditOk,
    },
    topSlices: pack.topSlices.slice(0, 5).map(s => ({
      horizon: s.horizon,
      delta: s.delta,
      reason: s.reason,
    })),
    narrative: pack.narrativeLines.slice(0, AGENT19_DEBUG_EXPORT_NARRATIVE_CAP),
    horizonDiff: pack.horizonDiffLines.slice(0, 8),
  };
}

export function explainabilityDebugExportWithinCap(exportObj: Record<string, unknown>): boolean {
  const narrative = exportObj.narrative;
  return Array.isArray(narrative) && narrative.length <= AGENT19_DEBUG_EXPORT_NARRATIVE_CAP;
}
