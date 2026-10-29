import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
import {
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from './session-accord-export-bundle.ts';
import { auditTreatyAccordBridge, treatyAccordBridgeHealthy } from './treaty-accord-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityLeagueGateReport {
  leagueAllowed: boolean;
  accordReady: boolean;
  accordExportShipped: boolean;
  treatyAccordHealthy: boolean;
  narrativeLines: string[];
}

/** League gate: accord bundle + accord export + treaty/accord bridge. */
export function auditMatchExplainabilityLeagueGate(
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
): MatchExplainabilityLeagueGateReport {
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordExport = buildSessionAccordExportBundle(packs, params);
  const bridge = auditTreatyAccordBridge(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const accordExportShipped = sessionAccordExportShipped(accordExport);
  const treatyAccordHealthy = treatyAccordBridgeHealthy(bridge);
  const leagueAllowed = accordReady && accordExportShipped && treatyAccordHealthy;
  const narrativeLines = [
    `Match explainability league: ${leagueAllowed ? 'ALLOWED' : 'DENIED'} (accord ${accordReady ? 'ok' : 'fail'}, export ${accordExportShipped ? 'ok' : 'fail'}).`,
    ...accord.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    leagueAllowed,
    accordReady,
    accordExportShipped,
    treatyAccordHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityLeagueAllowed(report: MatchExplainabilityLeagueGateReport): boolean {
  return report.leagueAllowed;
}
