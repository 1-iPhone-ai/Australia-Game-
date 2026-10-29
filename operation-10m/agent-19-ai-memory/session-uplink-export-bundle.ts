import {
  buildSessionSignalExportBundle,
  type SessionSignalExportBundle,
} from './session-signal-export-bundle.ts';
import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionUplinkExportBundle extends SessionSignalExportBundle {
  uplinkReady: boolean;
  uplinkSchema: string;
}

/** Uplink export wraps signal export when uplink bundle is ready. */
export function buildSessionUplinkExportBundle(
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
): SessionUplinkExportBundle {
  const base = buildSessionSignalExportBundle(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const exports = uplinkReady ? base.exports : [];
  return {
    ...base,
    exports,
    uplinkReady,
    uplinkSchema: 'agent19.uplink.v1',
    releaseReady: uplinkReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Uplink export: ${uplinkReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionUplinkExportShipped(bundle: SessionUplinkExportBundle): boolean {
  return (
    bundle.uplinkReady &&
    bundle.exports.length > 0 &&
    bundle.uplinkSchema === 'agent19.uplink.v1'
  );
}
