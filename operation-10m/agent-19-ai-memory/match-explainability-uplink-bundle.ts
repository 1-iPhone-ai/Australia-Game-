import {
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from './match-explainability-uplink-gate.ts';
import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
import {
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from './session-signal-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_UPLINK_NARRATIVE_CAP = 10;

export interface MatchExplainabilityUplinkBundle {
  uplinkReady: boolean;
  uplinkAllowed: boolean;
  signalReady: boolean;
  signalExportShipped: boolean;
  narrativeLines: string[];
}

type UplinkParams = {
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

/** Uplink bundle: uplink gate and signal export must both be green. */
export function buildMatchExplainabilityUplinkBundle(
  packs: TurnExplainabilityPack[],
  params: UplinkParams,
): MatchExplainabilityUplinkBundle {
  const uplink = auditMatchExplainabilityUplinkGate(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalExport = buildSessionSignalExportBundle(packs, params);
  const uplinkAllowed = matchExplainabilityUplinkAllowed(uplink);
  const signalReady = matchExplainabilitySignalReady(signal);
  const signalExportShipped = sessionSignalExportShipped(signalExport);
  const uplinkReady = uplinkAllowed && signalReady && signalExportShipped;
  const narrativeLines = [
    `Match explainability uplink bundle: ${uplinkReady ? 'READY' : 'PENDING'} (gate ${uplinkAllowed ? 'ok' : 'fail'}, signal ${signalReady ? 'ok' : 'fail'}).`,
    ...uplink.narrativeLines.slice(0, 2),
    ...signal.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_UPLINK_NARRATIVE_CAP);
  return {
    uplinkReady,
    uplinkAllowed,
    signalReady,
    signalExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityUplinkReady(bundle: MatchExplainabilityUplinkBundle): boolean {
  return bundle.uplinkReady;
}
