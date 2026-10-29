import {
  buildSessionTreatyExportBundle,
  type SessionTreatyExportBundle,
} from './session-treaty-export-bundle.ts';
import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionAccordExportBundle extends SessionTreatyExportBundle {
  accordReady: boolean;
  accordSchema: string;
}

/** Accord export wraps treaty export when accord bundle is ready. */
export function buildSessionAccordExportBundle(
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
): SessionAccordExportBundle {
  const base = buildSessionTreatyExportBundle(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const exports = accordReady ? base.exports : [];
  return {
    ...base,
    exports,
    accordReady,
    accordSchema: 'agent19.accord.v1',
    releaseReady: accordReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Accord export: ${accordReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAccordExportShipped(bundle: SessionAccordExportBundle): boolean {
  return (
    bundle.accordReady &&
    bundle.exports.length > 0 &&
    bundle.accordSchema === 'agent19.accord.v1'
  );
}
