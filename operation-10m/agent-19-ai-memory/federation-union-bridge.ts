import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface FederationUnionBridgeReport {
  aligned: boolean;
  unionReady: boolean;
  federationReady: boolean;
  narrativeLines: string[];
}

/** Union-ready should match federation-ready when federation export stack passes. */
export function auditFederationUnionBridge(
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
): FederationUnionBridgeReport {
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const federationReady = matchExplainabilityFederationReady(federation);
  const aligned = unionReady === federationReady;
  const narrativeLines = [
    `Federation/union bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (union ${unionReady ? 'ok' : 'fail'}, federation ${federationReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, unionReady, federationReady, narrativeLines };
}

export function federationUnionBridgeHealthy(report: FederationUnionBridgeReport): boolean {
  return report.unionReady && report.federationReady && report.aligned;
}
