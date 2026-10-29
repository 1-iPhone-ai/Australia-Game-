import {
  buildMatchExplainabilityApexBundle,
  matchExplainabilityApexReady,
} from './match-explainability-apex-bundle.ts';
import {
  buildMatchExplainabilityPinnacleBundle,
  matchExplainabilityPinnacleReady,
} from './match-explainability-pinnacle-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface PinnacleApexBridgeReport {
  aligned: boolean;
  apexReady: boolean;
  pinnacleReady: boolean;
  narrativeLines: string[];
}

/** Apex-ready should match pinnacle-ready when pinnacle export stack passes. */
export function auditPinnacleApexBridge(
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
): PinnacleApexBridgeReport {
  const apex = buildMatchExplainabilityApexBundle(packs, params);
  const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
  const apexReady = matchExplainabilityApexReady(apex);
  const pinnacleReady = matchExplainabilityPinnacleReady(pinnacle);
  const aligned = apexReady === pinnacleReady;
  const narrativeLines = [
    `Pinnacle/apex bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (apex ${apexReady ? 'ok' : 'fail'}, pinnacle ${pinnacleReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, apexReady, pinnacleReady, narrativeLines };
}

export function pinnacleApexBridgeHealthy(report: PinnacleApexBridgeReport): boolean {
  return report.apexReady && report.pinnacleReady && report.aligned;
}
