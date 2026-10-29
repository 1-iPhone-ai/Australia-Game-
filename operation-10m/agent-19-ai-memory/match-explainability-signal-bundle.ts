import {
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from './match-explainability-signal-gate.ts';
import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
import {
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from './session-beacon-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SIGNAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySignalBundle {
  signalReady: boolean;
  signalAllowed: boolean;
  beaconReady: boolean;
  beaconExportShipped: boolean;
  narrativeLines: string[];
}

type SignalParams = {
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

/** Signal bundle: signal gate and beacon export must both be green. */
export function buildMatchExplainabilitySignalBundle(
  packs: TurnExplainabilityPack[],
  params: SignalParams,
): MatchExplainabilitySignalBundle {
  const signal = auditMatchExplainabilitySignalGate(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconExport = buildSessionBeaconExportBundle(packs, params);
  const signalAllowed = matchExplainabilitySignalAllowed(signal);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const beaconExportShipped = sessionBeaconExportShipped(beaconExport);
  const signalReady = signalAllowed && beaconReady && beaconExportShipped;
  const narrativeLines = [
    `Match explainability signal bundle: ${signalReady ? 'READY' : 'PENDING'} (gate ${signalAllowed ? 'ok' : 'fail'}, beacon ${beaconReady ? 'ok' : 'fail'}).`,
    ...signal.narrativeLines.slice(0, 2),
    ...beacon.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SIGNAL_NARRATIVE_CAP);
  return {
    signalReady,
    signalAllowed,
    beaconReady,
    beaconExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySignalReady(bundle: MatchExplainabilitySignalBundle): boolean {
  return bundle.signalReady;
}
