import {
  auditMatchExplainabilityImperialGate,
  matchExplainabilityImperialAllowed,
} from './match-explainability-imperial-gate.ts';
import { buildSovereignRecoveryOrchestrator } from './sovereign-recovery-orchestrator.ts';
import { buildMatchExplainabilitySovereignBundle } from './match-explainability-sovereign-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_IMPERIAL_RECOVERY_CAP = 10;

export interface ImperialRecoveryOrchestratorReport {
  imperialBlocked: boolean;
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

/** Recovery path when imperial gate blocks dominion rollout. */
export function buildImperialRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ImperialRecoveryOrchestratorReport {
  const imperial = auditMatchExplainabilityImperialGate(packs, params);
  const imperialBlocked = !matchExplainabilityImperialAllowed(imperial);
  const steps: string[] = [];
  if (imperialBlocked) {
    if (!imperial.sovereignReady) {
      steps.push('Restore sovereign bundle: realm and sovereign export must pass.');
    }
    if (!imperial.sovereignExportShipped) {
      steps.push('Emit session sovereign export before imperial clearance.');
    }
    if (!imperial.realmSovereignHealthy) {
      steps.push('Reconcile realm/sovereign bridge before imperial.');
    }
    steps.push(...buildSovereignRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
    if (!sovereign.sovereignReady) {
      steps.push('Re-run sovereign readiness checklist on turn packs.');
    }
  } else {
    steps.push('Imperial gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_IMPERIAL_RECOVERY_CAP);
  return {
    imperialBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Imperial recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function imperialRecoveryOrchestratorWithinCap(report: ImperialRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_IMPERIAL_RECOVERY_CAP;
}
