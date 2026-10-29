import {
  buildSessionPreeminenceExportBundle,
  type SessionPreeminenceExportBundle,
} from './session-preeminence-export-bundle.ts';
import {
  buildMatchExplainabilityParamountBundle,
  matchExplainabilityParamountReady,
} from './match-explainability-paramount-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionParamountExportBundle extends SessionPreeminenceExportBundle {
  paramountReady: boolean;
  paramountSchema: string;
}

/** Paramount export wraps preeminence export when paramount bundle is ready. */
export function buildSessionParamountExportBundle(
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
): SessionParamountExportBundle {
  const base = buildSessionPreeminenceExportBundle(packs, params);
  const paramount = buildMatchExplainabilityParamountBundle(packs, params);
  const paramountReady = matchExplainabilityParamountReady(paramount);
  const exports = paramountReady ? base.exports : [];
  return {
    ...base,
    exports,
    paramountReady,
    paramountSchema: 'agent19.paramount.v1',
    releaseReady: paramountReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Paramount export: ${paramountReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionParamountExportShipped(bundle: SessionParamountExportBundle): boolean {
  return (
    bundle.paramountReady &&
    bundle.exports.length > 0 &&
    bundle.paramountSchema === 'agent19.paramount.v1'
  );
}
