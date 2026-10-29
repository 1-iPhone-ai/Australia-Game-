import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
import {
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from './session-signal-export-bundle.ts';
import { auditBeaconSignalBridge, beaconSignalBridgeHealthy } from './beacon-signal-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityUplinkGateReport {
  uplinkAllowed: boolean;
  signalReady: boolean;
  signalExportShipped: boolean;
  beaconSignalHealthy: boolean;
  narrativeLines: string[];
}

/** Uplink gate: signal bundle + signal export + beacon/signal bridge. */
export function auditMatchExplainabilityUplinkGate(
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
): MatchExplainabilityUplinkGateReport {
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalExport = buildSessionSignalExportBundle(packs, params);
  const bridge = auditBeaconSignalBridge(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const signalExportShipped = sessionSignalExportShipped(signalExport);
  const beaconSignalHealthy = beaconSignalBridgeHealthy(bridge);
  const uplinkAllowed = signalReady && signalExportShipped && beaconSignalHealthy;
  const narrativeLines = [
    `Match explainability uplink: ${uplinkAllowed ? 'ALLOWED' : 'DENIED'} (signal ${signalReady ? 'ok' : 'fail'}, export ${signalExportShipped ? 'ok' : 'fail'}).`,
    ...signal.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    uplinkAllowed,
    signalReady,
    signalExportShipped,
    beaconSignalHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityUplinkAllowed(report: MatchExplainabilityUplinkGateReport): boolean {
  return report.uplinkAllowed;
}
