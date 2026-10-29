import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity for Agent 25 O10-199 (read-only, scale wave round 34). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealOutlook'
    | 'scaleWaveSealHandoffIntegrationOutlook'
    | 'sealHandoffIntegrationSealSnapshot'
    | 'sealHandoffIntegrationSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook {
  const integrationSeal = ctx.scaleWaveSealHandoffIntegrationSealOutlook;
  const integration = ctx.scaleWaveSealHandoffIntegrationOutlook;
  const horizonTurns = integrationSeal?.horizonTurns ?? integration?.horizonTurns ?? 6;
  const waveOrdinal = 34;

  const sealScore = integrationSeal?.sealHandoffIntegrationSealScore ?? 0;
  const integrationScore = integration?.sealHandoffIntegrationScore ?? 0;
  const priorSealPeak = ctx.sealHandoffIntegrationSealSnapshot?.peakBand ?? 0;
  const continuityMomentum = Math.max(0, sealScore - priorSealPeak * 0.12);

  const sealHandoffIntegrationSealContinuityScore = Math.min(
    100,
    Math.round(
      sealScore * 0.27 +
        integrationScore * 0.15 +
        continuityMomentum * 0.17 +
        (integrationSeal?.dryRunEligible ? 20 : 0) +
        (ctx.sealHandoffIntegrationSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityScore >= 81 ||
    (integrationSeal?.dryRunEligible && sealScore >= 77);

  const priorHints = [
    integrationSeal?.integrationBaselineShaHint,
    integration?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integrationSeal?.active ?? false) ||
      sealHandoffIntegrationSealContinuityScore > 0 ||
      (integration?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityScore,
    continuityMomentum: Math.round(continuityMomentum),
    integrationBaselineShaHint: '2187b54',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_886_428,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-200' : null,
  };
}
