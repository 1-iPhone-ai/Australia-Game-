import {
  buildMatchExplainabilitySynthesisBundle,
  matchExplainabilitySynthesisReady,
} from './match-explainability-synthesis-bundle.ts';
import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-synthesis-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ResonanceSynthesisBridgeReport {
  aligned: boolean;
  synthesisReady: boolean;
  projectionReady: boolean;
  narrativeLines: string[];
}

/** Projection-ready should match projection-ready when synthesis export stack passes. */
export function auditResonanceSynthesisBridge(
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
): ResonanceSynthesisBridgeReport {
  const synthesis = buildMatchExplainabilitySynthesisBundle(packs, params);
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const synthesisReady = matchExplainabilitySynthesisReady(synthesis);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const aligned = synthesisReady === projectionReady;
  const narrativeLines = [
    `Resonance/synthesis bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (synthesis ${synthesisReady ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, synthesisReady, projectionReady, narrativeLines };
}

export function resonanceSynthesisBridgeHealthy(report: ResonanceSynthesisBridgeReport): boolean {
  return report.synthesisReady && report.projectionReady && report.aligned;
}
