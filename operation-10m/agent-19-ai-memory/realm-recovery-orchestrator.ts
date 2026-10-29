import {
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from './match-explainability-realm-gate.ts';
import { buildCommonwealthRecoveryOrchestrator } from './commonwealth-recovery-orchestrator.ts';
import { buildMatchExplainabilityCommonwealthBundle } from './match-explainability-commonwealth-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_REALM_RECOVERY_CAP = 10;

export interface RealmRecoveryOrchestratorReport {
  realmBlocked: boolean;
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

/** Recovery path when realm gate blocks sovereign rollout. */
export function buildRealmRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): RealmRecoveryOrchestratorReport {
  const realm = auditMatchExplainabilityRealmGate(packs, params);
  const realmBlocked = !matchExplainabilityRealmAllowed(realm);
  const steps: string[] = [];
  if (realmBlocked) {
    if (!realm.commonwealthReady) {
      steps.push('Restore commonwealth bundle: union and commonwealth export must pass.');
    }
    if (!realm.commonwealthExportShipped) {
      steps.push('Emit session commonwealth export before realm clearance.');
    }
    if (!realm.unionCommonwealthHealthy) {
      steps.push('Reconcile union/commonwealth bridge before realm.');
    }
    steps.push(...buildCommonwealthRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
    if (!commonwealth.commonwealthReady) {
      steps.push('Re-run commonwealth readiness checklist on turn packs.');
    }
  } else {
    steps.push('Realm gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_REALM_RECOVERY_CAP);
  return {
    realmBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Realm recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function realmRecoveryOrchestratorWithinCap(report: RealmRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_REALM_RECOVERY_CAP;
}
