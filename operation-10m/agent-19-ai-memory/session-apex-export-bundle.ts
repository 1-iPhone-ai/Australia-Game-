import {
  buildSessionPinnacleExportBundle,
  type SessionPinnacleExportBundle,
} from './session-pinnacle-export-bundle.ts';
import {
  buildMatchExplainabilityApexBundle,
  matchExplainabilityApexReady,
} from './match-explainability-apex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionApexExportBundle extends SessionPinnacleExportBundle {
  apexReady: boolean;
  apexSchema: string;
}

/** Apex export wraps pinnacle export when apex bundle is ready. */
export function buildSessionApexExportBundle(
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
): SessionApexExportBundle {
  const base = buildSessionPinnacleExportBundle(packs, params);
  const apex = buildMatchExplainabilityApexBundle(packs, params);
  const apexReady = matchExplainabilityApexReady(apex);
  const exports = apexReady ? base.exports : [];
  return {
    ...base,
    exports,
    apexReady,
    apexSchema: 'agent19.apex.v1',
    releaseReady: apexReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Apex export: ${apexReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionApexExportShipped(bundle: SessionApexExportBundle): boolean {
  return bundle.apexReady && bundle.exports.length > 0 && bundle.apexSchema === 'agent19.apex.v1';
}
