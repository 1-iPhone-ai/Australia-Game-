import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface CharterPactBridgeReport {
  aligned: boolean;
  pactReady: boolean;
  charterReady: boolean;
  narrativeLines: string[];
}

/** Pact-ready should match charter-ready when charter export stack passes. */
export function auditCharterPactBridge(
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
): CharterPactBridgeReport {
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const charterReady = matchExplainabilityCharterReady(charter);
  const aligned = pactReady === charterReady;
  const narrativeLines = [
    `Charter/pact bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (pact ${pactReady ? 'ok' : 'fail'}, charter ${charterReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, pactReady, charterReady, narrativeLines };
}

export function charterPactBridgeHealthy(report: CharterPactBridgeReport): boolean {
  return report.pactReady && report.charterReady && report.aligned;
}
