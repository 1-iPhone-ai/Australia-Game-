import {
  buildMatchExplainabilitySummitBundle,
  matchExplainabilitySummitReady,
} from './match-explainability-summit-bundle.ts';
import {
  buildMatchExplainabilityZenithBundle,
  matchExplainabilityZenithReady,
} from './match-explainability-zenith-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ZenithSummitBridgeReport {
  aligned: boolean;
  summitReady: boolean;
  zenithReady: boolean;
  narrativeLines: string[];
}

/** Summit-ready should match zenith-ready when zenith export stack passes. */
export function auditZenithSummitBridge(
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
): ZenithSummitBridgeReport {
  const summit = buildMatchExplainabilitySummitBundle(packs, params);
  const zenith = buildMatchExplainabilityZenithBundle(packs, params);
  const summitReady = matchExplainabilitySummitReady(summit);
  const zenithReady = matchExplainabilityZenithReady(zenith);
  const aligned = summitReady === zenithReady;
  const narrativeLines = [
    `Zenith/summit bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (summit ${summitReady ? 'ok' : 'fail'}, zenith ${zenithReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, summitReady, zenithReady, narrativeLines };
}

export function zenithSummitBridgeHealthy(report: ZenithSummitBridgeReport): boolean {
  return report.summitReady && report.zenithReady && report.aligned;
}
