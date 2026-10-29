import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
import {
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from './session-charter-export-bundle.ts';
import { auditCovenantCharterBridge, covenantCharterBridgeHealthy } from './covenant-charter-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityPactGateReport {
  pactAllowed: boolean;
  charterReady: boolean;
  charterExportShipped: boolean;
  covenantCharterHealthy: boolean;
  narrativeLines: string[];
}

/** Pact gate: charter bundle + charter export + covenant/charter bridge. */
export function auditMatchExplainabilityPactGate(
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
): MatchExplainabilityPactGateReport {
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterExport = buildSessionCharterExportBundle(packs, params);
  const bridge = auditCovenantCharterBridge(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const charterExportShipped = sessionCharterExportShipped(charterExport);
  const covenantCharterHealthy = covenantCharterBridgeHealthy(bridge);
  const pactAllowed = charterReady && charterExportShipped && covenantCharterHealthy;
  const narrativeLines = [
    `Match explainability pact: ${pactAllowed ? 'ALLOWED' : 'DENIED'} (charter ${charterReady ? 'ok' : 'fail'}, export ${charterExportShipped ? 'ok' : 'fail'}).`,
    ...charter.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    pactAllowed,
    charterReady,
    charterExportShipped,
    covenantCharterHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityPactAllowed(report: MatchExplainabilityPactGateReport): boolean {
  return report.pactAllowed;
}
