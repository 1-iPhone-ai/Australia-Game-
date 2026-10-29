import {
  auditMatchExplainabilityZenithGate,
  matchExplainabilityZenithAllowed,
} from './match-explainability-zenith-gate.ts';
import { buildApexRecoveryOrchestrator } from './apex-recovery-orchestrator.ts';
import { buildMatchExplainabilityApexBundle } from './match-explainability-apex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ZENITH_RECOVERY_CAP = 10;

export interface ZenithRecoveryOrchestratorReport {
  zenithBlocked: boolean;
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

/** Recovery path when zenith gate blocks summit rollout. */
export function buildZenithRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ZenithRecoveryOrchestratorReport {
  const zenith = auditMatchExplainabilityZenithGate(packs, params);
  const zenithBlocked = !matchExplainabilityZenithAllowed(zenith);
  const steps: string[] = [];
  if (zenithBlocked) {
    if (!zenith.apexReady) {
      steps.push('Restore apex bundle: pinnacle and apex export must pass.');
    }
    if (!zenith.apexExportShipped) {
      steps.push('Emit session apex export before zenith clearance.');
    }
    if (!zenith.pinnacleApexHealthy) {
      steps.push('Reconcile pinnacle/apex bridge before zenith.');
    }
    steps.push(...buildApexRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const apex = buildMatchExplainabilityApexBundle(packs, params);
    if (!apex.apexReady) {
      steps.push('Re-run apex readiness checklist on turn packs.');
    }
  } else {
    steps.push('Zenith gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ZENITH_RECOVERY_CAP);
  return {
    zenithBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Zenith recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function zenithRecoveryOrchestratorWithinCap(report: ZenithRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ZENITH_RECOVERY_CAP;
}
