import {
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from './match-explainability-sovereign-gate.ts';
import { buildRealmRecoveryOrchestrator } from './realm-recovery-orchestrator.ts';
import { buildMatchExplainabilityRealmBundle } from './match-explainability-realm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SOVEREIGN_RECOVERY_CAP = 10;

export interface SovereignRecoveryOrchestratorReport {
  sovereignBlocked: boolean;
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

/** Recovery path when sovereign gate blocks imperial rollout. */
export function buildSovereignRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SovereignRecoveryOrchestratorReport {
  const sovereign = auditMatchExplainabilitySovereignGate(packs, params);
  const sovereignBlocked = !matchExplainabilitySovereignAllowed(sovereign);
  const steps: string[] = [];
  if (sovereignBlocked) {
    if (!sovereign.realmReady) {
      steps.push('Restore realm bundle: commonwealth and realm export must pass.');
    }
    if (!sovereign.realmExportShipped) {
      steps.push('Emit session realm export before sovereign clearance.');
    }
    if (!sovereign.commonwealthRealmHealthy) {
      steps.push('Reconcile commonwealth/realm bridge before sovereign.');
    }
    steps.push(...buildRealmRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const realm = buildMatchExplainabilityRealmBundle(packs, params);
    if (!realm.realmReady) {
      steps.push('Re-run realm readiness checklist on turn packs.');
    }
  } else {
    steps.push('Sovereign gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SOVEREIGN_RECOVERY_CAP);
  return {
    sovereignBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Sovereign recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function sovereignRecoveryOrchestratorWithinCap(report: SovereignRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SOVEREIGN_RECOVERY_CAP;
}
