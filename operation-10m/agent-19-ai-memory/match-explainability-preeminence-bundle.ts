import {
  auditMatchExplainabilityPreeminenceGate,
  matchExplainabilityPreeminenceAllowed,
} from './match-explainability-preeminence-gate.ts';
import {
  buildMatchExplainabilityAscendancyBundle,
  matchExplainabilityAscendancyReady,
} from './match-explainability-ascendancy-bundle.ts';
import {
  buildSessionAscendancyExportBundle,
  sessionAscendancyExportShipped,
} from './session-ascendancy-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PREEMINENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityPreeminenceBundle {
  preeminenceReady: boolean;
  preeminenceAllowed: boolean;
  ascendancyReady: boolean;
  ascendancyExportShipped: boolean;
  narrativeLines: string[];
}

type PreeminenceParams = {
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

/** Preeminence bundle: preeminence gate and ascendancy export must both be green. */
export function buildMatchExplainabilityPreeminenceBundle(
  packs: TurnExplainabilityPack[],
  params: PreeminenceParams,
): MatchExplainabilityPreeminenceBundle {
  const preeminence = auditMatchExplainabilityPreeminenceGate(packs, params);
  const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
  const ascendancyExport = buildSessionAscendancyExportBundle(packs, params);
  const preeminenceAllowed = matchExplainabilityPreeminenceAllowed(preeminence);
  const ascendancyReady = matchExplainabilityAscendancyReady(ascendancy);
  const ascendancyExportShipped = sessionAscendancyExportShipped(ascendancyExport);
  const preeminenceReady = preeminenceAllowed && ascendancyReady && ascendancyExportShipped;
  const narrativeLines = [
    `Match explainability preeminence bundle: ${preeminenceReady ? 'READY' : 'PENDING'} (gate ${preeminenceAllowed ? 'ok' : 'fail'}, ascendancy ${ascendancyReady ? 'ok' : 'fail'}).`,
    ...preeminence.narrativeLines.slice(0, 2),
    ...ascendancy.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_PREEMINENCE_NARRATIVE_CAP);
  return {
    preeminenceReady,
    preeminenceAllowed,
    ascendancyReady,
    ascendancyExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityPreeminenceReady(bundle: MatchExplainabilityPreeminenceBundle): boolean {
  return bundle.preeminenceReady;
}
