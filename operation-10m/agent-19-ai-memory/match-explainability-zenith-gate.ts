import {
  buildMatchExplainabilityApexBundle,
  matchExplainabilityApexReady,
} from './match-explainability-apex-bundle.ts';
import {
  buildSessionApexExportBundle,
  sessionApexExportShipped,
} from './session-apex-export-bundle.ts';
import { auditPinnacleApexBridge, pinnacleApexBridgeHealthy } from './pinnacle-apex-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityZenithGateReport {
  zenithAllowed: boolean;
  apexReady: boolean;
  apexExportShipped: boolean;
  pinnacleApexHealthy: boolean;
  narrativeLines: string[];
}

/** Zenith gate: apex bundle + apex export + pinnacle/apex bridge. */
export function auditMatchExplainabilityZenithGate(
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
): MatchExplainabilityZenithGateReport {
  const apex = buildMatchExplainabilityApexBundle(packs, params);
  const apexExport = buildSessionApexExportBundle(packs, params);
  const bridge = auditPinnacleApexBridge(packs, params);
  const apexReady = matchExplainabilityApexReady(apex);
  const apexExportShipped = sessionApexExportShipped(apexExport);
  const pinnacleApexHealthy = pinnacleApexBridgeHealthy(bridge);
  const zenithAllowed = apexReady && apexExportShipped && pinnacleApexHealthy;
  const narrativeLines = [
    `Match explainability zenith: ${zenithAllowed ? 'ALLOWED' : 'DENIED'} (apex ${apexReady ? 'ok' : 'fail'}, export ${apexExportShipped ? 'ok' : 'fail'}).`,
    ...apex.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    zenithAllowed,
    apexReady,
    apexExportShipped,
    pinnacleApexHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityZenithAllowed(report: MatchExplainabilityZenithGateReport): boolean {
  return report.zenithAllowed;
}
