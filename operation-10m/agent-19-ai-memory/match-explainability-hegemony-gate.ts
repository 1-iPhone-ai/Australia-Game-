import {
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
import {
  buildSessionDominionExportBundle,
  sessionDominionExportShipped,
} from './session-dominion-export-bundle.ts';
import { auditImperialDominionBridge, imperialDominionBridgeHealthy } from './imperial-dominion-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityHegemonyGateReport {
  hegemonyAllowed: boolean;
  dominionReady: boolean;
  dominionExportShipped: boolean;
  imperialDominionHealthy: boolean;
  narrativeLines: string[];
}

/** Hegemony gate: dominion bundle + dominion export + imperial/dominion bridge. */
export function auditMatchExplainabilityHegemonyGate(
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
): MatchExplainabilityHegemonyGateReport {
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const dominionExport = buildSessionDominionExportBundle(packs, params);
  const bridge = auditImperialDominionBridge(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const dominionExportShipped = sessionDominionExportShipped(dominionExport);
  const imperialDominionHealthy = imperialDominionBridgeHealthy(bridge);
  const hegemonyAllowed = dominionReady && dominionExportShipped && imperialDominionHealthy;
  const narrativeLines = [
    `Match explainability hegemony: ${hegemonyAllowed ? 'ALLOWED' : 'DENIED'} (dominion ${dominionReady ? 'ok' : 'fail'}, export ${dominionExportShipped ? 'ok' : 'fail'}).`,
    ...dominion.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    hegemonyAllowed,
    dominionReady,
    dominionExportShipped,
    imperialDominionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityHegemonyAllowed(report: MatchExplainabilityHegemonyGateReport): boolean {
  return report.hegemonyAllowed;
}
