import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveContinuityHandoffOutlook,
} from './types.ts';

/** Continuity handoff for Agent 25 O10-185 (read-only, scale wave round 27). */
export function computeResearchScaleWaveContinuityHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveIntegrationContinuityOutlook'
    | 'scaleWavePostSealHandoffOutlook'
    | 'integrationContinuitySnapshot'
    | 'postSealHandoffSnapshot'
  >
): ResearchScaleWaveContinuityHandoffOutlook {
  const continuity = ctx.scaleWaveIntegrationContinuityOutlook;
  const postSeal = ctx.scaleWavePostSealHandoffOutlook;
  const horizonTurns = continuity?.horizonTurns ?? postSeal?.horizonTurns ?? 6;
  const waveOrdinal = 27;

  const continuityScore = continuity?.integrationContinuityScore ?? 0;
  const postSealScore = postSeal?.postSealHandoffScore ?? 0;
  const priorContinuityPeak = ctx.integrationContinuitySnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, continuityScore - priorContinuityPeak * 0.19);

  const continuityHandoffScore = Math.min(
    100,
    Math.round(
      continuityScore * 0.34 +
        postSealScore * 0.17 +
        handoffMomentum * 0.22 +
        (continuity?.dryRunEligible ? 13 : 0) +
        (ctx.postSealHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    continuityHandoffScore >= 74 ||
    (continuity?.dryRunEligible && continuityScore >= 70);

  const priorHints = [
    continuity?.integrationBaselineShaHint,
    postSeal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (continuity?.active ?? false) ||
      continuityHandoffScore > 0 ||
      (postSeal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    continuityHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '7c1cfd89',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_601_674,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-186' : null,
  };
}
