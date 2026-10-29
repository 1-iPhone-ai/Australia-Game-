import {
  buildMatchExplainabilityPinnacleBundle,
  matchExplainabilityPinnacleReady,
} from './match-explainability-pinnacle-bundle.ts';
import {
  buildSessionPinnacleExportBundle,
  sessionPinnacleExportShipped,
} from './session-pinnacle-export-bundle.ts';
import { auditParamountPinnacleBridge, paramountPinnacleBridgeHealthy } from './paramount-pinnacle-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityApexGateReport {
  apexAllowed: boolean;
  pinnacleReady: boolean;
  pinnacleExportShipped: boolean;
  paramountPinnacleHealthy: boolean;
  narrativeLines: string[];
}

/** Apex gate: pinnacle bundle + pinnacle export + paramount/pinnacle bridge. */
export function auditMatchExplainabilityApexGate(
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
): MatchExplainabilityApexGateReport {
  const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
  const pinnacleExport = buildSessionPinnacleExportBundle(packs, params);
  const bridge = auditParamountPinnacleBridge(packs, params);
  const pinnacleReady = matchExplainabilityPinnacleReady(pinnacle);
  const pinnacleExportShipped = sessionPinnacleExportShipped(pinnacleExport);
  const paramountPinnacleHealthy = paramountPinnacleBridgeHealthy(bridge);
  const apexAllowed = pinnacleReady && pinnacleExportShipped && paramountPinnacleHealthy;
  const narrativeLines = [
    `Match explainability apex: ${apexAllowed ? 'ALLOWED' : 'DENIED'} (pinnacle ${pinnacleReady ? 'ok' : 'fail'}, export ${pinnacleExportShipped ? 'ok' : 'fail'}).`,
    ...pinnacle.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    apexAllowed,
    pinnacleReady,
    pinnacleExportShipped,
    paramountPinnacleHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityApexAllowed(report: MatchExplainabilityApexGateReport): boolean {
  return report.apexAllowed;
}
