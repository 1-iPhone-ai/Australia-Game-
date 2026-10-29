import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff for Agent 25 O10-209 (read-only, scale wave round 39). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook {
  const continuity = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook;
  const integrationSeal = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
  const horizonTurns = continuity?.horizonTurns ?? integrationSeal?.horizonTurns ?? 6;
  const waveOrdinal = 39;

  const continuityScore = continuity?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0;
  const sealScore = integrationSeal?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const priorContinuityPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, continuityScore - priorContinuityPeak * 0.1);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore = Math.min(
    100,
    Math.round(
      continuityScore * 0.25 +
        sealScore * 0.13 +
        handoffMomentum * 0.19 +
        (continuity?.dryRunEligible ? 22 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore >= 83 ||
    (continuity?.dryRunEligible && continuityScore >= 79);

  const priorHints = [
    continuity?.integrationBaselineShaHint,
    integrationSeal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (continuity?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore > 0 ||
      (integrationSeal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '6134c6a',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_077_426,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-210' : null,
  };
}
