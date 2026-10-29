import {
  auditMatchExplainabilityCrestGate,
  matchExplainabilityCrestAllowed,
} from './match-explainability-crest-gate.ts';
import {
  buildMatchExplainabilityAcmeBundle,
  matchExplainabilityAcmeReady,
} from './match-explainability-acme-bundle.ts';
import {
  buildSessionAcmeExportBundle,
  sessionAcmeExportShipped,
} from './session-acme-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CREST_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCrestBundle {
  crestReady: boolean;
  crestAllowed: boolean;
  acmeReady: boolean;
  acmeExportShipped: boolean;
  narrativeLines: string[];
}

type CrestParams = {
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

/** Crest bundle: crest gate and acme export must both be green. */
export function buildMatchExplainabilityCrestBundle(
  packs: TurnExplainabilityPack[],
  params: CrestParams,
): MatchExplainabilityCrestBundle {
  const crest = auditMatchExplainabilityCrestGate(packs, params);
  const acme = buildMatchExplainabilityAcmeBundle(packs, params);
  const acmeExport = buildSessionAcmeExportBundle(packs, params);
  const crestAllowed = matchExplainabilityCrestAllowed(crest);
  const acmeReady = matchExplainabilityAcmeReady(acme);
  const acmeExportShipped = sessionAcmeExportShipped(acmeExport);
  const crestReady = crestAllowed && acmeReady && acmeExportShipped;
  const narrativeLines = [
    `Match explainability crest bundle: ${crestReady ? 'READY' : 'PENDING'} (gate ${crestAllowed ? 'ok' : 'fail'}, acme ${acmeReady ? 'ok' : 'fail'}).`,
    ...crest.narrativeLines.slice(0, 2),
    ...acme.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CREST_NARRATIVE_CAP);
  return {
    crestReady,
    crestAllowed,
    acmeReady,
    acmeExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCrestReady(bundle: MatchExplainabilityCrestBundle): boolean {
  return bundle.crestReady;
}
