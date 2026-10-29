import {
  buildSessionParamountExportBundle,
  type SessionParamountExportBundle,
} from './session-paramount-export-bundle.ts';
import {
  buildMatchExplainabilityPinnacleBundle,
  matchExplainabilityPinnacleReady,
} from './match-explainability-pinnacle-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionPinnacleExportBundle extends SessionParamountExportBundle {
  pinnacleReady: boolean;
  pinnacleSchema: string;
}

/** Pinnacle export wraps paramount export when pinnacle bundle is ready. */
export function buildSessionPinnacleExportBundle(
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
): SessionPinnacleExportBundle {
  const base = buildSessionParamountExportBundle(packs, params);
  const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
  const pinnacleReady = matchExplainabilityPinnacleReady(pinnacle);
  const exports = pinnacleReady ? base.exports : [];
  return {
    ...base,
    exports,
    pinnacleReady,
    pinnacleSchema: 'agent19.pinnacle.v1',
    releaseReady: pinnacleReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Pinnacle export: ${pinnacleReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionPinnacleExportShipped(bundle: SessionPinnacleExportBundle): boolean {
  return (
    bundle.pinnacleReady &&
    bundle.exports.length > 0 &&
    bundle.pinnacleSchema === 'agent19.pinnacle.v1'
  );
}
