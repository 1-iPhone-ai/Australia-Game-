import {
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';
import { buildProductionRecoveryOrchestrator } from './production-recovery-orchestrator.ts';
import { buildMatchExplainabilityDeploymentBundle } from './match-explainability-deployment-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_FLEET_RECOVERY_CAP = 10;

export interface FleetRecoveryOrchestratorReport {
  fleetBlocked: boolean;
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

/** Recovery path when fleet gate blocks sustainment rollout. */
export function buildFleetRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): FleetRecoveryOrchestratorReport {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const fleetBlocked = !matchExplainabilityFleetAllowed(fleet);
  const steps: string[] = [];
  if (fleetBlocked) {
    if (!fleet.deploymentReady) {
      steps.push('Restore deployment bundle: production and operations must pass.');
    }
    if (!fleet.deploymentExportShipped) {
      steps.push('Emit session deployment export before fleet rollout.');
    }
    if (!fleet.opsProductionHealthy) {
      steps.push('Reconcile operations/production bridge before fleet.');
    }
    steps.push(...buildProductionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const deploy = buildMatchExplainabilityDeploymentBundle(packs, params);
    if (!deploy.deploymentReady) {
      steps.push('Re-run deployment readiness checklist on turn packs.');
    }
  } else {
    steps.push('Fleet gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_FLEET_RECOVERY_CAP);
  return {
    fleetBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Fleet recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function fleetRecoveryOrchestratorWithinCap(report: FleetRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_FLEET_RECOVERY_CAP;
}
