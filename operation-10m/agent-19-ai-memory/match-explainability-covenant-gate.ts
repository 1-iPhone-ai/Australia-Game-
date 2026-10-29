import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
import {
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from './session-seal-export-bundle.ts';
import { auditConfirmSealBridge, confirmSealBridgeHealthy } from './confirm-seal-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityCovenantGateReport {
  covenantAllowed: boolean;
  sealReady: boolean;
  sealExportShipped: boolean;
  confirmSealHealthy: boolean;
  narrativeLines: string[];
}

/** Covenant gate: seal bundle + seal export + confirm/seal bridge. */
export function auditMatchExplainabilityCovenantGate(
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
): MatchExplainabilityCovenantGateReport {
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealExport = buildSessionSealExportBundle(packs, params);
  const bridge = auditConfirmSealBridge(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const sealExportShipped = sessionSealExportShipped(sealExport);
  const confirmSealHealthy = confirmSealBridgeHealthy(bridge);
  const covenantAllowed = sealReady && sealExportShipped && confirmSealHealthy;
  const narrativeLines = [
    `Match explainability covenant: ${covenantAllowed ? 'ALLOWED' : 'DENIED'} (seal ${sealReady ? 'ok' : 'fail'}, export ${sealExportShipped ? 'ok' : 'fail'}).`,
    ...seal.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    covenantAllowed,
    sealReady,
    sealExportShipped,
    confirmSealHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCovenantAllowed(report: MatchExplainabilityCovenantGateReport): boolean {
  return report.covenantAllowed;
}
