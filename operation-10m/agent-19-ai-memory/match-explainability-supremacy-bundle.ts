import {
  auditMatchExplainabilitySupremacyGate,
  matchExplainabilitySupremacyAllowed,
} from './match-explainability-supremacy-gate.ts';
import {
  buildMatchExplainabilityHegemonyBundle,
  matchExplainabilityHegemonyReady,
} from './match-explainability-hegemony-bundle.ts';
import {
  buildSessionHegemonyExportBundle,
  sessionHegemonyExportShipped,
} from './session-hegemony-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SUPREMACY_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySupremacyBundle {
  supremacyReady: boolean;
  supremacyAllowed: boolean;
  hegemonyReady: boolean;
  hegemonyExportShipped: boolean;
  narrativeLines: string[];
}

type SupremacyParams = {
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

/** Supremacy bundle: supremacy gate and hegemony export must both be green. */
export function buildMatchExplainabilitySupremacyBundle(
  packs: TurnExplainabilityPack[],
  params: SupremacyParams,
): MatchExplainabilitySupremacyBundle {
  const supremacy = auditMatchExplainabilitySupremacyGate(packs, params);
  const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
  const hegemonyExport = buildSessionHegemonyExportBundle(packs, params);
  const supremacyAllowed = matchExplainabilitySupremacyAllowed(supremacy);
  const hegemonyReady = matchExplainabilityHegemonyReady(hegemony);
  const hegemonyExportShipped = sessionHegemonyExportShipped(hegemonyExport);
  const supremacyReady = supremacyAllowed && hegemonyReady && hegemonyExportShipped;
  const narrativeLines = [
    `Match explainability supremacy bundle: ${supremacyReady ? 'READY' : 'PENDING'} (gate ${supremacyAllowed ? 'ok' : 'fail'}, hegemony ${hegemonyReady ? 'ok' : 'fail'}).`,
    ...supremacy.narrativeLines.slice(0, 2),
    ...hegemony.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SUPREMACY_NARRATIVE_CAP);
  return {
    supremacyReady,
    supremacyAllowed,
    hegemonyReady,
    hegemonyExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySupremacyReady(bundle: MatchExplainabilitySupremacyBundle): boolean {
  return bundle.supremacyReady;
}
