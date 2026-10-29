import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationOutlook,
} from './types.ts';

/** Seal handoff integration for Agent 25 O10-195 (read-only, scale wave round 32). */
export function computeResearchScaleWaveSealHandoffIntegrationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffContinuityOutlook'
    | 'scaleWaveIntegrationSealHandoffOutlook'
    | 'sealHandoffContinuitySnapshot'
    | 'integrationSealHandoffSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationOutlook {
  const continuity = ctx.scaleWaveSealHandoffContinuityOutlook;
  const sealHandoff = ctx.scaleWaveIntegrationSealHandoffOutlook;
  const horizonTurns = continuity?.horizonTurns ?? sealHandoff?.horizonTurns ?? 6;
  const waveOrdinal = 32;

  const continuityScore = continuity?.sealHandoffContinuityScore ?? 0;
  const handoffScore = sealHandoff?.integrationSealHandoffScore ?? 0;
  const priorContinuityPeak = ctx.sealHandoffContinuitySnapshot?.peakBand ?? 0;
  const integrationMomentum = Math.max(0, continuityScore - priorContinuityPeak * 0.14);

  const sealHandoffIntegrationScore = Math.min(
    100,
    Math.round(
      continuityScore * 0.29 +
        handoffScore * 0.15 +
        integrationMomentum * 0.17 +
        (continuity?.dryRunEligible ? 18 : 0) +
        (ctx.integrationSealHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationScore >= 79 ||
    (continuity?.dryRunEligible && continuityScore >= 75);

  const priorHints = [
    continuity?.integrationBaselineShaHint,
    sealHandoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (continuity?.active ?? false) ||
      sealHandoffIntegrationScore > 0 ||
      (sealHandoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationScore,
    integrationMomentum: Math.round(integrationMomentum),
    integrationBaselineShaHint: 'aa70dac',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_798_330,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-196' : null,
  };
}
