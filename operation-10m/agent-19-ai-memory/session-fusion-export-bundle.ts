import {
  buildSessionNexusExportBundle,
  type SessionNexusExportBundle,
} from './session-nexus-export-bundle.ts';
import {
  buildMatchExplainabilityFusionBundle,
  matchExplainabilityFusionReady,
} from './match-explainability-fusion-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionFusionExportBundle extends SessionNexusExportBundle {
  fusionReady: boolean;
  fusionSchema: string;
}

/** Fusion export wraps nexus export when fusion bundle is ready. */
export function buildSessionFusionExportBundle(
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
): SessionFusionExportBundle {
  const base = buildSessionNexusExportBundle(packs, params);
  const fusion = buildMatchExplainabilityFusionBundle(packs, params);
  const fusionReady = matchExplainabilityFusionReady(fusion);
  const exports = fusionReady ? base.exports : [];
  return {
    ...base,
    exports,
    fusionReady,
    fusionSchema: 'agent19.fusion.v1',
    releaseReady: fusionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Fusion export: ${fusionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionFusionExportShipped(bundle: SessionFusionExportBundle): boolean {
  return bundle.fusionReady && bundle.exports.length > 0 && bundle.fusionSchema === 'agent19.fusion.v1';
}
