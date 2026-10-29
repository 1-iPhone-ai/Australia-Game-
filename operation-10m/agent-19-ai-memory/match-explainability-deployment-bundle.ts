import {
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';
import {
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
import {
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from './session-operations-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_DEPLOYMENT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityDeploymentBundle {
  deploymentReady: boolean;
  productionAllowed: boolean;
  operationsReady: boolean;
  narrativeLines: string[];
}

type DeployParams = {
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

/** Deployment bundle: production gate and operations stack must both be green. */
export function buildMatchExplainabilityDeploymentBundle(
  packs: TurnExplainabilityPack[],
  params: DeployParams,
): MatchExplainabilityDeploymentBundle {
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const productionAllowed = matchExplainabilityProductionAllowed(production);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const deploymentReady = productionAllowed && operationsReady;
  const narrativeLines = [
    `Match explainability deployment: ${deploymentReady ? 'READY' : 'PENDING'} (production ${productionAllowed ? 'ok' : 'fail'}, ops ${operationsReady ? 'ok' : 'fail'}).`,
    ...production.narrativeLines.slice(0, 2),
    ...ops.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_DEPLOYMENT_NARRATIVE_CAP);
  return { deploymentReady, productionAllowed, operationsReady, narrativeLines };
}

export function matchExplainabilityDeploymentReady(bundle: MatchExplainabilityDeploymentBundle): boolean {
  return bundle.deploymentReady;
}
