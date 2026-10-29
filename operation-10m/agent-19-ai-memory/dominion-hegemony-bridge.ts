import {
  buildMatchExplainabilityHegemonyBundle,
  matchExplainabilityHegemonyReady,
} from './match-explainability-hegemony-bundle.ts';
import {
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface DominionHegemonyBridgeReport {
  aligned: boolean;
  hegemonyReady: boolean;
  dominionReady: boolean;
  narrativeLines: string[];
}

/** Hegemony-ready should match dominion-ready when dominion export stack passes. */
export function auditDominionHegemonyBridge(
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
): DominionHegemonyBridgeReport {
  const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const hegemonyReady = matchExplainabilityHegemonyReady(hegemony);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const aligned = hegemonyReady === dominionReady;
  const narrativeLines = [
    `Dominion/hegemony bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (hegemony ${hegemonyReady ? 'ok' : 'fail'}, dominion ${dominionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, hegemonyReady, dominionReady, narrativeLines };
}

export function dominionHegemonyBridgeHealthy(report: DominionHegemonyBridgeReport): boolean {
  return report.hegemonyReady && report.dominionReady && report.aligned;
}
