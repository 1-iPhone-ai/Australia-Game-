import {
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from './match-explainability-charter-gate.ts';
import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
import {
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from './session-covenant-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CHARTER_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCharterBundle {
  charterReady: boolean;
  charterAllowed: boolean;
  covenantReady: boolean;
  covenantExportShipped: boolean;
  narrativeLines: string[];
}

type CharterParams = {
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

/** Charter bundle: charter gate and covenant export must both be green. */
export function buildMatchExplainabilityCharterBundle(
  packs: TurnExplainabilityPack[],
  params: CharterParams,
): MatchExplainabilityCharterBundle {
  const charter = auditMatchExplainabilityCharterGate(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantExport = buildSessionCovenantExportBundle(packs, params);
  const charterAllowed = matchExplainabilityCharterAllowed(charter);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const covenantExportShipped = sessionCovenantExportShipped(covenantExport);
  const charterReady = charterAllowed && covenantReady && covenantExportShipped;
  const narrativeLines = [
    `Match explainability charter bundle: ${charterReady ? 'READY' : 'PENDING'} (gate ${charterAllowed ? 'ok' : 'fail'}, covenant ${covenantReady ? 'ok' : 'fail'}).`,
    ...charter.narrativeLines.slice(0, 2),
    ...covenant.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CHARTER_NARRATIVE_CAP);
  return {
    charterReady,
    charterAllowed,
    covenantReady,
    covenantExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCharterReady(bundle: MatchExplainabilityCharterBundle): boolean {
  return bundle.charterReady;
}
