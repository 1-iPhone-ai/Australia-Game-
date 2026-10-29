import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
import {
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from './session-pact-export-bundle.ts';
import { auditCharterPactBridge, charterPactBridgeHealthy } from './charter-pact-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityTreatyGateReport {
  treatyAllowed: boolean;
  pactReady: boolean;
  pactExportShipped: boolean;
  charterPactHealthy: boolean;
  narrativeLines: string[];
}

/** Treaty gate: pact bundle + pact export + charter/pact bridge. */
export function auditMatchExplainabilityTreatyGate(
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
): MatchExplainabilityTreatyGateReport {
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactExport = buildSessionPactExportBundle(packs, params);
  const bridge = auditCharterPactBridge(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const pactExportShipped = sessionPactExportShipped(pactExport);
  const charterPactHealthy = charterPactBridgeHealthy(bridge);
  const treatyAllowed = pactReady && pactExportShipped && charterPactHealthy;
  const narrativeLines = [
    `Match explainability treaty: ${treatyAllowed ? 'ALLOWED' : 'DENIED'} (pact ${pactReady ? 'ok' : 'fail'}, export ${pactExportShipped ? 'ok' : 'fail'}).`,
    ...pact.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    treatyAllowed,
    pactReady,
    pactExportShipped,
    charterPactHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityTreatyAllowed(report: MatchExplainabilityTreatyGateReport): boolean {
  return report.treatyAllowed;
}
