import type {
  ResearchPortfolioStabilizationOutlook,
  ResearchPortfolioStabilizationLink,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic portfolio stabilization horizon (read-only, round 9). */
export function computeResearchPortfolioStabilizationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'portfolioBalance'
    | 'synergyOutlook'
    | 'integrationRiskOutlook'
    | 'adoptionHorizonOutlook'
    | 'synergySnapshot'
  >
): ResearchPortfolioStabilizationOutlook {
  const balance = ctx.portfolioBalance;
  const synergy = ctx.synergyOutlook;
  const risk = ctx.integrationRiskOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = synergy?.horizonTurns ?? 6;

  const nationalBalanceScore = balance?.nationalBalanceScore ?? 50;
  const criticalHints = balance?.hints.filter(h => h.priority === 'critical') ?? [];
  const nationalStabilizationScore = Math.min(
    100,
    Math.round(
      nationalBalanceScore * 0.55 +
        (synergy?.projectedSynergyScore ?? 0) * 0.25 +
        (adoption?.nationalAdoptionScore ?? 0) * 0.12 -
        (risk?.nationalRiskScore ?? 0) * 0.18
    )
  );
  const projectedStabilizationScore = Math.min(
    100,
    Math.round(
      nationalStabilizationScore +
        Math.max(0, (synergy?.projectedSynergyScore ?? 0) - (synergy?.currentSynergyScore ?? 0)) * 0.4 -
        criticalHints.length * 3
    )
  );

  const links: ResearchPortfolioStabilizationLink[] = criticalHints.slice(0, 4).map(h => ({
    branchId: h.branchId,
    readinessGap: h.readinessGap,
    driver: h.suggestedEmphasis !== h.currentEmphasis ? 'emphasis_mismatch' : 'readiness_lag',
  }));

  const priorPeak = ctx.synergySnapshot?.peakThreshold ?? 0;
  const synergyMomentum = Math.max(0, (synergy?.currentSynergyScore ?? 0) - priorPeak * 0.5);

  return {
    active:
      inputs.turn >= 10 ||
      criticalHints.length > 0 ||
      nationalStabilizationScore < 72 ||
      (balance?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalStabilizationScore,
    projectedStabilizationScore,
    criticalBranchCount: criticalHints.length,
    synergyMomentum: Math.round(synergyMomentum),
    links,
  };
}
