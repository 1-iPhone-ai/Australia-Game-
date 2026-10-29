import {
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from './match-explainability-pact-gate.ts';
import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
import {
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from './session-charter-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PACT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityPactBundle {
  pactReady: boolean;
  pactAllowed: boolean;
  charterReady: boolean;
  charterExportShipped: boolean;
  narrativeLines: string[];
}

type PactParams = {
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

/** Pact bundle: pact gate and charter export must both be green. */
export function buildMatchExplainabilityPactBundle(
  packs: TurnExplainabilityPack[],
  params: PactParams,
): MatchExplainabilityPactBundle {
  const pact = auditMatchExplainabilityPactGate(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterExport = buildSessionCharterExportBundle(packs, params);
  const pactAllowed = matchExplainabilityPactAllowed(pact);
  const charterReady = matchExplainabilityCharterReady(charter);
  const charterExportShipped = sessionCharterExportShipped(charterExport);
  const pactReady = pactAllowed && charterReady && charterExportShipped;
  const narrativeLines = [
    `Match explainability pact bundle: ${pactReady ? 'READY' : 'PENDING'} (gate ${pactAllowed ? 'ok' : 'fail'}, charter ${charterReady ? 'ok' : 'fail'}).`,
    ...pact.narrativeLines.slice(0, 2),
    ...charter.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_PACT_NARRATIVE_CAP);
  return {
    pactReady,
    pactAllowed,
    charterReady,
    charterExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityPactReady(bundle: MatchExplainabilityPactBundle): boolean {
  return bundle.pactReady;
}
