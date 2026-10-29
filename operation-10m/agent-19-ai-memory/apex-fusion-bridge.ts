import {
  buildMatchExplainabilityFusionBundle,
  matchExplainabilityFusionReady,
} from './match-explainability-fusion-bundle.ts';
import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-fusion-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ApexFusionBridgeReport {
  aligned: boolean;
  fusionReady: boolean;
  projectionReady: boolean;
  narrativeLines: string[];
}

/** Projection-ready should match projection-ready when fusion export stack passes. */
export function auditApexFusionBridge(
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
): ApexFusionBridgeReport {
  const fusion = buildMatchExplainabilityFusionBundle(packs, params);
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const fusionReady = matchExplainabilityFusionReady(fusion);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const aligned = fusionReady === projectionReady;
  const narrativeLines = [
    `Apex/fusion bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (fusion ${fusionReady ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, fusionReady, projectionReady, narrativeLines };
}

export function apexFusionBridgeHealthy(report: ApexFusionBridgeReport): boolean {
  return report.fusionReady && report.projectionReady && report.aligned;
}
