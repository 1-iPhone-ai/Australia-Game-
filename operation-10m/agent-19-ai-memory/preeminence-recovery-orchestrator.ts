import {
  auditMatchExplainabilityPreeminenceGate,
  matchExplainabilityPreeminenceAllowed,
} from './match-explainability-preeminence-gate.ts';
import { buildAscendancyRecoveryOrchestrator } from './ascendancy-recovery-orchestrator.ts';
import { buildMatchExplainabilityAscendancyBundle } from './match-explainability-ascendancy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PREEMINENCE_RECOVERY_CAP = 10;

export interface PreeminenceRecoveryOrchestratorReport {
  preeminenceBlocked: boolean;
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

/** Recovery path when preeminence gate blocks paramount rollout. */
export function buildPreeminenceRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): PreeminenceRecoveryOrchestratorReport {
  const preeminence = auditMatchExplainabilityPreeminenceGate(packs, params);
  const preeminenceBlocked = !matchExplainabilityPreeminenceAllowed(preeminence);
  const steps: string[] = [];
  if (preeminenceBlocked) {
    if (!preeminence.ascendancyReady) {
      steps.push('Restore ascendancy bundle: supremacy and ascendancy export must pass.');
    }
    if (!preeminence.ascendancyExportShipped) {
      steps.push('Emit session ascendancy export before preeminence clearance.');
    }
    if (!preeminence.supremacyAscendancyHealthy) {
      steps.push('Reconcile supremacy/ascendancy bridge before preeminence.');
    }
    steps.push(...buildAscendancyRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
    if (!ascendancy.ascendancyReady) {
      steps.push('Re-run ascendancy readiness checklist on turn packs.');
    }
  } else {
    steps.push('Preeminence gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PREEMINENCE_RECOVERY_CAP);
  return {
    preeminenceBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Preeminence recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function preeminenceRecoveryOrchestratorWithinCap(report: PreeminenceRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PREEMINENCE_RECOVERY_CAP;
}
