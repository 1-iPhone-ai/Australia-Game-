import {
  auditMatchExplainabilityAcmeGate,
  matchExplainabilityAcmeAllowed,
} from './match-explainability-acme-gate.ts';
import { buildSummitRecoveryOrchestrator } from './summit-recovery-orchestrator.ts';
import { buildMatchExplainabilitySummitBundle } from './match-explainability-summit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACME_RECOVERY_CAP = 10;

export interface AcmeRecoveryOrchestratorReport {
  acmeBlocked: boolean;
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

/** Recovery path when acme gate blocks crest rollout. */
export function buildAcmeRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AcmeRecoveryOrchestratorReport {
  const acme = auditMatchExplainabilityAcmeGate(packs, params);
  const acmeBlocked = !matchExplainabilityAcmeAllowed(acme);
  const steps: string[] = [];
  if (acmeBlocked) {
    if (!acme.summitReady) {
      steps.push('Restore summit bundle: zenith and summit export must pass.');
    }
    if (!acme.summitExportShipped) {
      steps.push('Emit session summit export before acme clearance.');
    }
    if (!acme.zenithSummitHealthy) {
      steps.push('Reconcile zenith/summit bridge before acme.');
    }
    steps.push(...buildSummitRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const summit = buildMatchExplainabilitySummitBundle(packs, params);
    if (!summit.summitReady) {
      steps.push('Re-run summit readiness checklist on turn packs.');
    }
  } else {
    steps.push('Acme gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ACME_RECOVERY_CAP);
  return {
    acmeBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Acme recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function acmeRecoveryOrchestratorWithinCap(report: AcmeRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ACME_RECOVERY_CAP;
}
