import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity for Agent 25 O10-207 (read-only, scale wave round 38). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook {
  const integrationSeal = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
  const horizonTurns = integrationSeal?.horizonTurns ?? integration?.horizonTurns ?? 6;
  const waveOrdinal = 38;

  const sealScore = integrationSeal?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationScore ?? 0;
  const priorSealPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?.peakBand ?? 0;
  const continuityMomentum = Math.max(0, sealScore - priorSealPeak * 0.08);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore = Math.min(
    100,
    Math.round(
      sealScore * 0.23 +
        integrationScore * 0.11 +
        continuityMomentum * 0.21 +
        (integrationSeal?.dryRunEligible ? 24 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore >= 85 ||
    (integrationSeal?.dryRunEligible && sealScore >= 81);

  const priorHints = [
    integrationSeal?.integrationBaselineShaHint,
    integration?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integrationSeal?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore > 0 ||
      (integration?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore,
    continuityMomentum: Math.round(continuityMomentum),
    integrationBaselineShaHint: 'b44b36f',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_039_227,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-208' : null,
  };
}
