import {
  auditMatchExplainabilityMatrixGate,
  matchExplainabilityMatrixAllowed,
} from './match-explainability-matrix-gate.ts';
import { buildFusionRecoveryOrchestrator } from './fusion-recovery-orchestrator.ts';
import { auditMatchExplainabilityResonanceGate } from './match-explainability-resonance-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_FUSION_RECOVERY_CAP = 10;

export interface FusionRecoveryOrchestratorReport {
  fusionBlocked: boolean;
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

/** Recovery path when fusion gate blocks matrix rollout. */
export function buildFusionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): FusionRecoveryOrchestratorReport {
  const fusion = auditMatchExplainabilityMatrixGate(packs, params);
  const fusionBlocked = !matchExplainabilityMatrixAllowed(fusion);
  const steps: string[] = [];
  if (fusionBlocked) {
    if (!fusion.resonanceReady) {
      steps.push('Restore resonance bundle: vertex and resonance export must pass.');
    }
    if (!fusion.resonanceExportShipped) {
      steps.push('Emit session resonance export before fusion clearance.');
    }
    if (!fusion.vertexResonanceHealthy) {
      steps.push('Reconcile vertex/resonance bridge before fusion.');
    }
    steps.push(...buildFusionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const resonance = auditMatchExplainabilityResonanceGate(packs, params);
    if (!resonance.resonanceReady) {
      steps.push('Re-run resonance readiness checklist on turn packs.');
    }
  } else {
    steps.push('Fusion gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_FUSION_RECOVERY_CAP);
  return {
    fusionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Fusion recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function fusionRecoveryOrchestratorWithinCap(report: FusionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_FUSION_RECOVERY_CAP;
}
