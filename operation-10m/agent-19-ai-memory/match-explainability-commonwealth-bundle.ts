import {
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from './match-explainability-commonwealth-gate.ts';
import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
import {
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from './session-union-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_COMMONWEALTH_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCommonwealthBundle {
  commonwealthReady: boolean;
  commonwealthAllowed: boolean;
  unionReady: boolean;
  unionExportShipped: boolean;
  narrativeLines: string[];
}

type CommonwealthParams = {
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

/** Commonwealth bundle: commonwealth gate and union export must both be green. */
export function buildMatchExplainabilityCommonwealthBundle(
  packs: TurnExplainabilityPack[],
  params: CommonwealthParams,
): MatchExplainabilityCommonwealthBundle {
  const commonwealth = auditMatchExplainabilityCommonwealthGate(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionExport = buildSessionUnionExportBundle(packs, params);
  const commonwealthAllowed = matchExplainabilityCommonwealthAllowed(commonwealth);
  const unionReady = matchExplainabilityUnionReady(union);
  const unionExportShipped = sessionUnionExportShipped(unionExport);
  const commonwealthReady = commonwealthAllowed && unionReady && unionExportShipped;
  const narrativeLines = [
    `Match explainability commonwealth bundle: ${commonwealthReady ? 'READY' : 'PENDING'} (gate ${commonwealthAllowed ? 'ok' : 'fail'}, union ${unionReady ? 'ok' : 'fail'}).`,
    ...commonwealth.narrativeLines.slice(0, 2),
    ...union.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_COMMONWEALTH_NARRATIVE_CAP);
  return {
    commonwealthReady,
    commonwealthAllowed,
    unionReady,
    unionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCommonwealthReady(bundle: MatchExplainabilityCommonwealthBundle): boolean {
  return bundle.commonwealthReady;
}
