import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveHandoffIntegrationOutlook,
} from './types.ts';

/** Handoff integration seal for Agent 25 O10-187 (read-only, scale wave round 28). */
export function computeResearchScaleWaveHandoffIntegrationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveContinuityHandoffOutlook'
    | 'scaleWaveIntegrationContinuityOutlook'
    | 'continuityHandoffSnapshot'
    | 'integrationContinuitySnapshot'
  >
): ResearchScaleWaveHandoffIntegrationOutlook {
  const handoff = ctx.scaleWaveContinuityHandoffOutlook;
  const continuity = ctx.scaleWaveIntegrationContinuityOutlook;
  const horizonTurns = handoff?.horizonTurns ?? continuity?.horizonTurns ?? 6;
  const waveOrdinal = 28;

  const handoffScore = handoff?.continuityHandoffScore ?? 0;
  const continuityScore = continuity?.integrationContinuityScore ?? 0;
  const priorHandoffPeak = ctx.continuityHandoffSnapshot?.peakBand ?? 0;
  const integrationMomentum = Math.max(0, handoffScore - priorHandoffPeak * 0.18);

  const handoffIntegrationScore = Math.min(
    100,
    Math.round(
      handoffScore * 0.33 +
        continuityScore * 0.19 +
        integrationMomentum * 0.21 +
        (handoff?.dryRunEligible ? 14 : 0) +
        (ctx.integrationContinuitySnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    handoffIntegrationScore >= 75 ||
    (handoff?.dryRunEligible && handoffScore >= 71);

  const priorHints = [
    handoff?.integrationBaselineShaHint,
    continuity?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (handoff?.active ?? false) ||
      handoffIntegrationScore > 0 ||
      (continuity?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    handoffIntegrationScore,
    integrationMomentum: Math.round(integrationMomentum),
    integrationBaselineShaHint: 'b9e129bd',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_645_538,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-188' : null,
  };
}
