import {
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
import {
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SovereignImperialBridgeReport {
  aligned: boolean;
  imperialReady: boolean;
  sovereignReady: boolean;
  narrativeLines: string[];
}

/** Imperial-ready should match sovereign-ready when sovereign export stack passes. */
export function auditSovereignImperialBridge(
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
): SovereignImperialBridgeReport {
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const aligned = imperialReady === sovereignReady;
  const narrativeLines = [
    `Sovereign/imperial bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (imperial ${imperialReady ? 'ok' : 'fail'}, sovereign ${sovereignReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, imperialReady, sovereignReady, narrativeLines };
}

export function sovereignImperialBridgeHealthy(report: SovereignImperialBridgeReport): boolean {
  return report.imperialReady && report.sovereignReady && report.aligned;
}
