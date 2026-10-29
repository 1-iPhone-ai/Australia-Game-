import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface LeagueFederationBridgeReport {
  aligned: boolean;
  federationReady: boolean;
  leagueReady: boolean;
  narrativeLines: string[];
}

/** Federation-ready should match league-ready when league export stack passes. */
export function auditLeagueFederationBridge(
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
): LeagueFederationBridgeReport {
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const aligned = federationReady === leagueReady;
  const narrativeLines = [
    `League/federation bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (federation ${federationReady ? 'ok' : 'fail'}, league ${leagueReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, federationReady, leagueReady, narrativeLines };
}

export function leagueFederationBridgeHealthy(report: LeagueFederationBridgeReport): boolean {
  return report.federationReady && report.leagueReady && report.aligned;
}
