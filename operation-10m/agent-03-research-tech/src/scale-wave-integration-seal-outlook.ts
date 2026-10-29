import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveIntegrationSealOutlook,
} from './types.ts';

/** Wave 24 integration seal for Agent 25 O10-179 (read-only, final worker wave). */
export function computeResearchScaleWaveIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWavePostIntegrationDryRunOutlook'
    | 'mergedIntegrationBaselineOutlook'
    | 'postIntegrationDryRunSnapshot'
    | 'mergedIntegrationBaselineSnapshot'
  >
): ResearchScaleWaveIntegrationSealOutlook {
  const postDryRun = ctx.scaleWavePostIntegrationDryRunOutlook;
  const merged = ctx.mergedIntegrationBaselineOutlook;
  const horizonTurns = postDryRun?.horizonTurns ?? merged?.horizonTurns ?? 6;
  const waveOrdinal = 24;

  const postScore = postDryRun?.postIntegrationDryRunScore ?? 0;
  const mergedScore = merged?.mergedBaselineScore ?? 0;
  const priorPostPeak = ctx.postIntegrationDryRunSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, postScore - priorPostPeak * 0.24);

  const integrationSealScore = Math.min(
    100,
    Math.round(
      postScore * 0.34 +
        mergedScore * 0.2 +
        sealMomentum * 0.22 +
        (postDryRun?.dryRunEligible ? 16 : 0) +
        (ctx.mergedIntegrationBaselineSnapshot?.peakBand ?? 0) * 0.04
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    integrationSealScore >= 68 ||
    (postDryRun?.dryRunEligible && postScore >= 64);

  const priorHints = [
    postDryRun?.integrationBaselineShaHint,
    merged?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (postDryRun?.active ?? false) ||
      integrationSealScore > 0 ||
      (merged?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    integrationSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: 'b64a7aa8',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_487_095,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-180' : null,
  };
}
