import {
  auditMatchExplainabilityPinnacleGate,
  matchExplainabilityPinnacleAllowed,
} from './match-explainability-pinnacle-gate.ts';
import {
  buildMatchExplainabilityParamountBundle,
  matchExplainabilityParamountReady,
} from './match-explainability-paramount-bundle.ts';
import {
  buildSessionParamountExportBundle,
  sessionParamountExportShipped,
} from './session-paramount-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PINNACLE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityPinnacleBundle {
  pinnacleReady: boolean;
  pinnacleAllowed: boolean;
  paramountReady: boolean;
  paramountExportShipped: boolean;
  narrativeLines: string[];
}

type PinnacleParams = {
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

/** Pinnacle bundle: pinnacle gate and paramount export must both be green. */
export function buildMatchExplainabilityPinnacleBundle(
  packs: TurnExplainabilityPack[],
  params: PinnacleParams,
): MatchExplainabilityPinnacleBundle {
  const pinnacle = auditMatchExplainabilityPinnacleGate(packs, params);
  const paramount = buildMatchExplainabilityParamountBundle(packs, params);
  const paramountExport = buildSessionParamountExportBundle(packs, params);
  const pinnacleAllowed = matchExplainabilityPinnacleAllowed(pinnacle);
  const paramountReady = matchExplainabilityParamountReady(paramount);
  const paramountExportShipped = sessionParamountExportShipped(paramountExport);
  const pinnacleReady = pinnacleAllowed && paramountReady && paramountExportShipped;
  const narrativeLines = [
    `Match explainability pinnacle bundle: ${pinnacleReady ? 'READY' : 'PENDING'} (gate ${pinnacleAllowed ? 'ok' : 'fail'}, paramount ${paramountReady ? 'ok' : 'fail'}).`,
    ...pinnacle.narrativeLines.slice(0, 2),
    ...paramount.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_PINNACLE_NARRATIVE_CAP);
  return {
    pinnacleReady,
    pinnacleAllowed,
    paramountReady,
    paramountExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityPinnacleReady(bundle: MatchExplainabilityPinnacleBundle): boolean {
  return bundle.pinnacleReady;
}
