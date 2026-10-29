import {
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
import {
  buildSessionImperialExportBundle,
  sessionImperialExportShipped,
} from './session-imperial-export-bundle.ts';
import { auditSovereignImperialBridge, sovereignImperialBridgeHealthy } from './sovereign-imperial-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityDominionGateReport {
  dominionAllowed: boolean;
  imperialReady: boolean;
  imperialExportShipped: boolean;
  sovereignImperialHealthy: boolean;
  narrativeLines: string[];
}

/** Dominion gate: imperial bundle + imperial export + sovereign/imperial bridge. */
export function auditMatchExplainabilityDominionGate(
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
): MatchExplainabilityDominionGateReport {
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialExport = buildSessionImperialExportBundle(packs, params);
  const bridge = auditSovereignImperialBridge(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const imperialExportShipped = sessionImperialExportShipped(imperialExport);
  const sovereignImperialHealthy = sovereignImperialBridgeHealthy(bridge);
  const dominionAllowed = imperialReady && imperialExportShipped && sovereignImperialHealthy;
  const narrativeLines = [
    `Match explainability dominion: ${dominionAllowed ? 'ALLOWED' : 'DENIED'} (imperial ${imperialReady ? 'ok' : 'fail'}, export ${imperialExportShipped ? 'ok' : 'fail'}).`,
    ...imperial.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    dominionAllowed,
    imperialReady,
    imperialExportShipped,
    sovereignImperialHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityDominionAllowed(report: MatchExplainabilityDominionGateReport): boolean {
  return report.dominionAllowed;
}
