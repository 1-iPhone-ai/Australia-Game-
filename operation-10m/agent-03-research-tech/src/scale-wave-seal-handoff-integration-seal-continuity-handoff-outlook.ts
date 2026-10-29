import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff for Agent 25 O10-201 (read-only, scale wave round 35). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityOutlook'
    | 'scaleWaveSealHandoffIntegrationSealOutlook'
    | 'sealHandoffIntegrationSealContinuitySnapshot'
    | 'sealHandoffIntegrationSealSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook {
  const continuity = ctx.scaleWaveSealHandoffIntegrationSealContinuityOutlook;
  const integrationSeal = ctx.scaleWaveSealHandoffIntegrationSealOutlook;
  const horizonTurns = continuity?.horizonTurns ?? integrationSeal?.horizonTurns ?? 6;
  const waveOrdinal = 35;

  const continuityScore = continuity?.sealHandoffIntegrationSealContinuityScore ?? 0;
  const sealScore = integrationSeal?.sealHandoffIntegrationSealScore ?? 0;
  const priorContinuityPeak = ctx.sealHandoffIntegrationSealContinuitySnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, continuityScore - priorContinuityPeak * 0.11);

  const sealHandoffIntegrationSealContinuityHandoffScore = Math.min(
    100,
    Math.round(
      continuityScore * 0.26 +
        sealScore * 0.14 +
        handoffMomentum * 0.18 +
        (continuity?.dryRunEligible ? 21 : 0) +
        (ctx.sealHandoffIntegrationSealSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffScore >= 82 ||
    (continuity?.dryRunEligible && continuityScore >= 78);

  const priorHints = [
    continuity?.integrationBaselineShaHint,
    integrationSeal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (continuity?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffScore > 0 ||
      (integrationSeal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '1f7d25b',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_924_628,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-202' : null,
  };
}
