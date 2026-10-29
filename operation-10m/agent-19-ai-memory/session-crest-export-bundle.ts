import {
  buildSessionAcmeExportBundle,
  type SessionAcmeExportBundle,
} from './session-acme-export-bundle.ts';
import {
  buildMatchExplainabilityCrestBundle,
  matchExplainabilityCrestReady,
} from './match-explainability-crest-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionCrestExportBundle extends SessionAcmeExportBundle {
  crestReady: boolean;
  crestSchema: string;
}

/** Crest export wraps acme export when crest bundle is ready. */
export function buildSessionCrestExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionCrestExportBundle {
  const base = buildSessionAcmeExportBundle(packs, params);
  const crest = buildMatchExplainabilityCrestBundle(packs, params);
  const crestReady = matchExplainabilityCrestReady(crest);
  const exports = crestReady ? base.exports : [];
  return {
    ...base,
    exports,
    crestReady,
    crestSchema: 'agent19.crest.v1',
    releaseReady: crestReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Crest export: ${crestReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCrestExportShipped(bundle: SessionCrestExportBundle): boolean {
  return bundle.crestReady && bundle.exports.length > 0 && bundle.crestSchema === 'agent19.crest.v1';
}
