import {
  buildSessionPactExportBundle,
  type SessionPactExportBundle,
} from './session-pact-export-bundle.ts';
import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionTreatyExportBundle extends SessionPactExportBundle {
  treatyReady: boolean;
  treatySchema: string;
}

/** Treaty export wraps pact export when treaty bundle is ready. */
export function buildSessionTreatyExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionTreatyExportBundle {
  const base = buildSessionPactExportBundle(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const exports = treatyReady ? base.exports : [];
  return {
    ...base,
    exports,
    treatyReady,
    treatySchema: 'agent19.treaty.v1',
    releaseReady: treatyReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Treaty export: ${treatyReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionTreatyExportShipped(bundle: SessionTreatyExportBundle): boolean {
  return (
    bundle.treatyReady &&
    bundle.exports.length > 0 &&
    bundle.treatySchema === 'agent19.treaty.v1'
  );
}
