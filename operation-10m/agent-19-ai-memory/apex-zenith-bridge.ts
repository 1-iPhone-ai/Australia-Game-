import {
  buildMatchExplainabilityZenithBundle,
  matchExplainabilityZenithReady,
} from './match-explainability-zenith-bundle.ts';
import {
  buildMatchExplainabilityApexBundle,
  matchExplainabilityApexReady,
} from './match-explainability-apex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ApexZenithBridgeReport {
  aligned: boolean;
  zenithReady: boolean;
  apexReady: boolean;
  narrativeLines: string[];
}

/** Zenith-ready should match apex-ready when apex export stack passes. */
export function auditApexZenithBridge(
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
): ApexZenithBridgeReport {
  const zenith = buildMatchExplainabilityZenithBundle(packs, params);
  const apex = buildMatchExplainabilityApexBundle(packs, params);
  const zenithReady = matchExplainabilityZenithReady(zenith);
  const apexReady = matchExplainabilityApexReady(apex);
  const aligned = zenithReady === apexReady;
  const narrativeLines = [
    `Apex/zenith bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (zenith ${zenithReady ? 'ok' : 'fail'}, apex ${apexReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, zenithReady, apexReady, narrativeLines };
}

export function apexZenithBridgeHealthy(report: ApexZenithBridgeReport): boolean {
  return report.zenithReady && report.apexReady && report.aligned;
}
