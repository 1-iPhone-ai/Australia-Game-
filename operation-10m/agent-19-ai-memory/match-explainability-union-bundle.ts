import {
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from './match-explainability-union-gate.ts';
import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
import {
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from './session-federation-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_UNION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityUnionBundle {
  unionReady: boolean;
  unionAllowed: boolean;
  federationReady: boolean;
  federationExportShipped: boolean;
  narrativeLines: string[];
}

type UnionParams = {
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

/** Union bundle: union gate and federation export must both be green. */
export function buildMatchExplainabilityUnionBundle(
  packs: TurnExplainabilityPack[],
  params: UnionParams,
): MatchExplainabilityUnionBundle {
  const union = auditMatchExplainabilityUnionGate(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationExport = buildSessionFederationExportBundle(packs, params);
  const unionAllowed = matchExplainabilityUnionAllowed(union);
  const federationReady = matchExplainabilityFederationReady(federation);
  const federationExportShipped = sessionFederationExportShipped(federationExport);
  const unionReady = unionAllowed && federationReady && federationExportShipped;
  const narrativeLines = [
    `Match explainability union bundle: ${unionReady ? 'READY' : 'PENDING'} (gate ${unionAllowed ? 'ok' : 'fail'}, federation ${federationReady ? 'ok' : 'fail'}).`,
    ...union.narrativeLines.slice(0, 2),
    ...federation.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_UNION_NARRATIVE_CAP);
  return {
    unionReady,
    unionAllowed,
    federationReady,
    federationExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityUnionReady(bundle: MatchExplainabilityUnionBundle): boolean {
  return bundle.unionReady;
}
