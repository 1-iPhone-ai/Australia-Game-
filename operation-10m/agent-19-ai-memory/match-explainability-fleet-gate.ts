import {
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';
import {
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from './session-deployment-export-bundle.ts';
import {
  auditOperationsProductionBridge,
  operationsProductionBridgeHealthy,
} from './operations-production-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityFleetGateReport {
  fleetAllowed: boolean;
  deploymentReady: boolean;
  deploymentExportShipped: boolean;
  opsProductionHealthy: boolean;
  narrativeLines: string[];
}

/** Fleet gate: deployment bundle + deployment export + ops/production bridge. */
export function auditMatchExplainabilityFleetGate(
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
): MatchExplainabilityFleetGateReport {
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deployExport = buildSessionDeploymentExportBundle(packs, params);
  const bridge = auditOperationsProductionBridge(packs, params);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const deploymentExportShipped = sessionDeploymentExportShipped(deployExport);
  const opsProductionHealthy = operationsProductionBridgeHealthy(bridge);
  const fleetAllowed = deploymentReady && deploymentExportShipped && opsProductionHealthy;
  const narrativeLines = [
    `Match explainability fleet: ${fleetAllowed ? 'ALLOWED' : 'DENIED'} (deploy ${deploymentReady ? 'ok' : 'fail'}, export ${deploymentExportShipped ? 'ok' : 'fail'}).`,
    ...deployment.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    fleetAllowed,
    deploymentReady,
    deploymentExportShipped,
    opsProductionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityFleetAllowed(report: MatchExplainabilityFleetGateReport): boolean {
  return report.fleetAllowed;
}
