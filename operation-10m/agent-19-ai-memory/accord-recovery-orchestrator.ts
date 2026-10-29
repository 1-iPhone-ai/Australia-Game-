import {
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from './match-explainability-accord-gate.ts';
import { buildTreatyRecoveryOrchestrator } from './treaty-recovery-orchestrator.ts';
import { buildMatchExplainabilityTreatyBundle } from './match-explainability-treaty-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACCORD_RECOVERY_CAP = 10;

export interface AccordRecoveryOrchestratorReport {
  accordBlocked: boolean;
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

/** Recovery path when accord gate blocks league rollout. */
export function buildAccordRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AccordRecoveryOrchestratorReport {
  const accord = auditMatchExplainabilityAccordGate(packs, params);
  const accordBlocked = !matchExplainabilityAccordAllowed(accord);
  const steps: string[] = [];
  if (accordBlocked) {
    if (!accord.treatyReady) {
      steps.push('Restore treaty bundle: pact and treaty export must pass.');
    }
    if (!accord.treatyExportShipped) {
      steps.push('Emit session treaty export before accord clearance.');
    }
    if (!accord.pactTreatyHealthy) {
      steps.push('Reconcile pact/treaty bridge before accord.');
    }
    steps.push(...buildTreatyRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
    if (!treaty.treatyReady) {
      steps.push('Re-run treaty readiness checklist on turn packs.');
    }
  } else {
    steps.push('Accord gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ACCORD_RECOVERY_CAP);
  return {
    accordBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Accord recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function accordRecoveryOrchestratorWithinCap(report: AccordRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ACCORD_RECOVERY_CAP;
}
