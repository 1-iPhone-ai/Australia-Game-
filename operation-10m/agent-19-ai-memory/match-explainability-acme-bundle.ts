import {
  auditMatchExplainabilityAcmeGate,
  matchExplainabilityAcmeAllowed,
} from './match-explainability-acme-gate.ts';
import {
  buildMatchExplainabilitySummitBundle,
  matchExplainabilitySummitReady,
} from './match-explainability-summit-bundle.ts';
import {
  buildSessionSummitExportBundle,
  sessionSummitExportShipped,
} from './session-summit-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACME_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAcmeBundle {
  acmeReady: boolean;
  acmeAllowed: boolean;
  summitReady: boolean;
  summitExportShipped: boolean;
  narrativeLines: string[];
}

type AcmeParams = {
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

/** Acme bundle: acme gate and summit export must both be green. */
export function buildMatchExplainabilityAcmeBundle(
  packs: TurnExplainabilityPack[],
  params: AcmeParams,
): MatchExplainabilityAcmeBundle {
  const acme = auditMatchExplainabilityAcmeGate(packs, params);
  const summit = buildMatchExplainabilitySummitBundle(packs, params);
  const summitExport = buildSessionSummitExportBundle(packs, params);
  const acmeAllowed = matchExplainabilityAcmeAllowed(acme);
  const summitReady = matchExplainabilitySummitReady(summit);
  const summitExportShipped = sessionSummitExportShipped(summitExport);
  const acmeReady = acmeAllowed && summitReady && summitExportShipped;
  const narrativeLines = [
    `Match explainability acme bundle: ${acmeReady ? 'READY' : 'PENDING'} (gate ${acmeAllowed ? 'ok' : 'fail'}, summit ${summitReady ? 'ok' : 'fail'}).`,
    ...acme.narrativeLines.slice(0, 2),
    ...summit.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ACME_NARRATIVE_CAP);
  return {
    acmeReady,
    acmeAllowed,
    summitReady,
    summitExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAcmeReady(bundle: MatchExplainabilityAcmeBundle): boolean {
  return bundle.acmeReady;
}
