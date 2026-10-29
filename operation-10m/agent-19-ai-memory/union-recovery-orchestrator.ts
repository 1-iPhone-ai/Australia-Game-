import {
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from './match-explainability-union-gate.ts';
import { buildFederationRecoveryOrchestrator } from './federation-recovery-orchestrator.ts';
import { buildMatchExplainabilityFederationBundle } from './match-explainability-federation-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_UNION_RECOVERY_CAP = 10;

export interface UnionRecoveryOrchestratorReport {
  unionBlocked: boolean;
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

/** Recovery path when union gate blocks commonwealth rollout. */
export function buildUnionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): UnionRecoveryOrchestratorReport {
  const union = auditMatchExplainabilityUnionGate(packs, params);
  const unionBlocked = !matchExplainabilityUnionAllowed(union);
  const steps: string[] = [];
  if (unionBlocked) {
    if (!union.federationReady) {
      steps.push('Restore federation bundle: league and federation export must pass.');
    }
    if (!union.federationExportShipped) {
      steps.push('Emit session federation export before union clearance.');
    }
    if (!union.leagueFederationHealthy) {
      steps.push('Reconcile league/federation bridge before union.');
    }
    steps.push(...buildFederationRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const federation = buildMatchExplainabilityFederationBundle(packs, params);
    if (!federation.federationReady) {
      steps.push('Re-run federation readiness checklist on turn packs.');
    }
  } else {
    steps.push('Union gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_UNION_RECOVERY_CAP);
  return {
    unionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Union recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function unionRecoveryOrchestratorWithinCap(report: UnionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_UNION_RECOVERY_CAP;
}
