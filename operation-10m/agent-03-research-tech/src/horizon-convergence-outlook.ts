import type {
  ResearchHorizonConvergenceLink,
  ResearchHorizonConvergenceOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic multi-horizon convergence projection (read-only, round 13). */
export function computeResearchHorizonConvergenceOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'diffusionForecast'
    | 'strategicAlignmentOutlook'
    | 'nationalCoherenceOutlook'
    | 'diffusionForecastSnapshot'
  >
): ResearchHorizonConvergenceOutlook {
  const forecast = ctx.diffusionForecast;
  const alignment = ctx.strategicAlignmentOutlook;
  const coherence = ctx.nationalCoherenceOutlook;
  const horizonTurns = forecast?.horizonTurns ?? alignment?.horizonTurns ?? 6;

  const peakPercent = Math.round(Math.min(100, (forecast?.peakProjectedScore ?? 0) * 100));
  const nationalConvergenceScore = Math.min(
    100,
    Math.round(
      peakPercent * 0.42 +
        (alignment?.nationalAlignmentScore ?? 0) * 0.28 +
        (coherence?.nationalCoherenceScore ?? 0) * 0.22
    )
  );
  const projectedConvergenceScore = Math.min(
    100,
    Math.round(
      nationalConvergenceScore +
        peakPercent * 0.12 +
        Math.max(0, (coherence?.projectedCoherenceScore ?? 0) - (coherence?.nationalCoherenceScore ?? 0)) * 0.2
    )
  );

  const links: ResearchHorizonConvergenceLink[] = (forecast?.projections ?? [])
    .filter(p => p.turn === inputs.turn + horizonTurns)
    .sort((a, b) => b.projectedScore - a.projectedScore)
    .slice(0, 4)
    .map(p => ({
      regionId: p.regionId,
      projectedPercent: Math.round(Math.min(100, p.projectedScore * 100)),
      deltaFromNow: p.deltaFromNow,
    }));

  const priorPeak = ctx.diffusionForecastSnapshot?.peakBand ?? 0;
  const forecastMomentum = Math.max(0, peakPercent - priorPeak * 0.55);

  return {
    active: inputs.turn >= 10 || (forecast?.active ?? false) || peakPercent > 0 || links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalConvergenceScore,
    projectedConvergenceScore,
    peakRegionId: forecast?.peakRegionId ?? null,
    forecastMomentum: Math.round(forecastMomentum),
    links,
  };
}
