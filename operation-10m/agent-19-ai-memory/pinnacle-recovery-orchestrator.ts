import {
  auditMatchExplainabilityPinnacleGate,
  matchExplainabilityPinnacleAllowed,
} from './match-explainability-pinnacle-gate.ts';
import { buildParamountRecoveryOrchestrator } from './paramount-recovery-orchestrator.ts';
import { buildMatchExplainabilityParamountBundle } from './match-explainability-paramount-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PINNACLE_RECOVERY_CAP = 10;

export interface PinnacleRecoveryOrchestratorReport {
  pinnacleBlocked: boolean;
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

/** Recovery path when pinnacle gate blocks apex rollout. */
export function buildPinnacleRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): PinnacleRecoveryOrchestratorReport {
  const pinnacle = auditMatchExplainabilityPinnacleGate(packs, params);
  const pinnacleBlocked = !matchExplainabilityPinnacleAllowed(pinnacle);
  const steps: string[] = [];
  if (pinnacleBlocked) {
    if (!pinnacle.paramountReady) {
      steps.push('Restore paramount bundle: preeminence and paramount export must pass.');
    }
    if (!pinnacle.paramountExportShipped) {
      steps.push('Emit session paramount export before pinnacle clearance.');
    }
    if (!pinnacle.preeminenceParamountHealthy) {
      steps.push('Reconcile preeminence/paramount bridge before pinnacle.');
    }
    steps.push(...buildParamountRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const paramount = buildMatchExplainabilityParamountBundle(packs, params);
    if (!paramount.paramountReady) {
      steps.push('Re-run paramount readiness checklist on turn packs.');
    }
  } else {
    steps.push('Pinnacle gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PINNACLE_RECOVERY_CAP);
  return {
    pinnacleBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Pinnacle recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function pinnacleRecoveryOrchestratorWithinCap(report: PinnacleRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PINNACLE_RECOVERY_CAP;
}
