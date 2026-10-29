import {
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
import {
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface OperationsProductionBridgeReport {
  aligned: boolean;
  operationsReady: boolean;
  productionAllowed: boolean;
  narrativeLines: string[];
}

/** Operations-ready implies production allowed when export and bridge pass. */
export function auditOperationsProductionBridge(
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
): OperationsProductionBridgeReport {
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const productionAllowed = matchExplainabilityProductionAllowed(production);
  const aligned = operationsReady === productionAllowed;
  const narrativeLines = [
    `Operations/production bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (ops ${operationsReady ? 'ok' : 'fail'}, production ${productionAllowed ? 'ok' : 'fail'}).`,
  ];
  return { aligned, operationsReady, productionAllowed, narrativeLines };
}

export function operationsProductionBridgeHealthy(report: OperationsProductionBridgeReport): boolean {
  return report.operationsReady && report.productionAllowed && report.aligned;
}
