import {
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from './match-explainability-relay-gate.ts';
import { buildOrbitRecoveryOrchestrator } from './orbit-recovery-orchestrator.ts';
import { buildMatchExplainabilityTransitBundle } from './match-explainability-transit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_RELAY_RECOVERY_CAP = 10;

export interface RelayRecoveryOrchestratorReport {
  relayBlocked: boolean;
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

/** Recovery path when relay gate blocks beacon rollout. */
export function buildRelayRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): RelayRecoveryOrchestratorReport {
  const relay = auditMatchExplainabilityRelayGate(packs, params);
  const relayBlocked = !matchExplainabilityRelayAllowed(relay);
  const steps: string[] = [];
  if (relayBlocked) {
    if (!relay.transitReady) {
      steps.push('Restore transit bundle: orbit and sustainment export must pass.');
    }
    if (!relay.transitExportShipped) {
      steps.push('Emit session transit export before relay clearance.');
    }
    if (!relay.orbitTransitHealthy) {
      steps.push('Reconcile orbit/transit bridge before relay.');
    }
    steps.push(...buildOrbitRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const transit = buildMatchExplainabilityTransitBundle(packs, params);
    if (!transit.transitReady) {
      steps.push('Re-run transit readiness checklist on turn packs.');
    }
  } else {
    steps.push('Relay gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_RELAY_RECOVERY_CAP);
  return {
    relayBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Relay recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function relayRecoveryOrchestratorWithinCap(report: RelayRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_RELAY_RECOVERY_CAP;
}
