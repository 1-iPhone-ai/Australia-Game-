import {
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from './match-explainability-treaty-gate.ts';
import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
import {
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from './session-pact-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_TREATY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityTreatyBundle {
  treatyReady: boolean;
  treatyAllowed: boolean;
  pactReady: boolean;
  pactExportShipped: boolean;
  narrativeLines: string[];
}

type TreatyParams = {
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

/** Treaty bundle: treaty gate and pact export must both be green. */
export function buildMatchExplainabilityTreatyBundle(
  packs: TurnExplainabilityPack[],
  params: TreatyParams,
): MatchExplainabilityTreatyBundle {
  const treaty = auditMatchExplainabilityTreatyGate(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactExport = buildSessionPactExportBundle(packs, params);
  const treatyAllowed = matchExplainabilityTreatyAllowed(treaty);
  const pactReady = matchExplainabilityPactReady(pact);
  const pactExportShipped = sessionPactExportShipped(pactExport);
  const treatyReady = treatyAllowed && pactReady && pactExportShipped;
  const narrativeLines = [
    `Match explainability treaty bundle: ${treatyReady ? 'READY' : 'PENDING'} (gate ${treatyAllowed ? 'ok' : 'fail'}, pact ${pactReady ? 'ok' : 'fail'}).`,
    ...treaty.narrativeLines.slice(0, 2),
    ...pact.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_TREATY_NARRATIVE_CAP);
  return {
    treatyReady,
    treatyAllowed,
    pactReady,
    pactExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityTreatyReady(bundle: MatchExplainabilityTreatyBundle): boolean {
  return bundle.treatyReady;
}
