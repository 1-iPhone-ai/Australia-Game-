import {
  auditMatchExplainabilityLatticeGate,
  matchExplainabilityLatticeAllowed,
} from './match-explainability-lattice-gate.ts';
import {
  buildMatchExplainabilitySynthesisBundle,
  matchExplainabilitySynthesisReady,
} from './match-explainability-projection-bundle.ts';
import {
  buildSessionSynthesisExportBundle,
  sessionSynthesisExportShipped,
} from './session-projection-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySynthesisBundle {
  synthesisReady: boolean;
  synthesisAllowed: boolean;
  projectionReady: boolean;
  projectionExportShipped: boolean;
  narrativeLines: string[];
}

type SynthesisParams = {
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

/** Synthesis bundle: synthesis gate and projection export must both be green. */
export function buildMatchExplainabilitySynthesisBundle(
  packs: TurnExplainabilityPack[],
  params: SynthesisParams,
): MatchExplainabilitySynthesisBundle {
  const synthesis = auditMatchExplainabilityLatticeGate(packs, params);
  const projection = buildMatchExplainabilitySynthesisBundle(packs, params);
  const projectionExport = buildSessionSynthesisExportBundle(packs, params);
  const synthesisAllowed = matchExplainabilityLatticeAllowed(synthesis);
  const projectionReady = matchExplainabilitySynthesisReady(projection);
  const projectionExportShipped = sessionSynthesisExportShipped(projectionExport);
  const synthesisReady = synthesisAllowed && projectionReady && projectionExportShipped;
  const narrativeLines = [
    `Match explainability synthesis bundle: ${synthesisReady ? 'READY' : 'PENDING'} (gate ${synthesisAllowed ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
    ...synthesis.narrativeLines.slice(0, 2),
    ...projection.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONVERGENCE_NARRATIVE_CAP);
  return {
    synthesisReady,
    synthesisAllowed,
    projectionReady,
    projectionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySynthesisReady(bundle: MatchExplainabilitySynthesisBundle): boolean {
  return bundle.synthesisReady;
}
