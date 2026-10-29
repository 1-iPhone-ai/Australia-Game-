import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
import {
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from './session-federation-export-bundle.ts';
import { auditLeagueFederationBridge, leagueFederationBridgeHealthy } from './league-federation-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityUnionGateReport {
  unionAllowed: boolean;
  federationReady: boolean;
  federationExportShipped: boolean;
  leagueFederationHealthy: boolean;
  narrativeLines: string[];
}

/** Union gate: federation bundle + federation export + league/federation bridge. */
export function auditMatchExplainabilityUnionGate(
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
): MatchExplainabilityUnionGateReport {
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationExport = buildSessionFederationExportBundle(packs, params);
  const bridge = auditLeagueFederationBridge(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const federationExportShipped = sessionFederationExportShipped(federationExport);
  const leagueFederationHealthy = leagueFederationBridgeHealthy(bridge);
  const unionAllowed = federationReady && federationExportShipped && leagueFederationHealthy;
  const narrativeLines = [
    `Match explainability union: ${unionAllowed ? 'ALLOWED' : 'DENIED'} (federation ${federationReady ? 'ok' : 'fail'}, export ${federationExportShipped ? 'ok' : 'fail'}).`,
    ...federation.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    unionAllowed,
    federationReady,
    federationExportShipped,
    leagueFederationHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityUnionAllowed(report: MatchExplainabilityUnionGateReport): boolean {
  return report.unionAllowed;
}
