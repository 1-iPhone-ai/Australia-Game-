import { RESEARCH_BRANCHES } from './branches.ts';
import type {
  ResearchBranchId,
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchSynergyOutlook,
  UnlockedResearchNode,
} from './types.ts';
import { computeResearchScaleWaveReport } from './scale-wave.ts';

function branchTierCounts(nodes: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const out = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of nodes) {
    out[u.branchId] = (out[u.branchId] ?? 0) + 1;
  }
  return out;
}

/** Deterministic scale-wave synergy projection for strategy dashboards (read-only, round 6). */
export function computeResearchSynergyOutlook(
  inputs: ResearchProgressInputs,
  state: Pick<
    ResearchProgressState,
    'unlockedNodes' | 'readinessByBranch' | 'scaleWave' | 'portfolioBalance'
  >
): ResearchSynergyOutlook {
  const scaleWave =
    state.scaleWave ?? computeResearchScaleWaveReport(inputs, state.unlockedNodes ?? []);
  const counts = branchTierCounts(state.unlockedNodes ?? []);
  const activeBranches = RESEARCH_BRANCHES.filter(b => (counts[b.id] ?? 0) >= 2).length;
  const readiness = state.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const meanReadiness =
    RESEARCH_BRANCHES.reduce((sum, b) => sum + (readiness[b.id] ?? 0), 0) / Math.max(1, RESEARCH_BRANCHES.length);

  const horizonTurns = 6;
  const growthPerTurn = Math.min(
    8,
    Math.round(
      scaleWave.crossBranchSynergyScore * 0.04 +
        activeBranches * 1.2 +
        (state.portfolioBalance?.nationalBalanceScore ?? 50) * 0.03
    )
  );
  const projectedSynergyScore = Math.min(
    100,
    Math.round(scaleWave.crossBranchSynergyScore + growthPerTurn * horizonTurns + meanReadiness * 0.05)
  );

  const transferLinks = scaleWave.technologyTransferLinks.slice(0, 4).map(l => ({
    fromBranch: l.fromBranch,
    toBranch: l.toBranch,
    projectedStrength: Math.min(1, Math.round((l.strength + growthPerTurn * 0.02) * 1000) / 1000),
  }));

  return {
    active: scaleWave.active || activeBranches >= 2,
    baseTurn: inputs.turn,
    horizonTurns,
    currentSynergyScore: scaleWave.crossBranchSynergyScore,
    projectedSynergyScore,
    activeMultiBranchCount: activeBranches,
    transferLinks,
    dominantCapabilityCluster: scaleWave.dominantCapabilityCluster,
  };
}
