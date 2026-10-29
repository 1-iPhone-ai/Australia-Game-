import {
  buildSessionZenithExportBundle,
  type SessionZenithExportBundle,
} from './session-zenith-export-bundle.ts';
import {
  buildMatchExplainabilitySummitBundle,
  matchExplainabilitySummitReady,
} from './match-explainability-summit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSummitExportBundle extends SessionZenithExportBundle {
  summitReady: boolean;
  summitSchema: string;
}

/** Summit export wraps zenith export when summit bundle is ready. */
export function buildSessionSummitExportBundle(
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
): SessionSummitExportBundle {
  const base = buildSessionZenithExportBundle(packs, params);
  const summit = buildMatchExplainabilitySummitBundle(packs, params);
  const summitReady = matchExplainabilitySummitReady(summit);
  const exports = summitReady ? base.exports : [];
  return {
    ...base,
    exports,
    summitReady,
    summitSchema: 'agent19.summit.v1',
    releaseReady: summitReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Summit export: ${summitReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSummitExportShipped(bundle: SessionSummitExportBundle): boolean {
  return bundle.summitReady && bundle.exports.length > 0 && bundle.summitSchema === 'agent19.summit.v1';
}
