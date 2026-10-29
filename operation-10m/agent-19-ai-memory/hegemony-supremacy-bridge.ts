import {
  buildMatchExplainabilitySupremacyBundle,
  matchExplainabilitySupremacyReady,
} from './match-explainability-supremacy-bundle.ts';
import {
  buildMatchExplainabilityHegemonyBundle,
  matchExplainabilityHegemonyReady,
} from './match-explainability-hegemony-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface HegemonySupremacyBridgeReport {
  aligned: boolean;
  supremacyReady: boolean;
  hegemonyReady: boolean;
  narrativeLines: string[];
}

/** Supremacy-ready should match hegemony-ready when hegemony export stack passes. */
export function auditHegemonySupremacyBridge(
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
): HegemonySupremacyBridgeReport {
  const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
  const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
  const supremacyReady = matchExplainabilitySupremacyReady(supremacy);
  const hegemonyReady = matchExplainabilityHegemonyReady(hegemony);
  const aligned = supremacyReady === hegemonyReady;
  const narrativeLines = [
    `Hegemony/supremacy bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (supremacy ${supremacyReady ? 'ok' : 'fail'}, hegemony ${hegemonyReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, supremacyReady, hegemonyReady, narrativeLines };
}

export function hegemonySupremacyBridgeHealthy(report: HegemonySupremacyBridgeReport): boolean {
  return report.supremacyReady && report.hegemonyReady && report.aligned;
}
