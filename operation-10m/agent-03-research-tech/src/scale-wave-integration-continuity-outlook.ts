import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveIntegrationContinuityOutlook,
} from './types.ts';

/** Integration continuity for Agent 25 O10-183 (read-only, scale wave round 26). */
export function computeResearchScaleWaveIntegrationContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWavePostSealHandoffOutlook'
    | 'scaleWaveIntegrationSealOutlook'
    | 'postSealHandoffSnapshot'
    | 'integrationSealSnapshot'
  >
): ResearchScaleWaveIntegrationContinuityOutlook {
  const postSeal = ctx.scaleWavePostSealHandoffOutlook;
  const seal = ctx.scaleWaveIntegrationSealOutlook;
  const horizonTurns = postSeal?.horizonTurns ?? seal?.horizonTurns ?? 6;
  const waveOrdinal = 26;

  const postSealScore = postSeal?.postSealHandoffScore ?? 0;
  const sealScore = seal?.integrationSealScore ?? 0;
  const priorPostSealPeak = ctx.postSealHandoffSnapshot?.peakBand ?? 0;
  const continuityMomentum = Math.max(0, postSealScore - priorPostSealPeak * 0.2);

  const integrationContinuityScore = Math.min(
    100,
    Math.round(
      postSealScore * 0.33 +
        sealScore * 0.19 +
        continuityMomentum * 0.23 +
        (postSeal?.dryRunEligible ? 14 : 0) +
        (ctx.integrationSealSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    integrationContinuityScore >= 72 ||
    (postSeal?.dryRunEligible && postSealScore >= 68);

  const priorHints = [
    postSeal?.integrationBaselineShaHint,
    seal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (postSeal?.active ?? false) ||
      integrationContinuityScore > 0 ||
      (seal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    integrationContinuityScore,
    continuityMomentum: Math.round(continuityMomentum),
    integrationBaselineShaHint: 'de3079f9',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_563_481,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-184' : null,
  };
}
