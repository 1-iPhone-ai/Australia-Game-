import {
  buildSessionSovereignExportBundle,
  type SessionSovereignExportBundle,
} from './session-sovereign-export-bundle.ts';
import {
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionImperialExportBundle extends SessionSovereignExportBundle {
  imperialReady: boolean;
  imperialSchema: string;
}

/** Imperial export wraps sovereign export when imperial bundle is ready. */
export function buildSessionImperialExportBundle(
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
): SessionImperialExportBundle {
  const base = buildSessionSovereignExportBundle(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const exports = imperialReady ? base.exports : [];
  return {
    ...base,
    exports,
    imperialReady,
    imperialSchema: 'agent19.imperial.v1',
    releaseReady: imperialReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Imperial export: ${imperialReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionImperialExportShipped(bundle: SessionImperialExportBundle): boolean {
  return (
    bundle.imperialReady &&
    bundle.exports.length > 0 &&
    bundle.imperialSchema === 'agent19.imperial.v1'
  );
}
