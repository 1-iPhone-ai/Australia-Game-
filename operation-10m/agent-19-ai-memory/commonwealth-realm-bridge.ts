import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface CommonwealthRealmBridgeReport {
  aligned: boolean;
  realmReady: boolean;
  commonwealthReady: boolean;
  narrativeLines: string[];
}

/** Realm-ready should match commonwealth-ready when commonwealth export stack passes. */
export function auditCommonwealthRealmBridge(
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
): CommonwealthRealmBridgeReport {
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const aligned = realmReady === commonwealthReady;
  const narrativeLines = [
    `Commonwealth/realm bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (realm ${realmReady ? 'ok' : 'fail'}, commonwealth ${commonwealthReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, realmReady, commonwealthReady, narrativeLines };
}

export function commonwealthRealmBridgeHealthy(report: CommonwealthRealmBridgeReport): boolean {
  return report.realmReady && report.commonwealthReady && report.aligned;
}
