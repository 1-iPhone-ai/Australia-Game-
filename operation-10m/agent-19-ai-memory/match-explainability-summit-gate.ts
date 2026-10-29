import {
  buildMatchExplainabilityZenithBundle,
  matchExplainabilityZenithReady,
} from './match-explainability-zenith-bundle.ts';
import {
  buildSessionZenithExportBundle,
  sessionZenithExportShipped,
} from './session-zenith-export-bundle.ts';
import { auditApexZenithBridge, apexZenithBridgeHealthy } from './apex-zenith-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilitySummitGateReport {
  summitAllowed: boolean;
  zenithReady: boolean;
  zenithExportShipped: boolean;
  apexZenithHealthy: boolean;
  narrativeLines: string[];
}

/** Summit gate: zenith bundle + zenith export + apex/zenith bridge. */
export function auditMatchExplainabilitySummitGate(
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
): MatchExplainabilitySummitGateReport {
  const zenith = buildMatchExplainabilityZenithBundle(packs, params);
  const zenithExport = buildSessionZenithExportBundle(packs, params);
  const bridge = auditApexZenithBridge(packs, params);
  const zenithReady = matchExplainabilityZenithReady(zenith);
  const zenithExportShipped = sessionZenithExportShipped(zenithExport);
  const apexZenithHealthy = apexZenithBridgeHealthy(bridge);
  const summitAllowed = zenithReady && zenithExportShipped && apexZenithHealthy;
  const narrativeLines = [
    `Match explainability summit: ${summitAllowed ? 'ALLOWED' : 'DENIED'} (zenith ${zenithReady ? 'ok' : 'fail'}, export ${zenithExportShipped ? 'ok' : 'fail'}).`,
    ...zenith.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    summitAllowed,
    zenithReady,
    zenithExportShipped,
    apexZenithHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySummitAllowed(report: MatchExplainabilitySummitGateReport): boolean {
  return report.summitAllowed;
}
