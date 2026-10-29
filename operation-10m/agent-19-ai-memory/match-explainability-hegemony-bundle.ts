import {
  auditMatchExplainabilityHegemonyGate,
  matchExplainabilityHegemonyAllowed,
} from './match-explainability-hegemony-gate.ts';
import {
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
import {
  buildSessionDominionExportBundle,
  sessionDominionExportShipped,
} from './session-dominion-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_HEGEMONY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityHegemonyBundle {
  hegemonyReady: boolean;
  hegemonyAllowed: boolean;
  dominionReady: boolean;
  dominionExportShipped: boolean;
  narrativeLines: string[];
}

type HegemonyParams = {
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

/** Hegemony bundle: hegemony gate and dominion export must both be green. */
export function buildMatchExplainabilityHegemonyBundle(
  packs: TurnExplainabilityPack[],
  params: HegemonyParams,
): MatchExplainabilityHegemonyBundle {
  const hegemony = auditMatchExplainabilityHegemonyGate(packs, params);
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const dominionExport = buildSessionDominionExportBundle(packs, params);
  const hegemonyAllowed = matchExplainabilityHegemonyAllowed(hegemony);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const dominionExportShipped = sessionDominionExportShipped(dominionExport);
  const hegemonyReady = hegemonyAllowed && dominionReady && dominionExportShipped;
  const narrativeLines = [
    `Match explainability hegemony bundle: ${hegemonyReady ? 'READY' : 'PENDING'} (gate ${hegemonyAllowed ? 'ok' : 'fail'}, dominion ${dominionReady ? 'ok' : 'fail'}).`,
    ...hegemony.narrativeLines.slice(0, 2),
    ...dominion.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_HEGEMONY_NARRATIVE_CAP);
  return {
    hegemonyReady,
    hegemonyAllowed,
    dominionReady,
    dominionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityHegemonyReady(bundle: MatchExplainabilityHegemonyBundle): boolean {
  return bundle.hegemonyReady;
}
