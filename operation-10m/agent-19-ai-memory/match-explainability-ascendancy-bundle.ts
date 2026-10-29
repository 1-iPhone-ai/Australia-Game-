import {
  auditMatchExplainabilityAscendancyGate,
  matchExplainabilityAscendancyAllowed,
} from './match-explainability-ascendancy-gate.ts';
import {
  buildMatchExplainabilitySupremacyBundle,
  matchExplainabilitySupremacyReady,
} from './match-explainability-supremacy-bundle.ts';
import {
  buildSessionSupremacyExportBundle,
  sessionSupremacyExportShipped,
} from './session-supremacy-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ASCENDANCY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAscendancyBundle {
  ascendancyReady: boolean;
  ascendancyAllowed: boolean;
  supremacyReady: boolean;
  supremacyExportShipped: boolean;
  narrativeLines: string[];
}

type AscendancyParams = {
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

/** Ascendancy bundle: ascendancy gate and supremacy export must both be green. */
export function buildMatchExplainabilityAscendancyBundle(
  packs: TurnExplainabilityPack[],
  params: AscendancyParams,
): MatchExplainabilityAscendancyBundle {
  const ascendancy = auditMatchExplainabilityAscendancyGate(packs, params);
  const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
  const supremacyExport = buildSessionSupremacyExportBundle(packs, params);
  const ascendancyAllowed = matchExplainabilityAscendancyAllowed(ascendancy);
  const supremacyReady = matchExplainabilitySupremacyReady(supremacy);
  const supremacyExportShipped = sessionSupremacyExportShipped(supremacyExport);
  const ascendancyReady = ascendancyAllowed && supremacyReady && supremacyExportShipped;
  const narrativeLines = [
    `Match explainability ascendancy bundle: ${ascendancyReady ? 'READY' : 'PENDING'} (gate ${ascendancyAllowed ? 'ok' : 'fail'}, supremacy ${supremacyReady ? 'ok' : 'fail'}).`,
    ...ascendancy.narrativeLines.slice(0, 2),
    ...supremacy.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ASCENDANCY_NARRATIVE_CAP);
  return {
    ascendancyReady,
    ascendancyAllowed,
    supremacyReady,
    supremacyExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAscendancyReady(bundle: MatchExplainabilityAscendancyBundle): boolean {
  return bundle.ascendancyReady;
}
