import {
  auditMatchExplainabilityHarmonyGate,
  matchExplainabilityHarmonyAllowed,
} from './match-explainability-harmony-gate.ts';
import { buildSynthesisRecoveryOrchestrator } from './synthesis-recovery-orchestrator.ts';
import { auditMatchExplainabilityResonanceGate } from './match-explainability-resonance-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SYNTHESIS_RECOVERY_CAP = 10;

export interface SynthesisRecoveryOrchestratorReport {
  synthesisBlocked: boolean;
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

/** Recovery path when synthesis gate blocks harmony rollout. */
export function buildSynthesisRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SynthesisRecoveryOrchestratorReport {
  const synthesis = auditMatchExplainabilityHarmonyGate(packs, params);
  const synthesisBlocked = !matchExplainabilityHarmonyAllowed(synthesis);
  const steps: string[] = [];
  if (synthesisBlocked) {
    if (!synthesis.resonanceReady) {
      steps.push('Restore resonance bundle: vertex and resonance export must pass.');
    }
    if (!synthesis.resonanceExportShipped) {
      steps.push('Emit session resonance export before synthesis clearance.');
    }
    if (!synthesis.vertexResonanceHealthy) {
      steps.push('Reconcile vertex/resonance bridge before synthesis.');
    }
    steps.push(...buildSynthesisRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const resonance = auditMatchExplainabilityResonanceGate(packs, params);
    if (!resonance.resonanceReady) {
      steps.push('Re-run resonance readiness checklist on turn packs.');
    }
  } else {
    steps.push('Synthesis gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SYNTHESIS_RECOVERY_CAP);
  return {
    synthesisBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Synthesis recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function synthesisRecoveryOrchestratorWithinCap(report: SynthesisRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SYNTHESIS_RECOVERY_CAP;
}
