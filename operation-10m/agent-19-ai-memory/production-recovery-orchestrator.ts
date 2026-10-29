import {
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';
import { buildLaunchRecoveryOrchestrator } from './launch-recovery-orchestrator.ts';
import { buildShipmentRecoveryPlaybookBridge } from './shipment-recovery-playbook-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_PRODUCTION_RECOVERY_CAP = 10;

export interface ProductionRecoveryOrchestratorReport {
  productionBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
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

/** Recovery path when production gate blocks deployment. */
export function buildProductionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ProductionRecoveryOrchestratorReport {
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const productionBlocked = !matchExplainabilityProductionAllowed(production);
  const steps: string[] = [];
  if (productionBlocked) {
    if (!production.operationsReady) {
      steps.push('Restore operations bundle: launch, GI delivery, and release export.');
    }
    if (!production.operationsExportReady) {
      steps.push('Emit session operations export before production.');
    }
    if (!production.releaseLaunchAligned) {
      steps.push('Align release readiness with launch GO.');
    }
    steps.push(...buildShipmentRecoveryPlaybookBridge(packs, params).steps.slice(0, 3));
    steps.push(
      ...buildLaunchRecoveryOrchestrator(packs, params, false).steps.slice(0, 3),
    );
  } else {
    steps.push('Production gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PRODUCTION_RECOVERY_CAP);
  return {
    productionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Production recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function productionRecoveryOrchestratorWithinCap(report: ProductionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PRODUCTION_RECOVERY_CAP;
}
