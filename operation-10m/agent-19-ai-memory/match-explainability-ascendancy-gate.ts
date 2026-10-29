import {
  buildMatchExplainabilitySupremacyBundle,
  matchExplainabilitySupremacyReady,
} from './match-explainability-supremacy-bundle.ts';
import {
  buildSessionSupremacyExportBundle,
  sessionSupremacyExportShipped,
} from './session-supremacy-export-bundle.ts';
import { auditHegemonySupremacyBridge, hegemonySupremacyBridgeHealthy } from './hegemony-supremacy-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityAscendancyGateReport {
  ascendancyAllowed: boolean;
  supremacyReady: boolean;
  supremacyExportShipped: boolean;
  hegemonySupremacyHealthy: boolean;
  narrativeLines: string[];
}

/** Ascendancy gate: supremacy bundle + supremacy export + hegemony/supremacy bridge. */
export function auditMatchExplainabilityAscendancyGate(
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
): MatchExplainabilityAscendancyGateReport {
  const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
  const supremacyExport = buildSessionSupremacyExportBundle(packs, params);
  const bridge = auditHegemonySupremacyBridge(packs, params);
  const supremacyReady = matchExplainabilitySupremacyReady(supremacy);
  const supremacyExportShipped = sessionSupremacyExportShipped(supremacyExport);
  const hegemonySupremacyHealthy = hegemonySupremacyBridgeHealthy(bridge);
  const ascendancyAllowed = supremacyReady && supremacyExportShipped && hegemonySupremacyHealthy;
  const narrativeLines = [
    `Match explainability ascendancy: ${ascendancyAllowed ? 'ALLOWED' : 'DENIED'} (supremacy ${supremacyReady ? 'ok' : 'fail'}, export ${supremacyExportShipped ? 'ok' : 'fail'}).`,
    ...supremacy.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    ascendancyAllowed,
    supremacyReady,
    supremacyExportShipped,
    hegemonySupremacyHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAscendancyAllowed(report: MatchExplainabilityAscendancyGateReport): boolean {
  return report.ascendancyAllowed;
}
