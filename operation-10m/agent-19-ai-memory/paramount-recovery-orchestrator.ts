import {
  auditMatchExplainabilityParamountGate,
  matchExplainabilityParamountAllowed,
} from './match-explainability-paramount-gate.ts';
import { buildPreeminenceRecoveryOrchestrator } from './preeminence-recovery-orchestrator.ts';
import { buildMatchExplainabilityPreeminenceBundle } from './match-explainability-preeminence-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PARAMOUNT_RECOVERY_CAP = 10;

export interface ParamountRecoveryOrchestratorReport {
  paramountBlocked: boolean;
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

/** Recovery path when paramount gate blocks pinnacle rollout. */
export function buildParamountRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ParamountRecoveryOrchestratorReport {
  const paramount = auditMatchExplainabilityParamountGate(packs, params);
  const paramountBlocked = !matchExplainabilityParamountAllowed(paramount);
  const steps: string[] = [];
  if (paramountBlocked) {
    if (!paramount.preeminenceReady) {
      steps.push('Restore preeminence bundle: ascendancy and preeminence export must pass.');
    }
    if (!paramount.preeminenceExportShipped) {
      steps.push('Emit session preeminence export before paramount clearance.');
    }
    if (!paramount.ascendancyPreeminenceHealthy) {
      steps.push('Reconcile ascendancy/preeminence bridge before paramount.');
    }
    steps.push(...buildPreeminenceRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
    if (!preeminence.preeminenceReady) {
      steps.push('Re-run preeminence readiness checklist on turn packs.');
    }
  } else {
    steps.push('Paramount gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PARAMOUNT_RECOVERY_CAP);
  return {
    paramountBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Paramount recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function paramountRecoveryOrchestratorWithinCap(report: ParamountRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PARAMOUNT_RECOVERY_CAP;
}
