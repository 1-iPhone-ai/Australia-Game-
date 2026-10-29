import {
  auditMatchExplainabilityDominionGate,
  matchExplainabilityDominionAllowed,
} from './match-explainability-dominion-gate.ts';
import { buildImperialRecoveryOrchestrator } from './imperial-recovery-orchestrator.ts';
import { buildMatchExplainabilityImperialBundle } from './match-explainability-imperial-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_DOMINION_RECOVERY_CAP = 10;

export interface DominionRecoveryOrchestratorReport {
  dominionBlocked: boolean;
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

/** Recovery path when dominion gate blocks hegemony rollout. */
export function buildDominionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): DominionRecoveryOrchestratorReport {
  const dominion = auditMatchExplainabilityDominionGate(packs, params);
  const dominionBlocked = !matchExplainabilityDominionAllowed(dominion);
  const steps: string[] = [];
  if (dominionBlocked) {
    if (!dominion.imperialReady) {
      steps.push('Restore imperial bundle: sovereign and imperial export must pass.');
    }
    if (!dominion.imperialExportShipped) {
      steps.push('Emit session imperial export before dominion clearance.');
    }
    if (!dominion.sovereignImperialHealthy) {
      steps.push('Reconcile sovereign/imperial bridge before dominion.');
    }
    steps.push(...buildImperialRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const imperial = buildMatchExplainabilityImperialBundle(packs, params);
    if (!imperial.imperialReady) {
      steps.push('Re-run imperial readiness checklist on turn packs.');
    }
  } else {
    steps.push('Dominion gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_DOMINION_RECOVERY_CAP);
  return {
    dominionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Dominion recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function dominionRecoveryOrchestratorWithinCap(report: DominionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_DOMINION_RECOVERY_CAP;
}
