import {
  auditMatchExplainabilityApexGate,
  matchExplainabilityApexAllowed,
} from './match-explainability-apex-gate.ts';
import {
  buildMatchExplainabilityPinnacleBundle,
  matchExplainabilityPinnacleReady,
} from './match-explainability-pinnacle-bundle.ts';
import {
  buildSessionPinnacleExportBundle,
  sessionPinnacleExportShipped,
} from './session-pinnacle-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_APEX_NARRATIVE_CAP = 10;

export interface MatchExplainabilityApexBundle {
  apexReady: boolean;
  apexAllowed: boolean;
  pinnacleReady: boolean;
  pinnacleExportShipped: boolean;
  narrativeLines: string[];
}

type ApexParams = {
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

/** Apex bundle: apex gate and pinnacle export must both be green. */
export function buildMatchExplainabilityApexBundle(
  packs: TurnExplainabilityPack[],
  params: ApexParams,
): MatchExplainabilityApexBundle {
  const apex = auditMatchExplainabilityApexGate(packs, params);
  const pinnacle = buildMatchExplainabilityPinnacleBundle(packs, params);
  const pinnacleExport = buildSessionPinnacleExportBundle(packs, params);
  const apexAllowed = matchExplainabilityApexAllowed(apex);
  const pinnacleReady = matchExplainabilityPinnacleReady(pinnacle);
  const pinnacleExportShipped = sessionPinnacleExportShipped(pinnacleExport);
  const apexReady = apexAllowed && pinnacleReady && pinnacleExportShipped;
  const narrativeLines = [
    `Match explainability apex bundle: ${apexReady ? 'READY' : 'PENDING'} (gate ${apexAllowed ? 'ok' : 'fail'}, pinnacle ${pinnacleReady ? 'ok' : 'fail'}).`,
    ...apex.narrativeLines.slice(0, 2),
    ...pinnacle.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_APEX_NARRATIVE_CAP);
  return {
    apexReady,
    apexAllowed,
    pinnacleReady,
    pinnacleExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityApexReady(bundle: MatchExplainabilityApexBundle): boolean {
  return bundle.apexReady;
}
