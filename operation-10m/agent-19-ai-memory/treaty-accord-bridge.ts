import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface TreatyAccordBridgeReport {
  aligned: boolean;
  accordReady: boolean;
  treatyReady: boolean;
  narrativeLines: string[];
}

/** Accord-ready should match treaty-ready when treaty export stack passes. */
export function auditTreatyAccordBridge(
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
): TreatyAccordBridgeReport {
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const aligned = accordReady === treatyReady;
  const narrativeLines = [
    `Treaty/accord bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (accord ${accordReady ? 'ok' : 'fail'}, treaty ${treatyReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, accordReady, treatyReady, narrativeLines };
}

export function treatyAccordBridgeHealthy(report: TreatyAccordBridgeReport): boolean {
  return report.accordReady && report.treatyReady && report.aligned;
}
