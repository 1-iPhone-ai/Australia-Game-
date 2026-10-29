import {
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from './match-explainability-sovereign-gate.ts';
import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
import {
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from './session-realm-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SOVEREIGN_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySovereignBundle {
  sovereignReady: boolean;
  sovereignAllowed: boolean;
  realmReady: boolean;
  realmExportShipped: boolean;
  narrativeLines: string[];
}

type SovereignParams = {
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

/** Sovereign bundle: sovereign gate and realm export must both be green. */
export function buildMatchExplainabilitySovereignBundle(
  packs: TurnExplainabilityPack[],
  params: SovereignParams,
): MatchExplainabilitySovereignBundle {
  const sovereign = auditMatchExplainabilitySovereignGate(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmExport = buildSessionRealmExportBundle(packs, params);
  const sovereignAllowed = matchExplainabilitySovereignAllowed(sovereign);
  const realmReady = matchExplainabilityRealmReady(realm);
  const realmExportShipped = sessionRealmExportShipped(realmExport);
  const sovereignReady = sovereignAllowed && realmReady && realmExportShipped;
  const narrativeLines = [
    `Match explainability sovereign bundle: ${sovereignReady ? 'READY' : 'PENDING'} (gate ${sovereignAllowed ? 'ok' : 'fail'}, realm ${realmReady ? 'ok' : 'fail'}).`,
    ...sovereign.narrativeLines.slice(0, 2),
    ...realm.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SOVEREIGN_NARRATIVE_CAP);
  return {
    sovereignReady,
    sovereignAllowed,
    realmReady,
    realmExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySovereignReady(bundle: MatchExplainabilitySovereignBundle): boolean {
  return bundle.sovereignReady;
}
