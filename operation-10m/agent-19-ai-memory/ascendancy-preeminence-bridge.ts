import {
  buildMatchExplainabilityPreeminenceBundle,
  matchExplainabilityPreeminenceReady,
} from './match-explainability-preeminence-bundle.ts';
import {
  buildMatchExplainabilityAscendancyBundle,
  matchExplainabilityAscendancyReady,
} from './match-explainability-ascendancy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface AscendancyPreeminenceBridgeReport {
  aligned: boolean;
  preeminenceReady: boolean;
  ascendancyReady: boolean;
  narrativeLines: string[];
}

/** Preeminence-ready should match ascendancy-ready when ascendancy export stack passes. */
export function auditAscendancyPreeminenceBridge(
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
): AscendancyPreeminenceBridgeReport {
  const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
  const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
  const preeminenceReady = matchExplainabilityPreeminenceReady(preeminence);
  const ascendancyReady = matchExplainabilityAscendancyReady(ascendancy);
  const aligned = preeminenceReady === ascendancyReady;
  const narrativeLines = [
    `Ascendancy/preeminence bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (preeminence ${preeminenceReady ? 'ok' : 'fail'}, ascendancy ${ascendancyReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, preeminenceReady, ascendancyReady, narrativeLines };
}

export function ascendancyPreeminenceBridgeHealthy(report: AscendancyPreeminenceBridgeReport): boolean {
  return report.preeminenceReady && report.ascendancyReady && report.aligned;
}
