import {
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from './match-explainability-handshake-gate.ts';
import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
import {
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from './session-uplink-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_HANDSHAKE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityHandshakeBundle {
  handshakeReady: boolean;
  handshakeAllowed: boolean;
  uplinkReady: boolean;
  uplinkExportShipped: boolean;
  narrativeLines: string[];
}

type HandshakeParams = {
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

/** Handshake bundle: handshake gate and uplink export must both be green. */
export function buildMatchExplainabilityHandshakeBundle(
  packs: TurnExplainabilityPack[],
  params: HandshakeParams,
): MatchExplainabilityHandshakeBundle {
  const handshake = auditMatchExplainabilityHandshakeGate(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkExport = buildSessionUplinkExportBundle(packs, params);
  const handshakeAllowed = matchExplainabilityHandshakeAllowed(handshake);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const uplinkExportShipped = sessionUplinkExportShipped(uplinkExport);
  const handshakeReady = handshakeAllowed && uplinkReady && uplinkExportShipped;
  const narrativeLines = [
    `Match explainability handshake bundle: ${handshakeReady ? 'READY' : 'PENDING'} (gate ${handshakeAllowed ? 'ok' : 'fail'}, uplink ${uplinkReady ? 'ok' : 'fail'}).`,
    ...handshake.narrativeLines.slice(0, 2),
    ...uplink.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_HANDSHAKE_NARRATIVE_CAP);
  return {
    handshakeReady,
    handshakeAllowed,
    uplinkReady,
    uplinkExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityHandshakeReady(bundle: MatchExplainabilityHandshakeBundle): boolean {
  return bundle.handshakeReady;
}
