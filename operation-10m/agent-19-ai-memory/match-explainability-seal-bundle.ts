import {
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from './match-explainability-seal-gate.ts';
import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
import {
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from './session-confirm-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SEAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySealBundle {
  sealReady: boolean;
  sealAllowed: boolean;
  confirmReady: boolean;
  confirmExportShipped: boolean;
  narrativeLines: string[];
}

type SealParams = {
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

/** Seal bundle: seal gate and confirm export must both be green. */
export function buildMatchExplainabilitySealBundle(
  packs: TurnExplainabilityPack[],
  params: SealParams,
): MatchExplainabilitySealBundle {
  const seal = auditMatchExplainabilitySealGate(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmExport = buildSessionConfirmExportBundle(packs, params);
  const sealAllowed = matchExplainabilitySealAllowed(seal);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const confirmExportShipped = sessionConfirmExportShipped(confirmExport);
  const sealReady = sealAllowed && confirmReady && confirmExportShipped;
  const narrativeLines = [
    `Match explainability seal bundle: ${sealReady ? 'READY' : 'PENDING'} (gate ${sealAllowed ? 'ok' : 'fail'}, confirm ${confirmReady ? 'ok' : 'fail'}).`,
    ...seal.narrativeLines.slice(0, 2),
    ...confirm.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SEAL_NARRATIVE_CAP);
  return {
    sealReady,
    sealAllowed,
    confirmReady,
    confirmExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySealReady(bundle: MatchExplainabilitySealBundle): boolean {
  return bundle.sealReady;
}
