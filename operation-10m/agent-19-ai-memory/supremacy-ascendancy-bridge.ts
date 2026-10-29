import {
  buildMatchExplainabilityAscendancyBundle,
  matchExplainabilityAscendancyReady,
} from './match-explainability-ascendancy-bundle.ts';
import {
  buildMatchExplainabilitySupremacyBundle,
  matchExplainabilitySupremacyReady,
} from './match-explainability-supremacy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SupremacyAscendancyBridgeReport {
  aligned: boolean;
  ascendancyReady: boolean;
  supremacyReady: boolean;
  narrativeLines: string[];
}

/** Ascendancy-ready should match supremacy-ready when supremacy export stack passes. */
export function auditSupremacyAscendancyBridge(
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
): SupremacyAscendancyBridgeReport {
  const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
  const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
  const ascendancyReady = matchExplainabilityAscendancyReady(ascendancy);
  const supremacyReady = matchExplainabilitySupremacyReady(supremacy);
  const aligned = ascendancyReady === supremacyReady;
  const narrativeLines = [
    `Supremacy/ascendancy bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (ascendancy ${ascendancyReady ? 'ok' : 'fail'}, supremacy ${supremacyReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, ascendancyReady, supremacyReady, narrativeLines };
}

export function supremacyAscendancyBridgeHealthy(report: SupremacyAscendancyBridgeReport): boolean {
  return report.ascendancyReady && report.supremacyReady && report.aligned;
}
