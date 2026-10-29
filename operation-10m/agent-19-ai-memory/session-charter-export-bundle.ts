import {
  buildSessionCovenantExportBundle,
  type SessionCovenantExportBundle,
} from './session-covenant-export-bundle.ts';
import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionCharterExportBundle extends SessionCovenantExportBundle {
  charterReady: boolean;
  charterSchema: string;
}

/** Charter export wraps covenant export when charter bundle is ready. */
export function buildSessionCharterExportBundle(
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
): SessionCharterExportBundle {
  const base = buildSessionCovenantExportBundle(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const exports = charterReady ? base.exports : [];
  return {
    ...base,
    exports,
    charterReady,
    charterSchema: 'agent19.charter.v1',
    releaseReady: charterReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Charter export: ${charterReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCharterExportShipped(bundle: SessionCharterExportBundle): boolean {
  return (
    bundle.charterReady &&
    bundle.exports.length > 0 &&
    bundle.charterSchema === 'agent19.charter.v1'
  );
}
