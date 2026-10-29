import {
  auditMatchExplainabilitySummitGate,
  matchExplainabilitySummitAllowed,
} from './match-explainability-summit-gate.ts';
import {
  buildMatchExplainabilityZenithBundle,
  matchExplainabilityZenithReady,
} from './match-explainability-zenith-bundle.ts';
import {
  buildSessionZenithExportBundle,
  sessionZenithExportShipped,
} from './session-zenith-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SUMMIT_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySummitBundle {
  summitReady: boolean;
  summitAllowed: boolean;
  zenithReady: boolean;
  zenithExportShipped: boolean;
  narrativeLines: string[];
}

type SummitParams = {
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

/** Summit bundle: summit gate and zenith export must both be green. */
export function buildMatchExplainabilitySummitBundle(
  packs: TurnExplainabilityPack[],
  params: SummitParams,
): MatchExplainabilitySummitBundle {
  const summit = auditMatchExplainabilitySummitGate(packs, params);
  const zenith = buildMatchExplainabilityZenithBundle(packs, params);
  const zenithExport = buildSessionZenithExportBundle(packs, params);
  const summitAllowed = matchExplainabilitySummitAllowed(summit);
  const zenithReady = matchExplainabilityZenithReady(zenith);
  const zenithExportShipped = sessionZenithExportShipped(zenithExport);
  const summitReady = summitAllowed && zenithReady && zenithExportShipped;
  const narrativeLines = [
    `Match explainability summit bundle: ${summitReady ? 'READY' : 'PENDING'} (gate ${summitAllowed ? 'ok' : 'fail'}, zenith ${zenithReady ? 'ok' : 'fail'}).`,
    ...summit.narrativeLines.slice(0, 2),
    ...zenith.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SUMMIT_NARRATIVE_CAP);
  return {
    summitReady,
    summitAllowed,
    zenithReady,
    zenithExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySummitReady(bundle: MatchExplainabilitySummitBundle): boolean {
  return bundle.summitReady;
}
