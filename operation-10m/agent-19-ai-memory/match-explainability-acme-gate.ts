import {
  buildMatchExplainabilitySummitBundle,
  matchExplainabilitySummitReady,
} from './match-explainability-summit-bundle.ts';
import {
  buildSessionSummitExportBundle,
  sessionSummitExportShipped,
} from './session-summit-export-bundle.ts';
import { auditZenithSummitBridge, zenithSummitBridgeHealthy } from './zenith-summit-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityAcmeGateReport {
  acmeAllowed: boolean;
  summitReady: boolean;
  summitExportShipped: boolean;
  zenithSummitHealthy: boolean;
  narrativeLines: string[];
}

/** Acme gate: summit bundle + summit export + zenith/summit bridge. */
export function auditMatchExplainabilityAcmeGate(
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
): MatchExplainabilityAcmeGateReport {
  const summit = buildMatchExplainabilitySummitBundle(packs, params);
  const summitExport = buildSessionSummitExportBundle(packs, params);
  const bridge = auditZenithSummitBridge(packs, params);
  const summitReady = matchExplainabilitySummitReady(summit);
  const summitExportShipped = sessionSummitExportShipped(summitExport);
  const zenithSummitHealthy = zenithSummitBridgeHealthy(bridge);
  const acmeAllowed = summitReady && summitExportShipped && zenithSummitHealthy;
  const narrativeLines = [
    `Match explainability acme: ${acmeAllowed ? 'ALLOWED' : 'DENIED'} (summit ${summitReady ? 'ok' : 'fail'}, export ${summitExportShipped ? 'ok' : 'fail'}).`,
    ...summit.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    acmeAllowed,
    summitReady,
    summitExportShipped,
    zenithSummitHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAcmeAllowed(report: MatchExplainabilityAcmeGateReport): boolean {
  return report.acmeAllowed;
}
