import {
  buildSessionCommonwealthExportBundle,
  type SessionCommonwealthExportBundle,
} from './session-commonwealth-export-bundle.ts';
import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionRealmExportBundle extends SessionCommonwealthExportBundle {
  realmReady: boolean;
  realmSchema: string;
}

/** Realm export wraps commonwealth export when realm bundle is ready. */
export function buildSessionRealmExportBundle(
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
): SessionRealmExportBundle {
  const base = buildSessionCommonwealthExportBundle(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const exports = realmReady ? base.exports : [];
  return {
    ...base,
    exports,
    realmReady,
    realmSchema: 'agent19.realm.v1',
    releaseReady: realmReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Realm export: ${realmReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionRealmExportShipped(bundle: SessionRealmExportBundle): boolean {
  return (
    bundle.realmReady &&
    bundle.exports.length > 0 &&
    bundle.realmSchema === 'agent19.realm.v1'
  );
}
