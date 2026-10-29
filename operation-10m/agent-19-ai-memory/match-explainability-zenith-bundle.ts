import {
  auditMatchExplainabilityZenithGate,
  matchExplainabilityZenithAllowed,
} from './match-explainability-zenith-gate.ts';
import {
  buildMatchExplainabilityApexBundle,
  matchExplainabilityApexReady,
} from './match-explainability-apex-bundle.ts';
import {
  buildSessionApexExportBundle,
  sessionApexExportShipped,
} from './session-apex-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ZENITH_NARRATIVE_CAP = 10;

export interface MatchExplainabilityZenithBundle {
  zenithReady: boolean;
  zenithAllowed: boolean;
  apexReady: boolean;
  apexExportShipped: boolean;
  narrativeLines: string[];
}

type ZenithParams = {
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

/** Zenith bundle: zenith gate and apex export must both be green. */
export function buildMatchExplainabilityZenithBundle(
  packs: TurnExplainabilityPack[],
  params: ZenithParams,
): MatchExplainabilityZenithBundle {
  const zenith = auditMatchExplainabilityZenithGate(packs, params);
  const apex = buildMatchExplainabilityApexBundle(packs, params);
  const apexExport = buildSessionApexExportBundle(packs, params);
  const zenithAllowed = matchExplainabilityZenithAllowed(zenith);
  const apexReady = matchExplainabilityApexReady(apex);
  const apexExportShipped = sessionApexExportShipped(apexExport);
  const zenithReady = zenithAllowed && apexReady && apexExportShipped;
  const narrativeLines = [
    `Match explainability zenith bundle: ${zenithReady ? 'READY' : 'PENDING'} (gate ${zenithAllowed ? 'ok' : 'fail'}, apex ${apexReady ? 'ok' : 'fail'}).`,
    ...zenith.narrativeLines.slice(0, 2),
    ...apex.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ZENITH_NARRATIVE_CAP);
  return {
    zenithReady,
    zenithAllowed,
    apexReady,
    apexExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityZenithReady(bundle: MatchExplainabilityZenithBundle): boolean {
  return bundle.zenithReady;
}
