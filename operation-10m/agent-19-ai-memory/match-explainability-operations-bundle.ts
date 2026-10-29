import {
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';
import {
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from './session-release-export-bundle.ts';
import { buildSessionGiDeliveryBundle, sessionGiDeliveryReady } from './session-gi-delivery-bundle.ts';
import { buildMatchExplainabilityReleaseBundle } from './match-explainability-release-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_OPS_NARRATIVE_CAP = 12;

export interface MatchExplainabilityOperationsBundle {
  operationsReady: boolean;
  launchAllowed: boolean;
  releaseExportEmitted: boolean;
  giDeliveryReady: boolean;
  narrativeLines: string[];
}

type OpsParams = {
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

/** Operations bundle: launch gate, release export, and GI delivery for live match tooling. */
export function buildMatchExplainabilityOperationsBundle(
  packs: TurnExplainabilityPack[],
  params: OpsParams,
): MatchExplainabilityOperationsBundle {
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const releaseExport = buildSessionReleaseExportBundle(packs, params);
  const giDelivery = buildSessionGiDeliveryBundle(packs, params);
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  const releaseExportEmitted = sessionReleaseExportEmitted(releaseExport);
  const giDeliveryReady = sessionGiDeliveryReady(giDelivery);
  const operationsReady = launchAllowed && releaseExportEmitted && giDeliveryReady;
  const narrativeLines = [
    `Match explainability operations: ${operationsReady ? 'READY' : 'STANDBY'} (launch ${launchAllowed ? 'GO' : 'NO-GO'}).`,
    ...release.narrativeLines.slice(0, 1),
    ...launch.narrativeLines.slice(0, 2),
    ...giDelivery.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_OPS_NARRATIVE_CAP);
  return {
    operationsReady,
    launchAllowed,
    releaseExportEmitted,
    giDeliveryReady,
    narrativeLines,
  };
}

export function matchExplainabilityOperationsReady(bundle: MatchExplainabilityOperationsBundle): boolean {
  return bundle.operationsReady;
}
