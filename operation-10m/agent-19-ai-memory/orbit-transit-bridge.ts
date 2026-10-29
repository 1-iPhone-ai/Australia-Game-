import {
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';
import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface OrbitTransitBridgeReport {
  aligned: boolean;
  orbitAllowed: boolean;
  transitReady: boolean;
  narrativeLines: string[];
}

/** Orbit-allowed should match transit-ready when sustainment export stack passes. */
export function auditOrbitTransitBridge(
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
): OrbitTransitBridgeReport {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const orbitAllowed = matchExplainabilityOrbitAllowed(orbit);
  const transitReady = matchExplainabilityTransitReady(transit);
  const aligned = orbitAllowed === transitReady;
  const narrativeLines = [
    `Orbit/transit bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (orbit ${orbitAllowed ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, orbitAllowed, transitReady, narrativeLines };
}

export function orbitTransitBridgeHealthy(report: OrbitTransitBridgeReport): boolean {
  return report.orbitAllowed && report.transitReady && report.aligned;
}
