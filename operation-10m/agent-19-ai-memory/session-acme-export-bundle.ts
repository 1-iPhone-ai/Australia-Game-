import {
  buildSessionSummitExportBundle,
  type SessionSummitExportBundle,
} from './session-summit-export-bundle.ts';
import {
  buildMatchExplainabilityAcmeBundle,
  matchExplainabilityAcmeReady,
} from './match-explainability-acme-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionAcmeExportBundle extends SessionSummitExportBundle {
  acmeReady: boolean;
  acmeSchema: string;
}

/** Acme export wraps summit export when acme bundle is ready. */
export function buildSessionAcmeExportBundle(
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
): SessionAcmeExportBundle {
  const base = buildSessionSummitExportBundle(packs, params);
  const acme = buildMatchExplainabilityAcmeBundle(packs, params);
  const acmeReady = matchExplainabilityAcmeReady(acme);
  const exports = acmeReady ? base.exports : [];
  return {
    ...base,
    exports,
    acmeReady,
    acmeSchema: 'agent19.acme.v1',
    releaseReady: acmeReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Acme export: ${acmeReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAcmeExportShipped(bundle: SessionAcmeExportBundle): boolean {
  return bundle.acmeReady && bundle.exports.length > 0 && bundle.acmeSchema === 'agent19.acme.v1';
}
