import {
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface RealmSovereignBridgeReport {
  aligned: boolean;
  sovereignReady: boolean;
  realmReady: boolean;
  narrativeLines: string[];
}

/** Sovereign-ready should match realm-ready when realm export stack passes. */
export function auditRealmSovereignBridge(
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
): RealmSovereignBridgeReport {
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const realmReady = matchExplainabilityRealmReady(realm);
  const aligned = sovereignReady === realmReady;
  const narrativeLines = [
    `Realm/sovereign bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (sovereign ${sovereignReady ? 'ok' : 'fail'}, realm ${realmReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, sovereignReady, realmReady, narrativeLines };
}

export function realmSovereignBridgeHealthy(report: RealmSovereignBridgeReport): boolean {
  return report.sovereignReady && report.realmReady && report.aligned;
}
