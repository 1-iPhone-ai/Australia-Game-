import {
  buildMatchExplainabilityPreeminenceBundle,
  matchExplainabilityPreeminenceReady,
} from './match-explainability-preeminence-bundle.ts';
import {
  buildSessionPreeminenceExportBundle,
  sessionPreeminenceExportShipped,
} from './session-preeminence-export-bundle.ts';
import { auditAscendancyPreeminenceBridge, ascendancyPreeminenceBridgeHealthy } from './ascendancy-preeminence-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityParamountGateReport {
  paramountAllowed: boolean;
  preeminenceReady: boolean;
  preeminenceExportShipped: boolean;
  ascendancyPreeminenceHealthy: boolean;
  narrativeLines: string[];
}

/** Paramount gate: preeminence bundle + preeminence export + ascendancy/preeminence bridge. */
export function auditMatchExplainabilityParamountGate(
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
): MatchExplainabilityParamountGateReport {
  const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
  const preeminenceExport = buildSessionPreeminenceExportBundle(packs, params);
  const bridge = auditAscendancyPreeminenceBridge(packs, params);
  const preeminenceReady = matchExplainabilityPreeminenceReady(preeminence);
  const preeminenceExportShipped = sessionPreeminenceExportShipped(preeminenceExport);
  const ascendancyPreeminenceHealthy = ascendancyPreeminenceBridgeHealthy(bridge);
  const paramountAllowed = preeminenceReady && preeminenceExportShipped && ascendancyPreeminenceHealthy;
  const narrativeLines = [
    `Match explainability paramount: ${paramountAllowed ? 'ALLOWED' : 'DENIED'} (preeminence ${preeminenceReady ? 'ok' : 'fail'}, export ${preeminenceExportShipped ? 'ok' : 'fail'}).`,
    ...preeminence.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    paramountAllowed,
    preeminenceReady,
    preeminenceExportShipped,
    ascendancyPreeminenceHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityParamountAllowed(report: MatchExplainabilityParamountGateReport): boolean {
  return report.paramountAllowed;
}
