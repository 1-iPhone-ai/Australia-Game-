import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveProjectionOutlook,
} from './types.ts';

/** Wave projection readiness for Agent 25 dry-run (read-only, round 18 / O10-166). */
export function computeResearchScaleWaveProjectionOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'nationalIntegrationOutlook'
    | 'scaleWaveMaturityOutlook'
    | 'nationalIntegrationSnapshot'
    | 'scaleWaveMaturitySnapshot'
  >
): ResearchScaleWaveProjectionOutlook {
  const integration = ctx.nationalIntegrationOutlook;
  const maturity = ctx.scaleWaveMaturityOutlook;
  const horizonTurns = integration?.horizonTurns ?? maturity?.horizonTurns ?? 6;

  const integrationScore = integration?.nationalIntegrationScore ?? 0;
  const projectedIntegration = integration?.projectedIntegrationScore ?? 0;
  const maturityScore = maturity?.nationalMaturityScore ?? 0;
  const projectedMaturity = maturity?.projectedMaturityScore ?? 0;

  const priorIntegrationPeak = ctx.nationalIntegrationSnapshot?.peakBand ?? 0;
  const integrationMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.4);

  const projectionReadinessScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.38 +
        projectedIntegration * 0.22 +
        maturityScore * 0.22 +
        projectedMaturity * 0.1 +
        integrationMomentum * 0.08
    )
  );

  const waveOrdinal = 18;
  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    projectionReadinessScore >= 55 ||
    (integration?.nationalIntegrationCount ?? 0) >= 2;

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      (maturity?.active ?? false) ||
      projectionReadinessScore > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    projectionReadinessScore,
    integrationBandHeadroom: Math.max(0, 90 - (ctx.nationalIntegrationSnapshot?.peakBand ?? 0)),
    maturityBandHeadroom: Math.max(0, 85 - (ctx.scaleWaveMaturitySnapshot?.peakBand ?? 0)),
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-166' : null,
  };
}
