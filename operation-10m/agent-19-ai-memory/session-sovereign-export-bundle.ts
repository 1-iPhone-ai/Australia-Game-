import {
  buildSessionRealmExportBundle,
  type SessionRealmExportBundle,
} from './session-realm-export-bundle.ts';
import {
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSovereignExportBundle extends SessionRealmExportBundle {
  sovereignReady: boolean;
  sovereignSchema: string;
}

/** Sovereign export wraps realm export when sovereign bundle is ready. */
export function buildSessionSovereignExportBundle(
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
): SessionSovereignExportBundle {
  const base = buildSessionRealmExportBundle(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const exports = sovereignReady ? base.exports : [];
  return {
    ...base,
    exports,
    sovereignReady,
    sovereignSchema: 'agent19.sovereign.v1',
    releaseReady: sovereignReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Sovereign export: ${sovereignReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSovereignExportShipped(bundle: SessionSovereignExportBundle): boolean {
  return (
    bundle.sovereignReady &&
    bundle.exports.length > 0 &&
    bundle.sovereignSchema === 'agent19.sovereign.v1'
  );
}
