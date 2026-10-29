import {
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';
import {
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';
import {
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from './session-deployment-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SUSTAINMENT_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySustainmentBundle {
  sustainmentReady: boolean;
  fleetAllowed: boolean;
  deploymentReady: boolean;
  deploymentExportShipped: boolean;
  narrativeLines: string[];
}

type SustainmentParams = {
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

/** Sustainment bundle: fleet gate and deployment export must both be green. */
export function buildMatchExplainabilitySustainmentBundle(
  packs: TurnExplainabilityPack[],
  params: SustainmentParams,
): MatchExplainabilitySustainmentBundle {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deployExport = buildSessionDeploymentExportBundle(packs, params);
  const fleetAllowed = matchExplainabilityFleetAllowed(fleet);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const deploymentExportShipped = sessionDeploymentExportShipped(deployExport);
  const sustainmentReady = fleetAllowed && deploymentReady && deploymentExportShipped;
  const narrativeLines = [
    `Match explainability sustainment: ${sustainmentReady ? 'READY' : 'PENDING'} (fleet ${fleetAllowed ? 'ok' : 'fail'}, deploy ${deploymentReady ? 'ok' : 'fail'}).`,
    ...fleet.narrativeLines.slice(0, 2),
    ...deployment.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SUSTAINMENT_NARRATIVE_CAP);
  return {
    sustainmentReady,
    fleetAllowed,
    deploymentReady,
    deploymentExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySustainmentReady(bundle: MatchExplainabilitySustainmentBundle): boolean {
  return bundle.sustainmentReady;
}
