import {
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
import {
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from './session-operations-export-bundle.ts';
import { auditReleaseLaunchBridge, releaseLaunchBridgeAligned } from './release-launch-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityProductionGateReport {
  productionAllowed: boolean;
  operationsReady: boolean;
  operationsExportReady: boolean;
  releaseLaunchAligned: boolean;
  narrativeLines: string[];
}

/** Production gate: operations bundle + ops export + release/launch alignment. */
export function auditMatchExplainabilityProductionGate(
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
): MatchExplainabilityProductionGateReport {
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const opsExport = buildSessionOperationsExportBundle(packs, params);
  const bridge = auditReleaseLaunchBridge(packs, params);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const operationsExportReady = sessionOperationsExportReady(opsExport);
  const releaseLaunchAligned = releaseLaunchBridgeAligned(bridge);
  const productionAllowed = operationsReady && operationsExportReady && releaseLaunchAligned;
  const narrativeLines = [
    `Match explainability production: ${productionAllowed ? 'ALLOWED' : 'BLOCKED'} (ops ${operationsReady ? 'ok' : 'fail'}, export ${operationsExportReady ? 'ok' : 'fail'}).`,
    ...ops.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines.slice(0, 1),
  ];
  return {
    productionAllowed,
    operationsReady,
    operationsExportReady,
    releaseLaunchAligned,
    narrativeLines,
  };
}

export function matchExplainabilityProductionAllowed(report: MatchExplainabilityProductionGateReport): boolean {
  return report.productionAllowed;
}
