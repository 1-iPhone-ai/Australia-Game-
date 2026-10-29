import {
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from './match-explainability-confirm-gate.ts';
import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
import {
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from './session-ack-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONFIRM_NARRATIVE_CAP = 10;

export interface MatchExplainabilityConfirmBundle {
  confirmReady: boolean;
  confirmAllowed: boolean;
  ackReady: boolean;
  ackExportShipped: boolean;
  narrativeLines: string[];
}

type ConfirmParams = {
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

/** Confirm bundle: confirm gate and ack export must both be green. */
export function buildMatchExplainabilityConfirmBundle(
  packs: TurnExplainabilityPack[],
  params: ConfirmParams,
): MatchExplainabilityConfirmBundle {
  const confirm = auditMatchExplainabilityConfirmGate(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackExport = buildSessionAckExportBundle(packs, params);
  const confirmAllowed = matchExplainabilityConfirmAllowed(confirm);
  const ackReady = matchExplainabilityAckReady(ack);
  const ackExportShipped = sessionAckExportShipped(ackExport);
  const confirmReady = confirmAllowed && ackReady && ackExportShipped;
  const narrativeLines = [
    `Match explainability confirm bundle: ${confirmReady ? 'READY' : 'PENDING'} (gate ${confirmAllowed ? 'ok' : 'fail'}, ack ${ackReady ? 'ok' : 'fail'}).`,
    ...confirm.narrativeLines.slice(0, 2),
    ...ack.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONFIRM_NARRATIVE_CAP);
  return {
    confirmReady,
    confirmAllowed,
    ackReady,
    ackExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityConfirmReady(bundle: MatchExplainabilityConfirmBundle): boolean {
  return bundle.confirmReady;
}
