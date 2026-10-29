import {
  buildMatchExplainabilityHegemonyBundle,
  matchExplainabilityHegemonyReady,
} from './match-explainability-hegemony-bundle.ts';
import {
  buildSessionHegemonyExportBundle,
  sessionHegemonyExportShipped,
} from './session-hegemony-export-bundle.ts';
import { auditDominionHegemonyBridge, dominionHegemonyBridgeHealthy } from './dominion-hegemony-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilitySupremacyGateReport {
  supremacyAllowed: boolean;
  hegemonyReady: boolean;
  hegemonyExportShipped: boolean;
  dominionHegemonyHealthy: boolean;
  narrativeLines: string[];
}

/** Supremacy gate: hegemony bundle + hegemony export + dominion/hegemony bridge. */
export function auditMatchExplainabilitySupremacyGate(
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
): MatchExplainabilitySupremacyGateReport {
  const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
  const hegemonyExport = buildSessionHegemonyExportBundle(packs, params);
  const bridge = auditDominionHegemonyBridge(packs, params);
  const hegemonyReady = matchExplainabilityHegemonyReady(hegemony);
  const hegemonyExportShipped = sessionHegemonyExportShipped(hegemonyExport);
  const dominionHegemonyHealthy = dominionHegemonyBridgeHealthy(bridge);
  const supremacyAllowed = hegemonyReady && hegemonyExportShipped && dominionHegemonyHealthy;
  const narrativeLines = [
    `Match explainability supremacy: ${supremacyAllowed ? 'ALLOWED' : 'DENIED'} (hegemony ${hegemonyReady ? 'ok' : 'fail'}, export ${hegemonyExportShipped ? 'ok' : 'fail'}).`,
    ...hegemony.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    supremacyAllowed,
    hegemonyReady,
    hegemonyExportShipped,
    dominionHegemonyHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySupremacyAllowed(report: MatchExplainabilitySupremacyGateReport): boolean {
  return report.supremacyAllowed;
}
