import {
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
import {
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from './session-sustainment-export-bundle.ts';
import {
  auditFleetSustainmentBridge,
  fleetSustainmentBridgeHealthy,
} from './fleet-sustainment-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityOrbitGateReport {
  orbitAllowed: boolean;
  sustainmentReady: boolean;
  sustainmentExportShipped: boolean;
  fleetSustainmentHealthy: boolean;
  narrativeLines: string[];
}

/** Orbit gate: sustainment bundle + sustainment export + fleet/sustainment bridge. */
export function auditMatchExplainabilityOrbitGate(
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
): MatchExplainabilityOrbitGateReport {
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainExport = buildSessionSustainmentExportBundle(packs, params);
  const bridge = auditFleetSustainmentBridge(packs, params);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const sustainmentExportShipped = sessionSustainmentExportShipped(sustainExport);
  const fleetSustainmentHealthy = fleetSustainmentBridgeHealthy(bridge);
  const orbitAllowed = sustainmentReady && sustainmentExportShipped && fleetSustainmentHealthy;
  const narrativeLines = [
    `Match explainability orbit: ${orbitAllowed ? 'ALLOWED' : 'DENIED'} (sustain ${sustainmentReady ? 'ok' : 'fail'}, export ${sustainmentExportShipped ? 'ok' : 'fail'}).`,
    ...sustainment.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    orbitAllowed,
    sustainmentReady,
    sustainmentExportShipped,
    fleetSustainmentHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityOrbitAllowed(report: MatchExplainabilityOrbitGateReport): boolean {
  return report.orbitAllowed;
}
