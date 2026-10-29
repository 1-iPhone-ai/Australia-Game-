import {
  buildSessionLeagueExportBundle,
  type SessionLeagueExportBundle,
} from './session-league-export-bundle.ts';
import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionFederationExportBundle extends SessionLeagueExportBundle {
  federationReady: boolean;
  federationSchema: string;
}

/** Federation export wraps league export when federation bundle is ready. */
export function buildSessionFederationExportBundle(
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
): SessionFederationExportBundle {
  const base = buildSessionLeagueExportBundle(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const exports = federationReady ? base.exports : [];
  return {
    ...base,
    exports,
    federationReady,
    federationSchema: 'agent19.federation.v1',
    releaseReady: federationReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Federation export: ${federationReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionFederationExportShipped(bundle: SessionFederationExportBundle): boolean {
  return (
    bundle.federationReady &&
    bundle.exports.length > 0 &&
    bundle.federationSchema === 'agent19.federation.v1'
  );
}
