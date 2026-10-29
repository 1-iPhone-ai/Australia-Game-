import {
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from './match-explainability-league-gate.ts';
import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
import {
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from './session-accord-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_LEAGUE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityLeagueBundle {
  leagueReady: boolean;
  leagueAllowed: boolean;
  accordReady: boolean;
  accordExportShipped: boolean;
  narrativeLines: string[];
}

type LeagueParams = {
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

/** League bundle: league gate and accord export must both be green. */
export function buildMatchExplainabilityLeagueBundle(
  packs: TurnExplainabilityPack[],
  params: LeagueParams,
): MatchExplainabilityLeagueBundle {
  const league = auditMatchExplainabilityLeagueGate(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordExport = buildSessionAccordExportBundle(packs, params);
  const leagueAllowed = matchExplainabilityLeagueAllowed(league);
  const accordReady = matchExplainabilityAccordReady(accord);
  const accordExportShipped = sessionAccordExportShipped(accordExport);
  const leagueReady = leagueAllowed && accordReady && accordExportShipped;
  const narrativeLines = [
    `Match explainability league bundle: ${leagueReady ? 'READY' : 'PENDING'} (gate ${leagueAllowed ? 'ok' : 'fail'}, accord ${accordReady ? 'ok' : 'fail'}).`,
    ...league.narrativeLines.slice(0, 2),
    ...accord.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_LEAGUE_NARRATIVE_CAP);
  return {
    leagueReady,
    leagueAllowed,
    accordReady,
    accordExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityLeagueReady(bundle: MatchExplainabilityLeagueBundle): boolean {
  return bundle.leagueReady;
}
