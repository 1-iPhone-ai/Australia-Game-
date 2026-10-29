import {
  buildSessionSealExportBundle,
  type SessionSealExportBundle,
} from './session-seal-export-bundle.ts';
import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionCovenantExportBundle extends SessionSealExportBundle {
  covenantReady: boolean;
  covenantSchema: string;
}

/** Covenant export wraps seal export when covenant bundle is ready. */
export function buildSessionCovenantExportBundle(
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
): SessionCovenantExportBundle {
  const base = buildSessionSealExportBundle(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const exports = covenantReady ? base.exports : [];
  return {
    ...base,
    exports,
    covenantReady,
    covenantSchema: 'agent19.covenant.v1',
    releaseReady: covenantReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Covenant export: ${covenantReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCovenantExportShipped(bundle: SessionCovenantExportBundle): boolean {
  return (
    bundle.covenantReady &&
    bundle.exports.length > 0 &&
    bundle.covenantSchema === 'agent19.covenant.v1'
  );
}
