import {
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';
import {
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface FleetSustainmentBridgeReport {
  aligned: boolean;
  fleetAllowed: boolean;
  sustainmentReady: boolean;
  narrativeLines: string[];
}

/** Fleet-allowed should match sustainment-ready when export stack passes. */
export function auditFleetSustainmentBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): FleetSustainmentBridgeReport {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const fleetAllowed = matchExplainabilityFleetAllowed(fleet);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const aligned = fleetAllowed === sustainmentReady;
  const narrativeLines = [
    `Fleet/sustainment bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (fleet ${fleetAllowed ? 'ok' : 'fail'}, sustainment ${sustainmentReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, fleetAllowed, sustainmentReady, narrativeLines };
}

export function fleetSustainmentBridgeHealthy(report: FleetSustainmentBridgeReport): boolean {
  return report.fleetAllowed && report.sustainmentReady && report.aligned;
}
