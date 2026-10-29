import {
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from './match-explainability-charter-gate.ts';
import { buildCovenantRecoveryOrchestrator } from './covenant-recovery-orchestrator.ts';
import { buildMatchExplainabilityCovenantBundle } from './match-explainability-covenant-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CHARTER_RECOVERY_CAP = 10;

export interface CharterRecoveryOrchestratorReport {
  charterBlocked: boolean;
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

/** Recovery path when charter gate blocks pact rollout. */
export function buildCharterRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CharterRecoveryOrchestratorReport {
  const charter = auditMatchExplainabilityCharterGate(packs, params);
  const charterBlocked = !matchExplainabilityCharterAllowed(charter);
  const steps: string[] = [];
  if (charterBlocked) {
    if (!charter.covenantReady) {
      steps.push('Restore covenant bundle: seal and covenant export must pass.');
    }
    if (!charter.covenantExportShipped) {
      steps.push('Emit session covenant export before charter clearance.');
    }
    if (!charter.sealCovenantHealthy) {
      steps.push('Reconcile seal/covenant bridge before charter.');
    }
    steps.push(...buildCovenantRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
    if (!covenant.covenantReady) {
      steps.push('Re-run covenant readiness checklist on turn packs.');
    }
  } else {
    steps.push('Charter gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CHARTER_RECOVERY_CAP);
  return {
    charterBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Charter recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function charterRecoveryOrchestratorWithinCap(report: CharterRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CHARTER_RECOVERY_CAP;
}
