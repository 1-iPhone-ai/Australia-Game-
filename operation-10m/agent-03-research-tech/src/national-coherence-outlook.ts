import type {
  ResearchNationalCoherenceLink,
  ResearchNationalCoherenceOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic national research coherence horizon (read-only, round 11). */
export function computeResearchNationalCoherenceOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'diffusion'
    | 'diffusionForecast'
    | 'exportContinuityOutlook'
    | 'integrationRiskOutlook'
    | 'diffusionIntegrationSnapshot'
  >
): ResearchNationalCoherenceOutlook {
  const cells = ctx.diffusion ?? [];
  const integrated = cells.filter(c => c.level === 'integrated').length;
  const forecast = ctx.diffusionForecast;
  const exportOutlook = ctx.exportContinuityOutlook;
  const risk = ctx.integrationRiskOutlook;
  const horizonTurns = forecast?.horizonTurns ?? exportOutlook?.horizonTurns ?? 6;

  const nationalCoherenceScore = Math.min(
    100,
    Math.round(
      integrated * 9 +
        (forecast?.peakProjectedScore ?? 0) * 85 +
        (exportOutlook?.nationalContinuityScore ?? 0) * 0.2 -
        (risk?.nationalRiskScore ?? 0) * 0.15
    )
  );
  const projectedCoherenceScore = Math.min(
    100,
    Math.round(
      nationalCoherenceScore +
        (forecast?.peakProjectedScore ?? 0) * 40 +
        Math.max(0, (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)) *
          0.25
    )
  );

  const links: ResearchNationalCoherenceLink[] = cells
    .filter(c => c.level === 'integrated' || c.level === 'adopting')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(c => ({
      regionId: c.regionId,
      diffusionScore: c.score,
      driver: c.level === 'integrated' ? 'integrated_cluster' : 'adoption_wave',
    }));

  const priorPeak = ctx.diffusionIntegrationSnapshot?.peakMilestone ?? 0;
  const integrationMomentum = Math.max(0, integrated - priorPeak * 0.6);

  return {
    active: inputs.turn >= 8 || integrated > 0 || nationalCoherenceScore > 0 || (forecast?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalCoherenceScore,
    projectedCoherenceScore,
    integratedRegionCount: integrated,
    integrationMomentum: Math.round(integrationMomentum),
    links,
  };
}
