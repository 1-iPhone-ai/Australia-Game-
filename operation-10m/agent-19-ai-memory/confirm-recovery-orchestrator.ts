import {
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from './match-explainability-confirm-gate.ts';
import { buildAckRecoveryOrchestrator } from './ack-recovery-orchestrator.ts';
import { buildMatchExplainabilityAckBundle } from './match-explainability-ack-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONFIRM_RECOVERY_CAP = 10;

export interface ConfirmRecoveryOrchestratorReport {
  confirmBlocked: boolean;
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

/** Recovery path when confirm gate blocks seal rollout. */
export function buildConfirmRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ConfirmRecoveryOrchestratorReport {
  const confirm = auditMatchExplainabilityConfirmGate(packs, params);
  const confirmBlocked = !matchExplainabilityConfirmAllowed(confirm);
  const steps: string[] = [];
  if (confirmBlocked) {
    if (!confirm.ackReady) {
      steps.push('Restore ack bundle: handshake and ack export must pass.');
    }
    if (!confirm.ackExportShipped) {
      steps.push('Emit session ack export before confirm clearance.');
    }
    if (!confirm.handshakeAckHealthy) {
      steps.push('Reconcile handshake/ack bridge before confirm.');
    }
    steps.push(...buildAckRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const ack = buildMatchExplainabilityAckBundle(packs, params);
    if (!ack.ackReady) {
      steps.push('Re-run ack readiness checklist on turn packs.');
    }
  } else {
    steps.push('Confirm gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CONFIRM_RECOVERY_CAP);
  return {
    confirmBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Confirm recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function confirmRecoveryOrchestratorWithinCap(report: ConfirmRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CONFIRM_RECOVERY_CAP;
}
