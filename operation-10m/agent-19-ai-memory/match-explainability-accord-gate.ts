import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
import {
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from './session-treaty-export-bundle.ts';
import { auditPactTreatyBridge, pactTreatyBridgeHealthy } from './pact-treaty-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityAccordGateReport {
  accordAllowed: boolean;
  treatyReady: boolean;
  treatyExportShipped: boolean;
  pactTreatyHealthy: boolean;
  narrativeLines: string[];
}

/** Accord gate: treaty bundle + treaty export + pact/treaty bridge. */
export function auditMatchExplainabilityAccordGate(
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
): MatchExplainabilityAccordGateReport {
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyExport = buildSessionTreatyExportBundle(packs, params);
  const bridge = auditPactTreatyBridge(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const treatyExportShipped = sessionTreatyExportShipped(treatyExport);
  const pactTreatyHealthy = pactTreatyBridgeHealthy(bridge);
  const accordAllowed = treatyReady && treatyExportShipped && pactTreatyHealthy;
  const narrativeLines = [
    `Match explainability accord: ${accordAllowed ? 'ALLOWED' : 'DENIED'} (treaty ${treatyReady ? 'ok' : 'fail'}, export ${treatyExportShipped ? 'ok' : 'fail'}).`,
    ...treaty.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    accordAllowed,
    treatyReady,
    treatyExportShipped,
    pactTreatyHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAccordAllowed(report: MatchExplainabilityAccordGateReport): boolean {
  return report.accordAllowed;
}
