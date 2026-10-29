import {
  auditMatchExplainabilityImperialGate,
  matchExplainabilityImperialAllowed,
} from './match-explainability-imperial-gate.ts';
import {
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
import {
  buildSessionSovereignExportBundle,
  sessionSovereignExportShipped,
} from './session-sovereign-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_IMPERIAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilityImperialBundle {
  imperialReady: boolean;
  imperialAllowed: boolean;
  sovereignReady: boolean;
  sovereignExportShipped: boolean;
  narrativeLines: string[];
}

type ImperialParams = {
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

/** Imperial bundle: imperial gate and sovereign export must both be green. */
export function buildMatchExplainabilityImperialBundle(
  packs: TurnExplainabilityPack[],
  params: ImperialParams,
): MatchExplainabilityImperialBundle {
  const imperial = auditMatchExplainabilityImperialGate(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignExport = buildSessionSovereignExportBundle(packs, params);
  const imperialAllowed = matchExplainabilityImperialAllowed(imperial);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const sovereignExportShipped = sessionSovereignExportShipped(sovereignExport);
  const imperialReady = imperialAllowed && sovereignReady && sovereignExportShipped;
  const narrativeLines = [
    `Match explainability imperial bundle: ${imperialReady ? 'READY' : 'PENDING'} (gate ${imperialAllowed ? 'ok' : 'fail'}, sovereign ${sovereignReady ? 'ok' : 'fail'}).`,
    ...imperial.narrativeLines.slice(0, 2),
    ...sovereign.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_IMPERIAL_NARRATIVE_CAP);
  return {
    imperialReady,
    imperialAllowed,
    sovereignReady,
    sovereignExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityImperialReady(bundle: MatchExplainabilityImperialBundle): boolean {
  return bundle.imperialReady;
}
