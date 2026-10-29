import {
  buildSessionUplinkExportBundle,
  type SessionUplinkExportBundle,
} from './session-uplink-export-bundle.ts';
import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionHandshakeExportBundle extends SessionUplinkExportBundle {
  handshakeReady: boolean;
  handshakeSchema: string;
}

/** Handshake export wraps uplink export when handshake bundle is ready. */
export function buildSessionHandshakeExportBundle(
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
): SessionHandshakeExportBundle {
  const base = buildSessionUplinkExportBundle(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const exports = handshakeReady ? base.exports : [];
  return {
    ...base,
    exports,
    handshakeReady,
    handshakeSchema: 'agent19.handshake.v1',
    releaseReady: handshakeReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Handshake export: ${handshakeReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionHandshakeExportShipped(bundle: SessionHandshakeExportBundle): boolean {
  return (
    bundle.handshakeReady &&
    bundle.exports.length > 0 &&
    bundle.handshakeSchema === 'agent19.handshake.v1'
  );
}
