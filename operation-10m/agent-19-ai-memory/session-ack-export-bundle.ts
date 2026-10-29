import {
  buildSessionHandshakeExportBundle,
  type SessionHandshakeExportBundle,
} from './session-handshake-export-bundle.ts';
import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionAckExportBundle extends SessionHandshakeExportBundle {
  ackReady: boolean;
  ackSchema: string;
}

/** Ack export wraps handshake export when ack bundle is ready. */
export function buildSessionAckExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionAckExportBundle {
  const base = buildSessionHandshakeExportBundle(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const exports = ackReady ? base.exports : [];
  return {
    ...base,
    exports,
    ackReady,
    ackSchema: 'agent19.ack.v1',
    releaseReady: ackReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Ack export: ${ackReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAckExportShipped(bundle: SessionAckExportBundle): boolean {
  return bundle.ackReady && bundle.exports.length > 0 && bundle.ackSchema === 'agent19.ack.v1';
}
