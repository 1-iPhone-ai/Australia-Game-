import {
  buildSessionFederationExportBundle,
  type SessionFederationExportBundle,
} from './session-federation-export-bundle.ts';
import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionUnionExportBundle extends SessionFederationExportBundle {
  unionReady: boolean;
  unionSchema: string;
}

/** Union export wraps federation export when union bundle is ready. */
export function buildSessionUnionExportBundle(
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
): SessionUnionExportBundle {
  const base = buildSessionFederationExportBundle(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const exports = unionReady ? base.exports : [];
  return {
    ...base,
    exports,
    unionReady,
    unionSchema: 'agent19.union.v1',
    releaseReady: unionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Union export: ${unionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionUnionExportShipped(bundle: SessionUnionExportBundle): boolean {
  return (
    bundle.unionReady &&
    bundle.exports.length > 0 &&
    bundle.unionSchema === 'agent19.union.v1'
  );
}
