import {
  auditMatchExplainabilityParamountGate,
  matchExplainabilityParamountAllowed,
} from './match-explainability-paramount-gate.ts';
import {
  buildMatchExplainabilityPreeminenceBundle,
  matchExplainabilityPreeminenceReady,
} from './match-explainability-preeminence-bundle.ts';
import {
  buildSessionPreeminenceExportBundle,
  sessionPreeminenceExportShipped,
} from './session-preeminence-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PARAMOUNT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityParamountBundle {
  paramountReady: boolean;
  paramountAllowed: boolean;
  preeminenceReady: boolean;
  preeminenceExportShipped: boolean;
  narrativeLines: string[];
}

type ParamountParams = {
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

/** Paramount bundle: paramount gate and preeminence export must both be green. */
export function buildMatchExplainabilityParamountBundle(
  packs: TurnExplainabilityPack[],
  params: ParamountParams,
): MatchExplainabilityParamountBundle {
  const paramount = auditMatchExplainabilityParamountGate(packs, params);
  const preeminence = buildMatchExplainabilityPreeminenceBundle(packs, params);
  const preeminenceExport = buildSessionPreeminenceExportBundle(packs, params);
  const paramountAllowed = matchExplainabilityParamountAllowed(paramount);
  const preeminenceReady = matchExplainabilityPreeminenceReady(preeminence);
  const preeminenceExportShipped = sessionPreeminenceExportShipped(preeminenceExport);
  const paramountReady = paramountAllowed && preeminenceReady && preeminenceExportShipped;
  const narrativeLines = [
    `Match explainability paramount bundle: ${paramountReady ? 'READY' : 'PENDING'} (gate ${paramountAllowed ? 'ok' : 'fail'}, preeminence ${preeminenceReady ? 'ok' : 'fail'}).`,
    ...paramount.narrativeLines.slice(0, 2),
    ...preeminence.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_PARAMOUNT_NARRATIVE_CAP);
  return {
    paramountReady,
    paramountAllowed,
    preeminenceReady,
    preeminenceExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityParamountReady(bundle: MatchExplainabilityParamountBundle): boolean {
  return bundle.paramountReady;
}
