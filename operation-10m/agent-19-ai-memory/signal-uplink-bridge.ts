import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SignalUplinkBridgeReport {
  aligned: boolean;
  uplinkReady: boolean;
  signalReady: boolean;
  narrativeLines: string[];
}

/** Uplink-ready should match signal-ready when signal export stack passes. */
export function auditSignalUplinkBridge(
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
): SignalUplinkBridgeReport {
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const signalReady = matchExplainabilitySignalReady(signal);
  const aligned = uplinkReady === signalReady;
  const narrativeLines = [
    `Signal/uplink bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (uplink ${uplinkReady ? 'ok' : 'fail'}, signal ${signalReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, uplinkReady, signalReady, narrativeLines };
}

export function signalUplinkBridgeHealthy(report: SignalUplinkBridgeReport): boolean {
  return report.uplinkReady && report.signalReady && report.aligned;
}
