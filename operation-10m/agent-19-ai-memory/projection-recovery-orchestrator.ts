import {
  auditMatchExplainabilityResonanceGate,
  matchExplainabilityResonanceAllowed,
} from './match-explainability-resonance-gate.ts';
import { buildProjectionRecoveryOrchestrator } from './projection-recovery-orchestrator.ts';
import { auditMatchExplainabilityLatticeGate } from './match-explainability-lattice-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PROJECTION_RECOVERY_CAP = 10;

export interface ProjectionRecoveryOrchestratorReport {
  projectionBlocked: boolean;
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

/** Recovery path when projection gate blocks resonance rollout. */
export function buildProjectionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ProjectionRecoveryOrchestratorReport {
  const projection = auditMatchExplainabilityResonanceGate(packs, params);
  const projectionBlocked = !matchExplainabilityResonanceAllowed(projection);
  const steps: string[] = [];
  if (projectionBlocked) {
    if (!projection.latticeReady) {
      steps.push('Restore lattice bundle: vertex and lattice export must pass.');
    }
    if (!projection.latticeExportShipped) {
      steps.push('Emit session lattice export before projection clearance.');
    }
    if (!projection.vertexLatticeHealthy) {
      steps.push('Reconcile vertex/lattice bridge before projection.');
    }
    steps.push(...buildProjectionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const lattice = auditMatchExplainabilityLatticeGate(packs, params);
    if (!lattice.latticeReady) {
      steps.push('Re-run lattice readiness checklist on turn packs.');
    }
  } else {
    steps.push('Projection gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PROJECTION_RECOVERY_CAP);
  return {
    projectionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Projection recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function projectionRecoveryOrchestratorWithinCap(report: ProjectionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PROJECTION_RECOVERY_CAP;
}
