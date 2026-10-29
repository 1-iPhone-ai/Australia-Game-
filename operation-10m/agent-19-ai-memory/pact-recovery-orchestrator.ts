import {
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from './match-explainability-pact-gate.ts';
import { buildCharterRecoveryOrchestrator } from './charter-recovery-orchestrator.ts';
import { buildMatchExplainabilityCharterBundle } from './match-explainability-charter-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PACT_RECOVERY_CAP = 10;

export interface PactRecoveryOrchestratorReport {
  pactBlocked: boolean;
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

/** Recovery path when pact gate blocks treaty rollout. */
export function buildPactRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): PactRecoveryOrchestratorReport {
  const pact = auditMatchExplainabilityPactGate(packs, params);
  const pactBlocked = !matchExplainabilityPactAllowed(pact);
  const steps: string[] = [];
  if (pactBlocked) {
    if (!pact.charterReady) {
      steps.push('Restore charter bundle: covenant and charter export must pass.');
    }
    if (!pact.charterExportShipped) {
      steps.push('Emit session charter export before pact clearance.');
    }
    if (!pact.covenantCharterHealthy) {
      steps.push('Reconcile covenant/charter bridge before pact.');
    }
    steps.push(...buildCharterRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const charter = buildMatchExplainabilityCharterBundle(packs, params);
    if (!charter.charterReady) {
      steps.push('Re-run charter readiness checklist on turn packs.');
    }
  } else {
    steps.push('Pact gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PACT_RECOVERY_CAP);
  return {
    pactBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Pact recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function pactRecoveryOrchestratorWithinCap(report: PactRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PACT_RECOVERY_CAP;
}
