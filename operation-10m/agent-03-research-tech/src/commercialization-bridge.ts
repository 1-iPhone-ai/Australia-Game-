import { RESEARCH_BRANCHES, RESEARCH_NODE_BY_ID } from './branches.ts';
import type {
  ResearchBranchEmphasisState,
  ResearchBranchId,
  ResearchCommercializationReport,
  ResearchProgressInputs,
  ResearchProgressState,
  UnlockedResearchNode,
} from './types.ts';

function maxTierByBranch(unlocked: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const tiers = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of unlocked) {
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    tiers[u.branchId] = Math.max(tiers[u.branchId], tier);
  }
  return tiers;
}

function exportPriorityFor(
  emphasis: ResearchBranchEmphasisState['emphasis'],
  tier: number,
  readiness: number
): ResearchCommercializationReport['hints'][number]['exportPriority'] {
  if (tier >= 4 && (emphasis === 'commercial' || emphasis === 'applied') && readiness >= 45) return 'high';
  if (tier >= 3 && readiness >= 35) return 'medium';
  return 'low';
}

/** Read-only V10.5 commercialization hints for copilot / national strategy panels. */
export function computeResearchCommercializationReport(
  inputs: ResearchProgressInputs,
  state: Pick<
    ResearchProgressState,
    'unlockedNodes' | 'readinessByBranch' | 'branchEmphasis' | 'scaleWave'
  >
): ResearchCommercializationReport {
  const tiers = maxTierByBranch(state.unlockedNodes);
  const emphasis = state.branchEmphasis ?? [];
  const hints: ResearchCommercializationReport['hints'] = [];

  for (const branch of RESEARCH_BRANCHES) {
    const tier = tiers[branch.id];
    if (tier < 1) continue;
    const emph = emphasis.find(e => e.branchId === branch.id)?.emphasis ?? 'fundamental';
    const readiness = state.readinessByBranch[branch.id] ?? 0;
    const cap = inputs.capabilities[branch.primaryCapability];
    hints.push({
      branchId: branch.id,
      emphasis: emph,
      readinessFloor: Math.max(20, readiness - 5),
      exportPriority: exportPriorityFor(emph, tier, readiness),
      linkedCapabilityId: branch.primaryCapability,
      rationale:
        cap?.maturity === 'nationally_integrated'
          ? `${branch.label}: integrated capability — prioritize export contracts`
          : `${branch.label}: tier ${tier} unlocks with ${emph} emphasis`,
    });
  }

  hints.sort((a, b) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return rank[b.exportPriority] - rank[a.exportPriority] || b.readinessFloor - a.readinessFloor;
  });

  const synergy = state.scaleWave?.crossBranchSynergyScore ?? 0;
  const nationalExportScore = Math.min(
    100,
    Math.round(hints.filter(h => h.exportPriority !== 'low').length * 11 + synergy * 0.35 + tier5Count(state) * 4)
  );

  return {
    active: hints.some(h => h.exportPriority !== 'low') || (state.scaleWave?.active ?? false),
    hints: hints.slice(0, 8),
    nationalExportScore,
  };
}

function tier5Count(state: Pick<ResearchProgressState, 'unlockedNodes'>): number {
  return state.unlockedNodes.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
}

/** Bounded readiness nudge when commercial emphasis aligns with tier-3+ progress. */
export function applyCommercializationReadinessNudge(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchCommercializationReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const out = { ...readinessByBranch };
  for (const hint of report.hints) {
    if (hint.exportPriority === 'low') continue;
    const bump = hint.exportPriority === 'high' ? 3 : 1;
    out[hint.branchId] = Math.min(100, (out[hint.branchId] ?? 0) + bump);
  }
  return out;
}
