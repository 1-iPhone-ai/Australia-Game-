import {
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from './match-explainability-federation-gate.ts';
import { buildLeagueRecoveryOrchestrator } from './league-recovery-orchestrator.ts';
import { buildMatchExplainabilityLeagueBundle } from './match-explainability-league-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_FEDERATION_RECOVERY_CAP = 10;

export interface FederationRecoveryOrchestratorReport {
  federationBlocked: boolean;
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

/** Recovery path when federation gate blocks union rollout. */
export function buildFederationRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): FederationRecoveryOrchestratorReport {
  const federation = auditMatchExplainabilityFederationGate(packs, params);
  const federationBlocked = !matchExplainabilityFederationAllowed(federation);
  const steps: string[] = [];
  if (federationBlocked) {
    if (!federation.leagueReady) {
      steps.push('Restore league bundle: accord and league export must pass.');
    }
    if (!federation.leagueExportShipped) {
      steps.push('Emit session league export before federation clearance.');
    }
    if (!federation.accordLeagueHealthy) {
      steps.push('Reconcile accord/league bridge before federation.');
    }
    steps.push(...buildLeagueRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const league = buildMatchExplainabilityLeagueBundle(packs, params);
    if (!league.leagueReady) {
      steps.push('Re-run league readiness checklist on turn packs.');
    }
  } else {
    steps.push('Federation gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_FEDERATION_RECOVERY_CAP);
  return {
    federationBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Federation recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function federationRecoveryOrchestratorWithinCap(report: FederationRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_FEDERATION_RECOVERY_CAP;
}
