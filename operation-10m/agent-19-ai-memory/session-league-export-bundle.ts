import {
  buildSessionAccordExportBundle,
  type SessionAccordExportBundle,
} from './session-accord-export-bundle.ts';
import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionLeagueExportBundle extends SessionAccordExportBundle {
  leagueReady: boolean;
  leagueSchema: string;
}

/** League export wraps accord export when league bundle is ready. */
export function buildSessionLeagueExportBundle(
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
): SessionLeagueExportBundle {
  const base = buildSessionAccordExportBundle(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const exports = leagueReady ? base.exports : [];
  return {
    ...base,
    exports,
    leagueReady,
    leagueSchema: 'agent19.league.v1',
    releaseReady: leagueReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `League export: ${leagueReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionLeagueExportShipped(bundle: SessionLeagueExportBundle): boolean {
  return (
    bundle.leagueReady &&
    bundle.exports.length > 0 &&
    bundle.leagueSchema === 'agent19.league.v1'
  );
}
