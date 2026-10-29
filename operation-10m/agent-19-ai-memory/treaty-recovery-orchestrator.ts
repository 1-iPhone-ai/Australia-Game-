import {
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from './match-explainability-treaty-gate.ts';
import { buildPactRecoveryOrchestrator } from './pact-recovery-orchestrator.ts';
import { buildMatchExplainabilityPactBundle } from './match-explainability-pact-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_TREATY_RECOVERY_CAP = 10;

export interface TreatyRecoveryOrchestratorReport {
  treatyBlocked: boolean;
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

/** Recovery path when treaty gate blocks accord rollout. */
export function buildTreatyRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): TreatyRecoveryOrchestratorReport {
  const treaty = auditMatchExplainabilityTreatyGate(packs, params);
  const treatyBlocked = !matchExplainabilityTreatyAllowed(treaty);
  const steps: string[] = [];
  if (treatyBlocked) {
    if (!treaty.pactReady) {
      steps.push('Restore pact bundle: charter and pact export must pass.');
    }
    if (!treaty.pactExportShipped) {
      steps.push('Emit session pact export before treaty clearance.');
    }
    if (!treaty.charterPactHealthy) {
      steps.push('Reconcile charter/pact bridge before treaty.');
    }
    steps.push(...buildPactRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const pact = buildMatchExplainabilityPactBundle(packs, params);
    if (!pact.pactReady) {
      steps.push('Re-run pact readiness checklist on turn packs.');
    }
  } else {
    steps.push('Treaty gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_TREATY_RECOVERY_CAP);
  return {
    treatyBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Treaty recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function treatyRecoveryOrchestratorWithinCap(report: TreatyRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_TREATY_RECOVERY_CAP;
}
