import {
  buildSessionBeaconExportBundle,
  type SessionBeaconExportBundle,
} from './session-beacon-export-bundle.ts';
import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSignalExportBundle extends SessionBeaconExportBundle {
  signalReady: boolean;
  signalSchema: string;
}

/** Signal export wraps beacon export when signal bundle is ready. */
export function buildSessionSignalExportBundle(
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
): SessionSignalExportBundle {
  const base = buildSessionBeaconExportBundle(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const exports = signalReady ? base.exports : [];
  return {
    ...base,
    exports,
    signalReady,
    signalSchema: 'agent19.signal.v1',
    releaseReady: signalReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Signal export: ${signalReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSignalExportShipped(bundle: SessionSignalExportBundle): boolean {
  return (
    bundle.signalReady &&
    bundle.exports.length > 0 &&
    bundle.signalSchema === 'agent19.signal.v1'
  );
}
