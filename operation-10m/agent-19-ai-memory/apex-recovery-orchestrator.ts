import {
  auditMatchExplainabilityApexGate,
  matchExplainabilityApexAllowed,
} from './match-explainability-apex-gate.ts';
import { buildPinnacleRecoveryOrchestrator } from './pinnacle-recovery-orchestrator.ts';
import { buildMatchExplainabilityPinnacleBundle } from './match-explainability-pinnacle-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_APEX_RECOVERY_CAP = 10;

export interface ApexRecoveryOrchestratorReport {
  apexBlocked: boolean;
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

/** Recovery path when apex gate blocks zenith rollout. */
export function buildApexRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ApexRecoveryOrchestratorReport {
  const apex = auditMatchExplainabilityApexGate(packs, params);
  const apexBlocked = !matchExplainabilityApexAllowed(apex);
  const steps: string[] = [];
  if (apexBlocked) {
    if (!apex.pinnacleReady) {
      steps.push('Restore pinnacle bundle: paramount and pinnacle export must pass.');
    }
    if (!apex.pinnacleExportShipped) {
      steps.push('Emit session pinnacle export before apex clearance.');
    }
    if (!apex.paramountPinnacleHealthy) {
      steps.push('Reconcile paramount/pinnacle bridge before apex.');
    }
    steps.push(...buildPinnacleRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
    if (!pinnacle.pinnacleReady) {
      steps.push('Re-run pinnacle readiness checklist on turn packs.');
    }
  } else {
    steps.push('Apex gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_APEX_RECOVERY_CAP);
  return {
    apexBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Apex recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function apexRecoveryOrchestratorWithinCap(report: ApexRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_APEX_RECOVERY_CAP;
}
