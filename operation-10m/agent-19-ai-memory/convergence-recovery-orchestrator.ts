import {
  auditMatchExplainabilityLatticeGate,
  matchExplainabilityLatticeAllowed,
} from './match-explainability-lattice-gate.ts';
import { buildConvergenceRecoveryOrchestrator } from './convergence-recovery-orchestrator.ts';
import { auditMatchExplainabilityResonanceGate } from './match-explainability-resonance-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_RECOVERY_CAP = 10;

export interface ConvergenceRecoveryOrchestratorReport {
  convergenceBlocked: boolean;
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

/** Recovery path when convergence gate blocks lattice rollout. */
export function buildConvergenceRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ConvergenceRecoveryOrchestratorReport {
  const convergence = auditMatchExplainabilityLatticeGate(packs, params);
  const convergenceBlocked = !matchExplainabilityLatticeAllowed(convergence);
  const steps: string[] = [];
  if (convergenceBlocked) {
    if (!convergence.resonanceReady) {
      steps.push('Restore resonance bundle: vertex and resonance export must pass.');
    }
    if (!convergence.resonanceExportShipped) {
      steps.push('Emit session resonance export before convergence clearance.');
    }
    if (!convergence.vertexResonanceHealthy) {
      steps.push('Reconcile vertex/resonance bridge before convergence.');
    }
    steps.push(...buildConvergenceRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const resonance = auditMatchExplainabilityResonanceGate(packs, params);
    if (!resonance.resonanceReady) {
      steps.push('Re-run resonance readiness checklist on turn packs.');
    }
  } else {
    steps.push('Convergence gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CONVERGENCE_RECOVERY_CAP);
  return {
    convergenceBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Convergence recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function convergenceRecoveryOrchestratorWithinCap(report: ConvergenceRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CONVERGENCE_RECOVERY_CAP;
}
