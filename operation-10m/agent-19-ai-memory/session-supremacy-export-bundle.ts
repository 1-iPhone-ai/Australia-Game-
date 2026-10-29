import {
  buildSessionHegemonyExportBundle,
  type SessionHegemonyExportBundle,
} from './session-hegemony-export-bundle.ts';
import {
  buildMatchExplainabilitySupremacyBundle,
  matchExplainabilitySupremacyReady,
} from './match-explainability-supremacy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSupremacyExportBundle extends SessionHegemonyExportBundle {
  supremacyReady: boolean;
  supremacySchema: string;
}

/** Supremacy export wraps hegemony export when supremacy bundle is ready. */
export function buildSessionSupremacyExportBundle(
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
): SessionSupremacyExportBundle {
  const base = buildSessionHegemonyExportBundle(packs, params);
  const supremacy = buildMatchExplainabilitySupremacyBundle(packs, params);
  const supremacyReady = matchExplainabilitySupremacyReady(supremacy);
  const exports = supremacyReady ? base.exports : [];
  return {
    ...base,
    exports,
    supremacyReady,
    supremacySchema: 'agent19.supremacy.v1',
    releaseReady: supremacyReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Supremacy export: ${supremacyReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSupremacyExportShipped(bundle: SessionSupremacyExportBundle): boolean {
  return (
    bundle.supremacyReady &&
    bundle.exports.length > 0 &&
    bundle.supremacySchema === 'agent19.supremacy.v1'
  );
}
