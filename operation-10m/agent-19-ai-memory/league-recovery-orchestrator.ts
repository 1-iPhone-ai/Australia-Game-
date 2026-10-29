import {
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from './match-explainability-league-gate.ts';
import { buildAccordRecoveryOrchestrator } from './accord-recovery-orchestrator.ts';
import { buildMatchExplainabilityAccordBundle } from './match-explainability-accord-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_LEAGUE_RECOVERY_CAP = 10;

export interface LeagueRecoveryOrchestratorReport {
  leagueBlocked: boolean;
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

/** Recovery path when league gate blocks federation rollout. */
export function buildLeagueRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): LeagueRecoveryOrchestratorReport {
  const league = auditMatchExplainabilityLeagueGate(packs, params);
  const leagueBlocked = !matchExplainabilityLeagueAllowed(league);
  const steps: string[] = [];
  if (leagueBlocked) {
    if (!league.accordReady) {
      steps.push('Restore accord bundle: treaty and accord export must pass.');
    }
    if (!league.accordExportShipped) {
      steps.push('Emit session accord export before league clearance.');
    }
    if (!league.treatyAccordHealthy) {
      steps.push('Reconcile treaty/accord bridge before league.');
    }
    steps.push(...buildAccordRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const accord = buildMatchExplainabilityAccordBundle(packs, params);
    if (!accord.accordReady) {
      steps.push('Re-run accord readiness checklist on turn packs.');
    }
  } else {
    steps.push('League gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_LEAGUE_RECOVERY_CAP);
  return {
    leagueBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`League recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function leagueRecoveryOrchestratorWithinCap(report: LeagueRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_LEAGUE_RECOVERY_CAP;
}
