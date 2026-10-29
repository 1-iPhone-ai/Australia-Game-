import {
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from './match-explainability-final-gate.ts';
import { auditConfidenceExportBridge, confidenceExportBridgeAllowed } from './confidence-export-bridge.ts';
import {
  buildNegotiationSessionRollup,
  negotiationSessionMostlyAligned,
} from './negotiation-session-rollup.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityShipmentGateReport {
  shipmentAllowed: boolean;
  finalGateOpen: boolean;
  confidenceExportOk: boolean;
  negotiationAligned: boolean;
  narrativeLines: string[];
}

/** Shipment gate: final gate + confidence/export bridge + negotiation session alignment. */
export function auditMatchExplainabilityShipmentGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityShipmentGateReport {
  const finalGate = auditMatchExplainabilityFinalGate(packs, params);
  const finalGateOpen = matchExplainabilityFinalGateOpen(finalGate);
  const confidenceExport = auditConfidenceExportBridge(packs, params);
  const confidenceExportOk = confidenceExportBridgeAllowed(confidenceExport);
  const negotiation = buildNegotiationSessionRollup(packs, {
    relationship: params.relationship,
    decisionsByTurn: params.decisionsByTurn.map(d => ({ after: d.after })),
  });
  const negotiationAligned = negotiationSessionMostlyAligned(negotiation);
  const shipmentAllowed = finalGateOpen && confidenceExportOk && negotiationAligned;
  const narrativeLines = [
    `Match explainability shipment: ${shipmentAllowed ? 'ALLOWED' : 'BLOCKED'} (final ${finalGateOpen ? 'ok' : 'fail'}, export ${confidenceExportOk ? 'ok' : 'fail'}, negotiation ${negotiationAligned ? 'ok' : 'fail'}).`,
    ...finalGate.narrativeLines.slice(0, 1),
    ...confidenceExport.narrativeLines.slice(0, 1),
  ];
  return {
    shipmentAllowed,
    finalGateOpen,
    confidenceExportOk,
    negotiationAligned,
    narrativeLines,
  };
}

export function matchExplainabilityShipmentAllowed(report: MatchExplainabilityShipmentGateReport): boolean {
  return report.shipmentAllowed;
}
