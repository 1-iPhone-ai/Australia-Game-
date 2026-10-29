import {
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from './match-explainability-covenant-gate.ts';
import { buildSealRecoveryOrchestrator } from './seal-recovery-orchestrator.ts';
import { buildMatchExplainabilitySealBundle } from './match-explainability-seal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_COVENANT_RECOVERY_CAP = 10;

export interface CovenantRecoveryOrchestratorReport {
  covenantBlocked: boolean;
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

/** Recovery path when covenant gate blocks charter rollout. */
export function buildCovenantRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CovenantRecoveryOrchestratorReport {
  const covenant = auditMatchExplainabilityCovenantGate(packs, params);
  const covenantBlocked = !matchExplainabilityCovenantAllowed(covenant);
  const steps: string[] = [];
  if (covenantBlocked) {
    if (!covenant.sealReady) {
      steps.push('Restore seal bundle: confirm and seal export must pass.');
    }
    if (!covenant.sealExportShipped) {
      steps.push('Emit session seal export before covenant clearance.');
    }
    if (!covenant.confirmSealHealthy) {
      steps.push('Reconcile confirm/seal bridge before covenant.');
    }
    steps.push(...buildSealRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const seal = buildMatchExplainabilitySealBundle(packs, params);
    if (!seal.sealReady) {
      steps.push('Re-run seal readiness checklist on turn packs.');
    }
  } else {
    steps.push('Covenant gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_COVENANT_RECOVERY_CAP);
  return {
    covenantBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Covenant recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function covenantRecoveryOrchestratorWithinCap(report: CovenantRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_COVENANT_RECOVERY_CAP;
}
