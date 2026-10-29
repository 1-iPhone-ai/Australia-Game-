import {
  buildSessionImperialExportBundle,
  type SessionImperialExportBundle,
} from './session-imperial-export-bundle.ts';
import {
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionDominionExportBundle extends SessionImperialExportBundle {
  dominionReady: boolean;
  dominionSchema: string;
}

/** Dominion export wraps imperial export when dominion bundle is ready. */
export function buildSessionDominionExportBundle(
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
): SessionDominionExportBundle {
  const base = buildSessionImperialExportBundle(packs, params);
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const exports = dominionReady ? base.exports : [];
  return {
    ...base,
    exports,
    dominionReady,
    dominionSchema: 'agent19.dominion.v1',
    releaseReady: dominionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Dominion export: ${dominionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionDominionExportShipped(bundle: SessionDominionExportBundle): boolean {
  return (
    bundle.dominionReady &&
    bundle.exports.length > 0 &&
    bundle.dominionSchema === 'agent19.dominion.v1'
  );
}
