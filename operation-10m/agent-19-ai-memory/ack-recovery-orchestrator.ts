import {
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from './match-explainability-ack-gate.ts';
import { buildHandshakeRecoveryOrchestrator } from './handshake-recovery-orchestrator.ts';
import { buildMatchExplainabilityHandshakeBundle } from './match-explainability-handshake-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACK_RECOVERY_CAP = 10;

export interface AckRecoveryOrchestratorReport {
  ackBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when ack gate blocks confirm rollout. */
export function buildAckRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AckRecoveryOrchestratorReport {
  const ack = auditMatchExplainabilityAckGate(packs, params);
  const ackBlocked = !matchExplainabilityAckAllowed(ack);
  const steps: string[] = [];
  if (ackBlocked) {
    if (!ack.handshakeReady) {
      steps.push('Restore handshake bundle: uplink and handshake export must pass.');
    }
    if (!ack.handshakeExportShipped) {
      steps.push('Emit session handshake export before ack clearance.');
    }
    if (!ack.uplinkHandshakeHealthy) {
      steps.push('Reconcile uplink/handshake bridge before ack.');
    }
    steps.push(...buildHandshakeRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
    if (!handshake.handshakeReady) {
      steps.push('Re-run handshake readiness checklist on turn packs.');
    }
  } else {
    steps.push('Ack gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ACK_RECOVERY_CAP);
  return {
    ackBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Ack recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function ackRecoveryOrchestratorWithinCap(report: AckRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ACK_RECOVERY_CAP;
}
