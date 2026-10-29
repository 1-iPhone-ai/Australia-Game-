import { buildNegotiationSessionRollup, negotiationSessionMostlyAligned } from './negotiation-session-rollup.ts';
import { buildSessionExportBundle } from './session-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface NegotiationExportBridgeReport {
  includeNegotiationNotes: boolean;
  exportTurnCount: number;
  alignedTurns: number;
  narrativeLines: string[];
}

/** Adds negotiation rollup metadata to export bundle eligibility. */
export function auditNegotiationExportBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    relationship: Partial<AiRelationship> | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): NegotiationExportBridgeReport {
  const negotiation = buildNegotiationSessionRollup(packs, {
    relationship: params.relationship,
    decisionsByTurn: params.decisionsByTurn.map(d => ({ after: d.after })),
  });
  const exportBundle = buildSessionExportBundle(packs, params);
  const includeNegotiationNotes =
    negotiationSessionMostlyAligned(negotiation) && exportBundle.exports.length > 0;
  const narrativeLines = [
    `Negotiation export bridge: notes ${includeNegotiationNotes ? 'included' : 'withheld'} (${negotiation.alignedTurns}/${negotiation.turnCount} aligned).`,
    ...negotiation.narrativeLines,
    ...exportBundle.narrativeLines.slice(0, 1),
  ];
  return {
    includeNegotiationNotes,
    exportTurnCount: exportBundle.exports.length,
    alignedTurns: negotiation.alignedTurns,
    narrativeLines,
  };
}

export function negotiationExportNotesIncluded(report: NegotiationExportBridgeReport): boolean {
  return report.includeNegotiationNotes;
}
