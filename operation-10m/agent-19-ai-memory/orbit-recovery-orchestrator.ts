import {
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';
import { buildFleetRecoveryOrchestrator } from './fleet-recovery-orchestrator.ts';
import { buildMatchExplainabilitySustainmentBundle } from './match-explainability-sustainment-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ORBIT_RECOVERY_CAP = 10;

export interface OrbitRecoveryOrchestratorReport {
  orbitBlocked: boolean;
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

/** Recovery path when orbit gate blocks relay rollout. */
export function buildOrbitRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): OrbitRecoveryOrchestratorReport {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const orbitBlocked = !matchExplainabilityOrbitAllowed(orbit);
  const steps: string[] = [];
  if (orbitBlocked) {
    if (!orbit.sustainmentReady) {
      steps.push('Restore sustainment bundle: fleet and deployment export must pass.');
    }
    if (!orbit.sustainmentExportShipped) {
      steps.push('Emit session sustainment export before orbit clearance.');
    }
    if (!orbit.fleetSustainmentHealthy) {
      steps.push('Reconcile fleet/sustainment bridge before orbit.');
    }
    steps.push(...buildFleetRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
    if (!sustainment.sustainmentReady) {
      steps.push('Re-run sustainment readiness checklist on turn packs.');
    }
  } else {
    steps.push('Orbit gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ORBIT_RECOVERY_CAP);
  return {
    orbitBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Orbit recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function orbitRecoveryOrchestratorWithinCap(report: OrbitRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ORBIT_RECOVERY_CAP;
}
