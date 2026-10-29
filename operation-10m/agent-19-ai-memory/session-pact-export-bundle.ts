import {
  buildSessionCharterExportBundle,
  type SessionCharterExportBundle,
} from './session-charter-export-bundle.ts';
import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionPactExportBundle extends SessionCharterExportBundle {
  pactReady: boolean;
  pactSchema: string;
}

/** Pact export wraps charter export when pact bundle is ready. */
export function buildSessionPactExportBundle(
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
): SessionPactExportBundle {
  const base = buildSessionCharterExportBundle(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const exports = pactReady ? base.exports : [];
  return {
    ...base,
    exports,
    pactReady,
    pactSchema: 'agent19.pact.v1',
    releaseReady: pactReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Pact export: ${pactReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionPactExportShipped(bundle: SessionPactExportBundle): boolean {
  return (
    bundle.pactReady &&
    bundle.exports.length > 0 &&
    bundle.pactSchema === 'agent19.pact.v1'
  );
}
