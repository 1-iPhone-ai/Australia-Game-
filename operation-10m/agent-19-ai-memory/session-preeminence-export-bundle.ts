import {
  buildSessionAscendancyExportBundle,
  type SessionAscendancyExportBundle,
} from './session-ascendancy-export-bundle.ts';
import {
  buildMatchExplainabilityPreeminenceBundle,
  matchExplainabilityPreeminenceReady,
} from './match-explainability-preeminence-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionPreeminenceExportBundle extends SessionAscendancyExportBundle {
  preeminenceReady: boolean;
  preeminenceSchema: string;
}

/** Preeminence export wraps ascendancy export when preeminence bundle is ready. */
export function buildSessionPreeminenceExportBundle(
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
): SessionPreeminenceExportBundle {
  const base = buildSessionAscendancyExportBundle(packs, params);
  const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
  const preeminenceReady = matchExplainabilityPreeminenceReady(preeminence);
  const exports = preeminenceReady ? base.exports : [];
  return {
    ...base,
    exports,
    preeminenceReady,
    preeminenceSchema: 'agent19.preeminence.v1',
    releaseReady: preeminenceReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Preeminence export: ${preeminenceReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionPreeminenceExportShipped(bundle: SessionPreeminenceExportBundle): boolean {
  return (
    bundle.preeminenceReady &&
    bundle.exports.length > 0 &&
    bundle.preeminenceSchema === 'agent19.preeminence.v1'
  );
}
