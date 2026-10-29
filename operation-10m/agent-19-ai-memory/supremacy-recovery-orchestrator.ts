import {
  auditMatchExplainabilitySupremacyGate,
  matchExplainabilitySupremacyAllowed,
} from './match-explainability-supremacy-gate.ts';
import { buildHegemonyRecoveryOrchestrator } from './hegemony-recovery-orchestrator.ts';
import { buildMatchExplainabilityHegemonyBundle } from './match-explainability-hegemony-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SUPREMACY_RECOVERY_CAP = 10;

export interface SupremacyRecoveryOrchestratorReport {
  supremacyBlocked: boolean;
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

/** Recovery path when supremacy gate blocks ascendancy rollout. */
export function buildSupremacyRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SupremacyRecoveryOrchestratorReport {
  const supremacy = auditMatchExplainabilitySupremacyGate(packs, params);
  const supremacyBlocked = !matchExplainabilitySupremacyAllowed(supremacy);
  const steps: string[] = [];
  if (supremacyBlocked) {
    if (!supremacy.hegemonyReady) {
      steps.push('Restore hegemony bundle: dominion and hegemony export must pass.');
    }
    if (!supremacy.hegemonyExportShipped) {
      steps.push('Emit session hegemony export before supremacy clearance.');
    }
    if (!supremacy.dominionHegemonyHealthy) {
      steps.push('Reconcile dominion/hegemony bridge before supremacy.');
    }
    steps.push(...buildHegemonyRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
    if (!hegemony.hegemonyReady) {
      steps.push('Re-run hegemony readiness checklist on turn packs.');
    }
  } else {
    steps.push('Supremacy gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SUPREMACY_RECOVERY_CAP);
  return {
    supremacyBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Supremacy recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function supremacyRecoveryOrchestratorWithinCap(report: SupremacyRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SUPREMACY_RECOVERY_CAP;
}
