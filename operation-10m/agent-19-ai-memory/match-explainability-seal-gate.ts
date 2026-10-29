import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
import {
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from './session-confirm-export-bundle.ts';
import { auditAckConfirmBridge, ackConfirmBridgeHealthy } from './ack-confirm-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilitySealGateReport {
  sealAllowed: boolean;
  confirmReady: boolean;
  confirmExportShipped: boolean;
  ackConfirmHealthy: boolean;
  narrativeLines: string[];
}

/** Seal gate: confirm bundle + confirm export + ack/confirm bridge. */
export function auditMatchExplainabilitySealGate(
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
): MatchExplainabilitySealGateReport {
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmExport = buildSessionConfirmExportBundle(packs, params);
  const bridge = auditAckConfirmBridge(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const confirmExportShipped = sessionConfirmExportShipped(confirmExport);
  const ackConfirmHealthy = ackConfirmBridgeHealthy(bridge);
  const sealAllowed = confirmReady && confirmExportShipped && ackConfirmHealthy;
  const narrativeLines = [
    `Match explainability seal: ${sealAllowed ? 'ALLOWED' : 'DENIED'} (confirm ${confirmReady ? 'ok' : 'fail'}, export ${confirmExportShipped ? 'ok' : 'fail'}).`,
    ...confirm.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    sealAllowed,
    confirmReady,
    confirmExportShipped,
    ackConfirmHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySealAllowed(report: MatchExplainabilitySealGateReport): boolean {
  return report.sealAllowed;
}
