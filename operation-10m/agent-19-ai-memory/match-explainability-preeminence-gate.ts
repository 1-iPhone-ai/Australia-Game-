import {
  buildMatchExplainabilityAscendancyBundle,
  matchExplainabilityAscendancyReady,
} from './match-explainability-ascendancy-bundle.ts';
import {
  buildSessionAscendancyExportBundle,
  sessionAscendancyExportShipped,
} from './session-ascendancy-export-bundle.ts';
import { auditSupremacyAscendancyBridge, supremacyAscendancyBridgeHealthy } from './supremacy-ascendancy-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityPreeminenceGateReport {
  preeminenceAllowed: boolean;
  ascendancyReady: boolean;
  ascendancyExportShipped: boolean;
  supremacyAscendancyHealthy: boolean;
  narrativeLines: string[];
}

/** Preeminence gate: ascendancy bundle + ascendancy export + supremacy/ascendancy bridge. */
export function auditMatchExplainabilityPreeminenceGate(
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
): MatchExplainabilityPreeminenceGateReport {
  const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
  const ascendancyExport = buildSessionAscendancyExportBundle(packs, params);
  const bridge = auditSupremacyAscendancyBridge(packs, params);
  const ascendancyReady = matchExplainabilityAscendancyReady(ascendancy);
  const ascendancyExportShipped = sessionAscendancyExportShipped(ascendancyExport);
  const supremacyAscendancyHealthy = supremacyAscendancyBridgeHealthy(bridge);
  const preeminenceAllowed = ascendancyReady && ascendancyExportShipped && supremacyAscendancyHealthy;
  const narrativeLines = [
    `Match explainability preeminence: ${preeminenceAllowed ? 'ALLOWED' : 'DENIED'} (ascendancy ${ascendancyReady ? 'ok' : 'fail'}, export ${ascendancyExportShipped ? 'ok' : 'fail'}).`,
    ...ascendancy.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    preeminenceAllowed,
    ascendancyReady,
    ascendancyExportShipped,
    supremacyAscendancyHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityPreeminenceAllowed(report: MatchExplainabilityPreeminenceGateReport): boolean {
  return report.preeminenceAllowed;
}
