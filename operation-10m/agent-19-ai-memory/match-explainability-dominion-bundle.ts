import {
  auditMatchExplainabilityDominionGate,
  matchExplainabilityDominionAllowed,
} from './match-explainability-dominion-gate.ts';
import {
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
import {
  buildSessionImperialExportBundle,
  sessionImperialExportShipped,
} from './session-imperial-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_DOMINION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityDominionBundle {
  dominionReady: boolean;
  dominionAllowed: boolean;
  imperialReady: boolean;
  imperialExportShipped: boolean;
  narrativeLines: string[];
}

type DominionParams = {
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

/** Dominion bundle: dominion gate and imperial export must both be green. */
export function buildMatchExplainabilityDominionBundle(
  packs: TurnExplainabilityPack[],
  params: DominionParams,
): MatchExplainabilityDominionBundle {
  const dominion = auditMatchExplainabilityDominionGate(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialExport = buildSessionImperialExportBundle(packs, params);
  const dominionAllowed = matchExplainabilityDominionAllowed(dominion);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const imperialExportShipped = sessionImperialExportShipped(imperialExport);
  const dominionReady = dominionAllowed && imperialReady && imperialExportShipped;
  const narrativeLines = [
    `Match explainability dominion bundle: ${dominionReady ? 'READY' : 'PENDING'} (gate ${dominionAllowed ? 'ok' : 'fail'}, imperial ${imperialReady ? 'ok' : 'fail'}).`,
    ...dominion.narrativeLines.slice(0, 2),
    ...imperial.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_DOMINION_NARRATIVE_CAP);
  return {
    dominionReady,
    dominionAllowed,
    imperialReady,
    imperialExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityDominionReady(bundle: MatchExplainabilityDominionBundle): boolean {
  return bundle.dominionReady;
}
