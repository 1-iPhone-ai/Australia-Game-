import {
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
import {
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ImperialDominionBridgeReport {
  aligned: boolean;
  dominionReady: boolean;
  imperialReady: boolean;
  narrativeLines: string[];
}

/** Dominion-ready should match imperial-ready when imperial export stack passes. */
export function auditImperialDominionBridge(
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
): ImperialDominionBridgeReport {
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const aligned = dominionReady === imperialReady;
  const narrativeLines = [
    `Imperial/dominion bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (dominion ${dominionReady ? 'ok' : 'fail'}, imperial ${imperialReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, dominionReady, imperialReady, narrativeLines };
}

export function imperialDominionBridgeHealthy(report: ImperialDominionBridgeReport): boolean {
  return report.dominionReady && report.imperialReady && report.aligned;
}
