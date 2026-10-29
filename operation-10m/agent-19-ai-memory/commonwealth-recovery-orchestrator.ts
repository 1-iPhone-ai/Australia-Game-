import {
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from './match-explainability-commonwealth-gate.ts';
import { buildUnionRecoveryOrchestrator } from './union-recovery-orchestrator.ts';
import { buildMatchExplainabilityUnionBundle } from './match-explainability-union-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_COMMONWEALTH_RECOVERY_CAP = 10;

export interface CommonwealthRecoveryOrchestratorReport {
  commonwealthBlocked: boolean;
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

/** Recovery path when commonwealth gate blocks realm rollout. */
export function buildCommonwealthRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CommonwealthRecoveryOrchestratorReport {
  const commonwealth = auditMatchExplainabilityCommonwealthGate(packs, params);
  const commonwealthBlocked = !matchExplainabilityCommonwealthAllowed(commonwealth);
  const steps: string[] = [];
  if (commonwealthBlocked) {
    if (!commonwealth.unionReady) {
      steps.push('Restore union bundle: federation and union export must pass.');
    }
    if (!commonwealth.unionExportShipped) {
      steps.push('Emit session union export before commonwealth clearance.');
    }
    if (!commonwealth.federationUnionHealthy) {
      steps.push('Reconcile federation/union bridge before commonwealth.');
    }
    steps.push(...buildUnionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const union = buildMatchExplainabilityUnionBundle(packs, params);
    if (!union.unionReady) {
      steps.push('Re-run union readiness checklist on turn packs.');
    }
  } else {
    steps.push('Commonwealth gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_COMMONWEALTH_RECOVERY_CAP);
  return {
    commonwealthBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Commonwealth recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function commonwealthRecoveryOrchestratorWithinCap(report: CommonwealthRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_COMMONWEALTH_RECOVERY_CAP;
}
