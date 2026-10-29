import {
  auditMatchExplainabilityAscendancyGate,
  matchExplainabilityAscendancyAllowed,
} from './match-explainability-ascendancy-gate.ts';
import { buildSupremacyRecoveryOrchestrator } from './supremacy-recovery-orchestrator.ts';
import { buildMatchExplainabilitySupremacyBundle } from './match-explainability-supremacy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ASCENDANCY_RECOVERY_CAP = 10;

export interface AscendancyRecoveryOrchestratorReport {
  ascendancyBlocked: boolean;
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

/** Recovery path when ascendancy gate blocks preeminence rollout. */
export function buildAscendancyRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AscendancyRecoveryOrchestratorReport {
  const ascendancy = auditMatchExplainabilityAscendancyGate(packs, params);
  const ascendancyBlocked = !matchExplainabilityAscendancyAllowed(ascendancy);
  const steps: string[] = [];
  if (ascendancyBlocked) {
    if (!ascendancy.supremacyReady) {
      steps.push('Restore supremacy bundle: hegemony and supremacy export must pass.');
    }
    if (!ascendancy.supremacyExportShipped) {
      steps.push('Emit session supremacy export before ascendancy clearance.');
    }
    if (!ascendancy.hegemonySupremacyHealthy) {
      steps.push('Reconcile hegemony/supremacy bridge before ascendancy.');
    }
    steps.push(...buildSupremacyRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
    if (!supremacy.supremacyReady) {
      steps.push('Re-run supremacy readiness checklist on turn packs.');
    }
  } else {
    steps.push('Ascendancy gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ASCENDANCY_RECOVERY_CAP);
  return {
    ascendancyBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Ascendancy recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function ascendancyRecoveryOrchestratorWithinCap(report: AscendancyRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ASCENDANCY_RECOVERY_CAP;
}
