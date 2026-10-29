import {
  auditMatchExplainabilityConvergenceGate,
  matchExplainabilityConvergenceAllowed,
} from './match-explainability-convergence-gate.ts';
import {
  buildMatchExplainabilityNexusBundle,
  matchExplainabilityNexusReady,
} from './match-explainability-nexus-bundle.ts';
import {
  buildSessionNexusExportBundle,
  sessionNexusExportShipped,
} from './session-nexus-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityConvergenceBundle {
  convergenceReady: boolean;
  convergenceAllowed: boolean;
  nexusReady: boolean;
  nexusExportShipped: boolean;
  narrativeLines: string[];
}

type ConvergenceParams = {
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

/** Convergence bundle: convergence gate and nexus export must both be green. */
export function buildMatchExplainabilityConvergenceBundle(
  packs: TurnExplainabilityPack[],
  params: ConvergenceParams,
): MatchExplainabilityConvergenceBundle {
  const convergence = auditMatchExplainabilityConvergenceGate(packs, params);
  const nexus = buildMatchExplainabilityNexusBundle(packs, params);
  const nexusExport = buildSessionNexusExportBundle(packs, params);
  const convergenceAllowed = matchExplainabilityConvergenceAllowed(convergence);
  const nexusReady = matchExplainabilityNexusReady(nexus);
  const nexusExportShipped = sessionNexusExportShipped(nexusExport);
  const convergenceReady = convergenceAllowed && nexusReady && nexusExportShipped;
  const narrativeLines = [
    `Match explainability convergence bundle: ${convergenceReady ? 'READY' : 'PENDING'} (gate ${convergenceAllowed ? 'ok' : 'fail'}, nexus ${nexusReady ? 'ok' : 'fail'}).`,
    ...convergence.narrativeLines.slice(0, 2),
    ...nexus.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONVERGENCE_NARRATIVE_CAP);
  return {
    convergenceReady,
    convergenceAllowed,
    nexusReady,
    nexusExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityConvergenceReady(bundle: MatchExplainabilityConvergenceBundle): boolean {
  return bundle.convergenceReady;
}
