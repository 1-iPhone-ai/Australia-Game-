import {
  auditMatchExplainabilityHegemonyGate,
  matchExplainabilityHegemonyAllowed,
} from './match-explainability-hegemony-gate.ts';
import { buildDominionRecoveryOrchestrator } from './dominion-recovery-orchestrator.ts';
import { buildMatchExplainabilityDominionBundle } from './match-explainability-dominion-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_HEGEMONY_RECOVERY_CAP = 10;

export interface HegemonyRecoveryOrchestratorReport {
  hegemonyBlocked: boolean;
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

/** Recovery path when hegemony gate blocks supremacy rollout. */
export function buildHegemonyRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): HegemonyRecoveryOrchestratorReport {
  const hegemony = auditMatchExplainabilityHegemonyGate(packs, params);
  const hegemonyBlocked = !matchExplainabilityHegemonyAllowed(hegemony);
  const steps: string[] = [];
  if (hegemonyBlocked) {
    if (!hegemony.dominionReady) {
      steps.push('Restore dominion bundle: imperial and dominion export must pass.');
    }
    if (!hegemony.dominionExportShipped) {
      steps.push('Emit session dominion export before hegemony clearance.');
    }
    if (!hegemony.imperialDominionHealthy) {
      steps.push('Reconcile imperial/dominion bridge before hegemony.');
    }
    steps.push(...buildDominionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const dominion = buildMatchExplainabilityDominionBundle(packs, params);
    if (!dominion.dominionReady) {
      steps.push('Re-run dominion readiness checklist on turn packs.');
    }
  } else {
    steps.push('Hegemony gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_HEGEMONY_RECOVERY_CAP);
  return {
    hegemonyBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Hegemony recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function hegemonyRecoveryOrchestratorWithinCap(report: HegemonyRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_HEGEMONY_RECOVERY_CAP;
}
