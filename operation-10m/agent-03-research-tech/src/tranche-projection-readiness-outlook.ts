import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchTrancheProjectionReadinessOutlook,
} from './types.ts';

/** Agent 25 full-chunks dry-run readiness (read-only, round 19 / O10-169). */
export function computeResearchTrancheProjectionReadinessOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveProjectionOutlook'
    | 'nationalIntegrationOutlook'
    | 'scaleWaveProjectionSnapshot'
    | 'nationalIntegrationSnapshot'
  >
): ResearchTrancheProjectionReadinessOutlook {
  const projection = ctx.scaleWaveProjectionOutlook;
  const integration = ctx.nationalIntegrationOutlook;
  const horizonTurns = projection?.horizonTurns ?? integration?.horizonTurns ?? 6;
  const waveOrdinal = 19;

  const readinessScore = projection?.projectionReadinessScore ?? 0;
  const integrationScore = integration?.nationalIntegrationScore ?? 0;
  const priorProjectionPeak = ctx.scaleWaveProjectionSnapshot?.peakBand ?? 0;
  const projectionMomentum = Math.max(0, readinessScore - priorProjectionPeak * 0.35);

  const trancheReadinessScore = Math.min(
    100,
    Math.round(
      readinessScore * 0.45 +
        integrationScore * 0.25 +
        projectionMomentum * 0.15 +
        (projection?.dryRunEligible ? 12 : 0) +
        (ctx.nationalIntegrationSnapshot?.peakBand ?? 0) * 0.08
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    trancheReadinessScore >= 58 ||
    (projection?.dryRunEligible && readinessScore >= 50);

  return {
    active:
      dryRunEligible ||
      (projection?.active ?? false) ||
      trancheReadinessScore > 0 ||
      (integration?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    trancheReadinessScore,
    projectionMomentum: Math.round(projectionMomentum),
    integrationBaselineShaHint: '7bd7b1f3',
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-169' : null,
  };
}
