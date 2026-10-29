import {
  buildMatchExplainabilityParamountBundle,
  matchExplainabilityParamountReady,
} from './match-explainability-paramount-bundle.ts';
import {
  buildSessionParamountExportBundle,
  sessionParamountExportShipped,
} from './session-paramount-export-bundle.ts';
import { auditPreeminenceParamountBridge, preeminenceParamountBridgeHealthy } from './preeminence-paramount-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityPinnacleGateReport {
  pinnacleAllowed: boolean;
  paramountReady: boolean;
  paramountExportShipped: boolean;
  preeminenceParamountHealthy: boolean;
  narrativeLines: string[];
}

/** Pinnacle gate: paramount bundle + paramount export + preeminence/paramount bridge. */
export function auditMatchExplainabilityPinnacleGate(
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
): MatchExplainabilityPinnacleGateReport {
  const paramount = buildMatchExplainabilityParamountBundle(packs, params);
  const paramountExport = buildSessionParamountExportBundle(packs, params);
  const bridge = auditPreeminenceParamountBridge(packs, params);
  const paramountReady = matchExplainabilityParamountReady(paramount);
  const paramountExportShipped = sessionParamountExportShipped(paramountExport);
  const preeminenceParamountHealthy = preeminenceParamountBridgeHealthy(bridge);
  const pinnacleAllowed = paramountReady && paramountExportShipped && preeminenceParamountHealthy;
  const narrativeLines = [
    `Match explainability pinnacle: ${pinnacleAllowed ? 'ALLOWED' : 'DENIED'} (paramount ${paramountReady ? 'ok' : 'fail'}, export ${paramountExportShipped ? 'ok' : 'fail'}).`,
    ...paramount.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    pinnacleAllowed,
    paramountReady,
    paramountExportShipped,
    preeminenceParamountHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityPinnacleAllowed(report: MatchExplainabilityPinnacleGateReport): boolean {
  return report.pinnacleAllowed;
}
