import {
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from './match-explainability-covenant-gate.ts';
import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
import {
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from './session-seal-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_COVENANT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCovenantBundle {
  covenantReady: boolean;
  covenantAllowed: boolean;
  sealReady: boolean;
  sealExportShipped: boolean;
  narrativeLines: string[];
}

type CovenantParams = {
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

/** Covenant bundle: covenant gate and seal export must both be green. */
export function buildMatchExplainabilityCovenantBundle(
  packs: TurnExplainabilityPack[],
  params: CovenantParams,
): MatchExplainabilityCovenantBundle {
  const covenant = auditMatchExplainabilityCovenantGate(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealExport = buildSessionSealExportBundle(packs, params);
  const covenantAllowed = matchExplainabilityCovenantAllowed(covenant);
  const sealReady = matchExplainabilitySealReady(seal);
  const sealExportShipped = sessionSealExportShipped(sealExport);
  const covenantReady = covenantAllowed && sealReady && sealExportShipped;
  const narrativeLines = [
    `Match explainability covenant bundle: ${covenantReady ? 'READY' : 'PENDING'} (gate ${covenantAllowed ? 'ok' : 'fail'}, seal ${sealReady ? 'ok' : 'fail'}).`,
    ...covenant.narrativeLines.slice(0, 2),
    ...seal.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_COVENANT_NARRATIVE_CAP);
  return {
    covenantReady,
    covenantAllowed,
    sealReady,
    sealExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCovenantReady(bundle: MatchExplainabilityCovenantBundle): boolean {
  return bundle.covenantReady;
}
