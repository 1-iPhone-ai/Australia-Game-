import {
  buildMatchExplainabilityPinnacleBundle,
  matchExplainabilityPinnacleReady,
} from './match-explainability-pinnacle-bundle.ts';
import {
  buildMatchExplainabilityParamountBundle,
  matchExplainabilityParamountReady,
} from './match-explainability-paramount-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ParamountPinnacleBridgeReport {
  aligned: boolean;
  pinnacleReady: boolean;
  paramountReady: boolean;
  narrativeLines: string[];
}

/** Pinnacle-ready should match paramount-ready when paramount export stack passes. */
export function auditParamountPinnacleBridge(
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
): ParamountPinnacleBridgeReport {
  const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
  const paramount = buildMatchExplainabilityParamountBundle(packs, params);
  const pinnacleReady = matchExplainabilityPinnacleReady(pinnacle);
  const paramountReady = matchExplainabilityParamountReady(paramount);
  const aligned = pinnacleReady === paramountReady;
  const narrativeLines = [
    `Paramount/pinnacle bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (pinnacle ${pinnacleReady ? 'ok' : 'fail'}, paramount ${paramountReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, pinnacleReady, paramountReady, narrativeLines };
}

export function paramountPinnacleBridgeHealthy(report: ParamountPinnacleBridgeReport): boolean {
  return report.pinnacleReady && report.paramountReady && report.aligned;
}
