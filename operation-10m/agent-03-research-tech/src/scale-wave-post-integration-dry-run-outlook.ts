import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWavePostIntegrationDryRunOutlook,
} from './types.ts';

/** Post-integration dry-run handoff for Agent 25 O10-177 (read-only, round 23). */
export function computeResearchScaleWavePostIntegrationDryRunOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'mergedIntegrationBaselineOutlook'
    | 'trancheDryRunHandoffOutlook'
    | 'mergedIntegrationBaselineSnapshot'
    | 'dryRunHandoffSnapshot'
  >
): ResearchScaleWavePostIntegrationDryRunOutlook {
  const merged = ctx.mergedIntegrationBaselineOutlook;
  const handoff = ctx.trancheDryRunHandoffOutlook;
  const horizonTurns = merged?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = 23;

  const mergedScore = merged?.mergedBaselineScore ?? 0;
  const handoffScore = handoff?.handoffReadinessScore ?? 0;
  const priorMergedPeak = ctx.mergedIntegrationBaselineSnapshot?.peakBand ?? 0;
  const dryRunMomentum = Math.max(0, mergedScore - priorMergedPeak * 0.26);

  const postIntegrationDryRunScore = Math.min(
    100,
    Math.round(
      mergedScore * 0.36 +
        handoffScore * 0.22 +
        dryRunMomentum * 0.2 +
        (merged?.dryRunEligible ? 14 : 0) +
        (ctx.dryRunHandoffSnapshot?.peakBand ?? 0) * 0.04
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    postIntegrationDryRunScore >= 66 ||
    (merged?.dryRunEligible && mergedScore >= 62);

  const priorHints = [
    merged?.integrationBaselineShaHint,
    handoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (merged?.active ?? false) ||
      postIntegrationDryRunScore > 0 ||
      (handoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    postIntegrationDryRunScore,
    dryRunMomentum: Math.round(dryRunMomentum),
    integrationBaselineShaHint: 'b23e1449',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_448_902,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-178' : null,
  };
}
