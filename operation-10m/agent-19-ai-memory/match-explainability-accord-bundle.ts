import {
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from './match-explainability-accord-gate.ts';
import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
import {
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from './session-treaty-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACCORD_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAccordBundle {
  accordReady: boolean;
  accordAllowed: boolean;
  treatyReady: boolean;
  treatyExportShipped: boolean;
  narrativeLines: string[];
}

type AccordParams = {
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

/** Accord bundle: accord gate and treaty export must both be green. */
export function buildMatchExplainabilityAccordBundle(
  packs: TurnExplainabilityPack[],
  params: AccordParams,
): MatchExplainabilityAccordBundle {
  const accord = auditMatchExplainabilityAccordGate(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyExport = buildSessionTreatyExportBundle(packs, params);
  const accordAllowed = matchExplainabilityAccordAllowed(accord);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const treatyExportShipped = sessionTreatyExportShipped(treatyExport);
  const accordReady = accordAllowed && treatyReady && treatyExportShipped;
  const narrativeLines = [
    `Match explainability accord bundle: ${accordReady ? 'READY' : 'PENDING'} (gate ${accordAllowed ? 'ok' : 'fail'}, treaty ${treatyReady ? 'ok' : 'fail'}).`,
    ...accord.narrativeLines.slice(0, 2),
    ...treaty.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ACCORD_NARRATIVE_CAP);
  return {
    accordReady,
    accordAllowed,
    treatyReady,
    treatyExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAccordReady(bundle: MatchExplainabilityAccordBundle): boolean {
  return bundle.accordReady;
}
