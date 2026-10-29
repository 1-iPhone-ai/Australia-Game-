import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface PactTreatyBridgeReport {
  aligned: boolean;
  treatyReady: boolean;
  pactReady: boolean;
  narrativeLines: string[];
}

/** Treaty-ready should match pact-ready when pact export stack passes. */
export function auditPactTreatyBridge(
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
): PactTreatyBridgeReport {
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const pactReady = matchExplainabilityPactReady(pact);
  const aligned = treatyReady === pactReady;
  const narrativeLines = [
    `Pact/treaty bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (treaty ${treatyReady ? 'ok' : 'fail'}, pact ${pactReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, treatyReady, pactReady, narrativeLines };
}

export function pactTreatyBridgeHealthy(report: PactTreatyBridgeReport): boolean {
  return report.treatyReady && report.pactReady && report.aligned;
}
