import {
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from './match-explainability-seal-gate.ts';
import { buildConfirmRecoveryOrchestrator } from './confirm-recovery-orchestrator.ts';
import { buildMatchExplainabilityConfirmBundle } from './match-explainability-confirm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SEAL_RECOVERY_CAP = 10;

export interface SealRecoveryOrchestratorReport {
  sealBlocked: boolean;
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

/** Recovery path when seal gate blocks covenant rollout. */
export function buildSealRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SealRecoveryOrchestratorReport {
  const seal = auditMatchExplainabilitySealGate(packs, params);
  const sealBlocked = !matchExplainabilitySealAllowed(seal);
  const steps: string[] = [];
  if (sealBlocked) {
    if (!seal.confirmReady) {
      steps.push('Restore confirm bundle: ack and confirm export must pass.');
    }
    if (!seal.confirmExportShipped) {
      steps.push('Emit session confirm export before seal clearance.');
    }
    if (!seal.ackConfirmHealthy) {
      steps.push('Reconcile ack/confirm bridge before seal.');
    }
    steps.push(...buildConfirmRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
    if (!confirm.confirmReady) {
      steps.push('Re-run confirm readiness checklist on turn packs.');
    }
  } else {
    steps.push('Seal gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SEAL_RECOVERY_CAP);
  return {
    sealBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Seal recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function sealRecoveryOrchestratorWithinCap(report: SealRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SEAL_RECOVERY_CAP;
}
