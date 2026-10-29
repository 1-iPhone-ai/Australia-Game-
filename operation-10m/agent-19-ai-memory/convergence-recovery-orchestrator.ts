import {
  auditMatchExplainabilityConvergenceGate,
  matchExplainabilityConvergenceAllowed,
} from './match-explainability-convergence-gate.ts';
import { buildNexusRecoveryOrchestrator } from './nexus-recovery-orchestrator.ts';
import { buildMatchExplainabilityNexusBundle } from './match-explainability-nexus-bundle.ts';
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
  const convergence = auditMatchExplainabilityConvergenceGate(packs, params);
  const convergenceBlocked = !matchExplainabilityConvergenceAllowed(convergence);
  const steps: string[] = [];
  if (convergenceBlocked) {
    if (!convergence.nexusReady) {
      steps.push('Restore nexus bundle: vertex and nexus export must pass.');
    }
    if (!convergence.nexusExportShipped) {
      steps.push('Emit session nexus export before convergence clearance.');
    }
    if (!convergence.vertexNexusHealthy) {
      steps.push('Reconcile vertex/nexus bridge before convergence.');
    }
    steps.push(...buildNexusRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const nexus = buildMatchExplainabilityNexusBundle(packs, params);
    if (!nexus.nexusReady) {
      steps.push('Re-run nexus readiness checklist on turn packs.');
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
