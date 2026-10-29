import type {
  ResearchExecutionLink,
  ResearchExecutionOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic national research execution readiness (read-only, round 14). */
export function computeResearchExecutionOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'horizonConvergenceOutlook'
    | 'strategicAlignmentOutlook'
    | 'integrationRiskOutlook'
    | 'horizonConvergenceSnapshot'
  >
): ResearchExecutionOutlook {
  const convergence = ctx.horizonConvergenceOutlook;
  const alignment = ctx.strategicAlignmentOutlook;
  const risk = ctx.integrationRiskOutlook;
  const horizonTurns = convergence?.horizonTurns ?? alignment?.horizonTurns ?? 6;

  const nationalExecutionScore = Math.min(
    100,
    Math.round(
      (convergence?.nationalConvergenceScore ?? 0) * 0.38 +
        (alignment?.nationalAlignmentScore ?? 0) * 0.32 +
        Math.max(0, 100 - (risk?.nationalRiskScore ?? 0)) * 0.22
    )
  );
  const projectedExecutionScore = Math.min(
    100,
    Math.round(
      nationalExecutionScore +
        Math.max(0, (convergence?.projectedConvergenceScore ?? 0) - (convergence?.nationalConvergenceScore ?? 0)) *
          0.25 +
        Math.max(0, (alignment?.projectedAlignmentScore ?? 0) - (alignment?.nationalAlignmentScore ?? 0)) * 0.15
    )
  );

  const links: ResearchExecutionLink[] = (convergence?.links ?? [])
    .slice(0, 3)
    .map(l => ({
      regionId: l.regionId,
      executionPriority: l.projectedPercent >= 55 ? 'accelerate' : l.projectedPercent >= 35 ? 'steady' : 'observe',
      convergenceDelta: l.deltaFromNow,
    }));

  const priorPeak = ctx.horizonConvergenceSnapshot?.peakBand ?? 0;
  const convergenceMomentum = Math.max(
    0,
    (convergence?.nationalConvergenceScore ?? 0) - priorPeak * 0.45
  );

  return {
    active:
      inputs.turn >= 12 ||
      (convergence?.active ?? false) ||
      (alignment?.active ?? false) ||
      nationalExecutionScore > 0 ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalExecutionScore,
    projectedExecutionScore,
    criticalRiskBranchCount: risk?.criticalBranchCount ?? 0,
    convergenceMomentum: Math.round(convergenceMomentum),
    links,
  };
}
