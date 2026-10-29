import {
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from './match-explainability-federation-gate.ts';
import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
import {
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from './session-league-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_FEDERATION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityFederationBundle {
  federationReady: boolean;
  federationAllowed: boolean;
  leagueReady: boolean;
  leagueExportShipped: boolean;
  narrativeLines: string[];
}

type FederationParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Federation bundle: federation gate and league export must both be green. */
export function buildMatchExplainabilityFederationBundle(
  packs: TurnExplainabilityPack[],
  params: FederationParams,
): MatchExplainabilityFederationBundle {
  const federation = auditMatchExplainabilityFederationGate(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueExport = buildSessionLeagueExportBundle(packs, params);
  const federationAllowed = matchExplainabilityFederationAllowed(federation);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const leagueExportShipped = sessionLeagueExportShipped(leagueExport);
  const federationReady = federationAllowed && leagueReady && leagueExportShipped;
  const narrativeLines = [
    `Match explainability federation bundle: ${federationReady ? 'READY' : 'PENDING'} (gate ${federationAllowed ? 'ok' : 'fail'}, league ${leagueReady ? 'ok' : 'fail'}).`,
    ...federation.narrativeLines.slice(0, 2),
    ...league.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_FEDERATION_NARRATIVE_CAP);
  return {
    federationReady,
    federationAllowed,
    leagueReady,
    leagueExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityFederationReady(bundle: MatchExplainabilityFederationBundle): boolean {
  return bundle.federationReady;
}
