import {
  auditMatchExplainabilitySummitGate,
  matchExplainabilitySummitAllowed,
} from './match-explainability-summit-gate.ts';
import { buildZenithRecoveryOrchestrator } from './zenith-recovery-orchestrator.ts';
import { buildMatchExplainabilityZenithBundle } from './match-explainability-zenith-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SUMMIT_RECOVERY_CAP = 10;

export interface SummitRecoveryOrchestratorReport {
  summitBlocked: boolean;
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

/** Recovery path when summit gate blocks acme rollout. */
export function buildSummitRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SummitRecoveryOrchestratorReport {
  const summit = auditMatchExplainabilitySummitGate(packs, params);
  const summitBlocked = !matchExplainabilitySummitAllowed(summit);
  const steps: string[] = [];
  if (summitBlocked) {
    if (!summit.zenithReady) {
      steps.push('Restore zenith bundle: apex and zenith export must pass.');
    }
    if (!summit.zenithExportShipped) {
      steps.push('Emit session zenith export before summit clearance.');
    }
    if (!summit.apexZenithHealthy) {
      steps.push('Reconcile apex/zenith bridge before summit.');
    }
    steps.push(...buildZenithRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const zenith = buildMatchExplainabilityZenithBundle(packs, params);
    if (!zenith.zenithReady) {
      steps.push('Re-run zenith readiness checklist on turn packs.');
    }
  } else {
    steps.push('Summit gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SUMMIT_RECOVERY_CAP);
  return {
    summitBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Summit recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function summitRecoveryOrchestratorWithinCap(report: SummitRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SUMMIT_RECOVERY_CAP;
}
