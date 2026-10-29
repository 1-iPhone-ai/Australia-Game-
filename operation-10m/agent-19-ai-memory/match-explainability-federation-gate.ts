import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
import {
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from './session-league-export-bundle.ts';
import { auditAccordLeagueBridge, accordLeagueBridgeHealthy } from './accord-league-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityFederationGateReport {
  federationAllowed: boolean;
  leagueReady: boolean;
  leagueExportShipped: boolean;
  accordLeagueHealthy: boolean;
  narrativeLines: string[];
}

/** Federation gate: league bundle + league export + accord/league bridge. */
export function auditMatchExplainabilityFederationGate(
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
): MatchExplainabilityFederationGateReport {
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueExport = buildSessionLeagueExportBundle(packs, params);
  const bridge = auditAccordLeagueBridge(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const leagueExportShipped = sessionLeagueExportShipped(leagueExport);
  const accordLeagueHealthy = accordLeagueBridgeHealthy(bridge);
  const federationAllowed = leagueReady && leagueExportShipped && accordLeagueHealthy;
  const narrativeLines = [
    `Match explainability federation: ${federationAllowed ? 'ALLOWED' : 'DENIED'} (league ${leagueReady ? 'ok' : 'fail'}, export ${leagueExportShipped ? 'ok' : 'fail'}).`,
    ...league.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    federationAllowed,
    leagueReady,
    leagueExportShipped,
    accordLeagueHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityFederationAllowed(report: MatchExplainabilityFederationGateReport): boolean {
  return report.federationAllowed;
}
