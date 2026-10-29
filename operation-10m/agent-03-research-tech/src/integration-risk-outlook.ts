import { RESEARCH_BRANCHES } from './branches.ts';
import type {
  ResearchBranchId,
  ResearchIntegrationRiskLink,
  ResearchIntegrationRiskOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic integration-risk projection for strategy dashboards (read-only, round 7). */
export function computeResearchIntegrationRiskOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    'readinessByBranch' | 'institutionUpgrades' | 'portfolioBalance' | 'institutionTierSnapshot'
  >
): ResearchIntegrationRiskOutlook {
  const links: ResearchIntegrationRiskLink[] = [];
  const readiness = ctx.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const portfolio = ctx.portfolioBalance ?? null;

  for (const branch of RESEARCH_BRANCHES) {
    const r = readiness[branch.id] ?? 0;
    if (r < 35) {
      links.push({
        branchId: branch.id,
        riskScore: Math.round(100 - r),
        driver: 'readiness_gap',
      });
    }
  }

  const dormantInstitutions = (ctx.institutionUpgrades ?? []).filter(u => u.tier === 'dormant').length;
  if (dormantInstitutions >= 3) {
    links.push({
      branchId: 'digital_frontier',
      riskScore: Math.min(100, dormantInstitutions * 12),
      driver: 'institution_dormant',
    });
  }

  const criticalHints = portfolio?.hints.filter(h => h.priority === 'critical').length ?? 0;
  if (criticalHints >= 2) {
    links.push({
      branchId: 'industrial_transformation',
      riskScore: Math.min(100, criticalHints * 22),
      driver: 'portfolio_imbalance',
    });
  }

  const nationalRiskScore =
    links.length === 0
      ? 0
      : Math.round(links.reduce((sum, l) => sum + l.riskScore, 0) / Math.max(1, links.length));

  return {
    active: links.length > 0 || inputs.turn >= 12,
    baseTurn: inputs.turn,
    nationalRiskScore,
    criticalBranchCount: links.filter(l => l.driver === 'readiness_gap' && l.riskScore >= 65).length,
    links: links.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8),
  };
}
