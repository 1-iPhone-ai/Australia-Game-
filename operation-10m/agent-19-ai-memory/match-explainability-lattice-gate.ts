import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-convergence-bundle.ts';
import {
  buildSessionConvergenceExportBundle,
  sessionConvergenceExportShipped,
} from './session-convergence-export-bundle.ts';
import { auditNexusConvergenceBridge, nexusConvergenceBridgeHealthy } from './nexus-convergence-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityLatticeGateReport {
  latticeAllowed: boolean;
  convergenceReady: boolean;
  convergenceExportShipped: boolean;
  nexusConvergenceHealthy: boolean;
  narrativeLines: string[];
}

/** Lattice gate: convergence bundle + convergence export + nexus/convergence bridge. */
export function auditMatchExplainabilityLatticeGate(
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
): MatchExplainabilityLatticeGateReport {
  const convergence = buildMatchExplainabilityConvergenceBundle(packs, params);
  const convergenceExport = buildSessionConvergenceExportBundle(packs, params);
  const bridge = auditNexusConvergenceBridge(packs, params);
  const convergenceReady = matchExplainabilityConvergenceReady(convergence);
  const convergenceExportShipped = sessionConvergenceExportShipped(convergenceExport);
  const nexusConvergenceHealthy = nexusConvergenceBridgeHealthy(bridge);
  const latticeAllowed = convergenceReady && convergenceExportShipped && nexusConvergenceHealthy;
  const narrativeLines = [
    `Match explainability lattice: ${latticeAllowed ? 'ALLOWED' : 'DENIED'} (convergence ${convergenceReady ? 'ok' : 'fail'}, export ${convergenceExportShipped ? 'ok' : 'fail'}).`,
    ...convergence.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    latticeAllowed,
    convergenceReady,
    convergenceExportShipped,
    nexusConvergenceHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityLatticeAllowed(report: MatchExplainabilityLatticeGateReport): boolean {
  return report.latticeAllowed;
}
