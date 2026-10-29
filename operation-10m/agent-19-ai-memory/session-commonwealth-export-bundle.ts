import {
  buildSessionUnionExportBundle,
  type SessionUnionExportBundle,
} from './session-union-export-bundle.ts';
import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionCommonwealthExportBundle extends SessionUnionExportBundle {
  commonwealthReady: boolean;
  commonwealthSchema: string;
}

/** Commonwealth export wraps union export when commonwealth bundle is ready. */
export function buildSessionCommonwealthExportBundle(
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
): SessionCommonwealthExportBundle {
  const base = buildSessionUnionExportBundle(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const exports = commonwealthReady ? base.exports : [];
  return {
    ...base,
    exports,
    commonwealthReady,
    commonwealthSchema: 'agent19.commonwealth.v1',
    releaseReady: commonwealthReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Commonwealth export: ${commonwealthReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCommonwealthExportShipped(bundle: SessionCommonwealthExportBundle): boolean {
  return (
    bundle.commonwealthReady &&
    bundle.exports.length > 0 &&
    bundle.commonwealthSchema === 'agent19.commonwealth.v1'
  );
}
