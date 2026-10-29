import {
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from './match-explainability-ack-gate.ts';
import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
import {
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from './session-handshake-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_ACK_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAckBundle {
  ackReady: boolean;
  ackAllowed: boolean;
  handshakeReady: boolean;
  handshakeExportShipped: boolean;
  narrativeLines: string[];
}

type AckParams = {
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

/** Ack bundle: ack gate and handshake export must both be green. */
export function buildMatchExplainabilityAckBundle(
  packs: TurnExplainabilityPack[],
  params: AckParams,
): MatchExplainabilityAckBundle {
  const ack = auditMatchExplainabilityAckGate(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeExport = buildSessionHandshakeExportBundle(packs, params);
  const ackAllowed = matchExplainabilityAckAllowed(ack);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const handshakeExportShipped = sessionHandshakeExportShipped(handshakeExport);
  const ackReady = ackAllowed && handshakeReady && handshakeExportShipped;
  const narrativeLines = [
    `Match explainability ack bundle: ${ackReady ? 'READY' : 'PENDING'} (gate ${ackAllowed ? 'ok' : 'fail'}, handshake ${handshakeReady ? 'ok' : 'fail'}).`,
    ...ack.narrativeLines.slice(0, 2),
    ...handshake.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ACK_NARRATIVE_CAP);
  return {
    ackReady,
    ackAllowed,
    handshakeReady,
    handshakeExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAckReady(bundle: MatchExplainabilityAckBundle): boolean {
  return bundle.ackReady;
}
