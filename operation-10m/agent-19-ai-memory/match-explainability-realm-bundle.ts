import {
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from './match-explainability-realm-gate.ts';
import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
import {
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from './session-commonwealth-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_REALM_NARRATIVE_CAP = 10;

export interface MatchExplainabilityRealmBundle {
  realmReady: boolean;
  realmAllowed: boolean;
  commonwealthReady: boolean;
  commonwealthExportShipped: boolean;
  narrativeLines: string[];
}

type RealmParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Realm bundle: realm gate and commonwealth export must both be green. */
export function buildMatchExplainabilityRealmBundle(
  packs: TurnExplainabilityPack[],
  params: RealmParams,
): MatchExplainabilityRealmBundle {
  const realm = auditMatchExplainabilityRealmGate(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthExport = buildSessionCommonwealthExportBundle(packs, params);
  const realmAllowed = matchExplainabilityRealmAllowed(realm);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const commonwealthExportShipped = sessionCommonwealthExportShipped(commonwealthExport);
  const realmReady = realmAllowed && commonwealthReady && commonwealthExportShipped;
  const narrativeLines = [
    `Match explainability realm bundle: ${realmReady ? 'READY' : 'PENDING'} (gate ${realmAllowed ? 'ok' : 'fail'}, commonwealth ${commonwealthReady ? 'ok' : 'fail'}).`,
    ...realm.narrativeLines.slice(0, 2),
    ...commonwealth.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_REALM_NARRATIVE_CAP);
  return {
    realmReady,
    realmAllowed,
    commonwealthReady,
    commonwealthExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityRealmReady(bundle: MatchExplainabilityRealmBundle): boolean {
  return bundle.realmReady;
}
