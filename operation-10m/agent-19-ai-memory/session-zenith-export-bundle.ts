import {
  buildSessionApexExportBundle,
  type SessionApexExportBundle,
} from './session-apex-export-bundle.ts';
import {
  buildMatchExplainabilityZenithBundle,
  matchExplainabilityZenithReady,
} from './match-explainability-zenith-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionZenithExportBundle extends SessionApexExportBundle {
  zenithReady: boolean;
  zenithSchema: string;
}

/** Zenith export wraps apex export when zenith bundle is ready. */
export function buildSessionZenithExportBundle(
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
): SessionZenithExportBundle {
  const base = buildSessionApexExportBundle(packs, params);
  const zenith = buildMatchExplainabilityZenithBundle(packs, params);
  const zenithReady = matchExplainabilityZenithReady(zenith);
  const exports = zenithReady ? base.exports : [];
  return {
    ...base,
    exports,
    zenithReady,
    zenithSchema: 'agent19.zenith.v1',
    releaseReady: zenithReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Zenith export: ${zenithReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionZenithExportShipped(bundle: SessionZenithExportBundle): boolean {
  return bundle.zenithReady && bundle.exports.length > 0 && bundle.zenithSchema === 'agent19.zenith.v1';
}
