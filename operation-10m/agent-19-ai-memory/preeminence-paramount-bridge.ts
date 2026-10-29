import {
  buildMatchExplainabilityParamountBundle,
  matchExplainabilityParamountReady,
} from './match-explainability-paramount-bundle.ts';
import {
  buildMatchExplainabilityPreeminenceBundle,
  matchExplainabilityPreeminenceReady,
} from './match-explainability-preeminence-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface PreeminenceParamountBridgeReport {
  aligned: boolean;
  paramountReady: boolean;
  preeminenceReady: boolean;
  narrativeLines: string[];
}

/** Paramount-ready should match preeminence-ready when preeminence export stack passes. */
export function auditPreeminenceParamountBridge(
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
): PreeminenceParamountBridgeReport {
  const paramount = buildMatchExplainabilityParamountBundle(packs, params);
  const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
  const paramountReady = matchExplainabilityParamountReady(paramount);
  const preeminenceReady = matchExplainabilityPreeminenceReady(preeminence);
  const aligned = paramountReady === preeminenceReady;
  const narrativeLines = [
    `Preeminence/paramount bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (paramount ${paramountReady ? 'ok' : 'fail'}, preeminence ${preeminenceReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, paramountReady, preeminenceReady, narrativeLines };
}

export function preeminenceParamountBridgeHealthy(report: PreeminenceParamountBridgeReport): boolean {
  return report.paramountReady && report.preeminenceReady && report.aligned;
}
