import {
  auditMatchExplainabilityCrestGate,
  matchExplainabilityCrestAllowed,
} from './match-explainability-crest-gate.ts';
import { buildAcmeRecoveryOrchestrator } from './acme-recovery-orchestrator.ts';
import { buildMatchExplainabilityAcmeBundle } from './match-explainability-acme-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CREST_RECOVERY_CAP = 10;

export interface CrestRecoveryOrchestratorReport {
  crestBlocked: boolean;
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

/** Recovery path when crest gate blocks vertex rollout. */
export function buildCrestRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CrestRecoveryOrchestratorReport {
  const crest = auditMatchExplainabilityCrestGate(packs, params);
  const crestBlocked = !matchExplainabilityCrestAllowed(crest);
  const steps: string[] = [];
  if (crestBlocked) {
    if (!crest.acmeReady) {
      steps.push('Restore acme bundle: summit and acme export must pass.');
    }
    if (!crest.acmeExportShipped) {
      steps.push('Emit session acme export before crest clearance.');
    }
    if (!crest.summitAcmeHealthy) {
      steps.push('Reconcile summit/acme bridge before crest.');
    }
    steps.push(...buildAcmeRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const acme = buildMatchExplainabilityAcmeBundle(packs, params);
    if (!acme.acmeReady) {
      steps.push('Re-run acme readiness checklist on turn packs.');
    }
  } else {
    steps.push('Crest gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CREST_RECOVERY_CAP);
  return {
    crestBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Crest recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function crestRecoveryOrchestratorWithinCap(report: CrestRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CREST_RECOVERY_CAP;
}
