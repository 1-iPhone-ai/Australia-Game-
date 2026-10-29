import {
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from './match-explainability-beacon-gate.ts';
import { buildRelayRecoveryOrchestrator } from './relay-recovery-orchestrator.ts';
import { buildMatchExplainabilityRelayBundle } from './match-explainability-relay-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_BEACON_RECOVERY_CAP = 10;

export interface BeaconRecoveryOrchestratorReport {
  beaconBlocked: boolean;
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

/** Recovery path when beacon gate blocks signal rollout. */
export function buildBeaconRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): BeaconRecoveryOrchestratorReport {
  const beacon = auditMatchExplainabilityBeaconGate(packs, params);
  const beaconBlocked = !matchExplainabilityBeaconAllowed(beacon);
  const steps: string[] = [];
  if (beaconBlocked) {
    if (!beacon.relayReady) {
      steps.push('Restore relay bundle: transit and relay export must pass.');
    }
    if (!beacon.relayExportShipped) {
      steps.push('Emit session relay export before beacon clearance.');
    }
    if (!beacon.relayTransitHealthy) {
      steps.push('Reconcile relay/transit bridge before beacon.');
    }
    steps.push(...buildRelayRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const relay = buildMatchExplainabilityRelayBundle(packs, params);
    if (!relay.relayReady) {
      steps.push('Re-run relay readiness checklist on turn packs.');
    }
  } else {
    steps.push('Beacon gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_BEACON_RECOVERY_CAP);
  return {
    beaconBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Beacon recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function beaconRecoveryOrchestratorWithinCap(report: BeaconRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_BEACON_RECOVERY_CAP;
}
