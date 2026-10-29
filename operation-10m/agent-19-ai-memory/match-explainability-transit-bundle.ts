import {
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';
import {
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
import {
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from './session-sustainment-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_TRANSIT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityTransitBundle {
  transitReady: boolean;
  orbitAllowed: boolean;
  sustainmentReady: boolean;
  sustainmentExportShipped: boolean;
  narrativeLines: string[];
}

type TransitParams = {
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

/** Transit bundle: orbit gate and sustainment export must both be green. */
export function buildMatchExplainabilityTransitBundle(
  packs: TurnExplainabilityPack[],
  params: TransitParams,
): MatchExplainabilityTransitBundle {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainExport = buildSessionSustainmentExportBundle(packs, params);
  const orbitAllowed = matchExplainabilityOrbitAllowed(orbit);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const sustainmentExportShipped = sessionSustainmentExportShipped(sustainExport);
  const transitReady = orbitAllowed && sustainmentReady && sustainmentExportShipped;
  const narrativeLines = [
    `Match explainability transit: ${transitReady ? 'READY' : 'PENDING'} (orbit ${orbitAllowed ? 'ok' : 'fail'}, sustain ${sustainmentReady ? 'ok' : 'fail'}).`,
    ...orbit.narrativeLines.slice(0, 2),
    ...sustainment.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_TRANSIT_NARRATIVE_CAP);
  return {
    transitReady,
    orbitAllowed,
    sustainmentReady,
    sustainmentExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityTransitReady(bundle: MatchExplainabilityTransitBundle): boolean {
  return bundle.transitReady;
}
