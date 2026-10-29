import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface AccordLeagueBridgeReport {
  aligned: boolean;
  leagueReady: boolean;
  accordReady: boolean;
  narrativeLines: string[];
}

/** League-ready should match accord-ready when accord export stack passes. */
export function auditAccordLeagueBridge(
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
): AccordLeagueBridgeReport {
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const accordReady = matchExplainabilityAccordReady(accord);
  const aligned = leagueReady === accordReady;
  const narrativeLines = [
    `Accord/league bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (league ${leagueReady ? 'ok' : 'fail'}, accord ${accordReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, leagueReady, accordReady, narrativeLines };
}

export function accordLeagueBridgeHealthy(report: AccordLeagueBridgeReport): boolean {
  return report.leagueReady && report.accordReady && report.aligned;
}
