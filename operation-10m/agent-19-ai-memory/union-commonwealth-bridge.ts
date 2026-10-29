import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface UnionCommonwealthBridgeReport {
  aligned: boolean;
  commonwealthReady: boolean;
  unionReady: boolean;
  narrativeLines: string[];
}

/** Commonwealth-ready should match union-ready when union export stack passes. */
export function auditUnionCommonwealthBridge(
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
): UnionCommonwealthBridgeReport {
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const unionReady = matchExplainabilityUnionReady(union);
  const aligned = commonwealthReady === unionReady;
  const narrativeLines = [
    `Union/commonwealth bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (commonwealth ${commonwealthReady ? 'ok' : 'fail'}, union ${unionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, commonwealthReady, unionReady, narrativeLines };
}

export function unionCommonwealthBridgeHealthy(report: UnionCommonwealthBridgeReport): boolean {
  return report.commonwealthReady && report.unionReady && report.aligned;
}
