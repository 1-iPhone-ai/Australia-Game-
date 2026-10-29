import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration for Agent 25 O10-203 (read-only, scale wave round 36). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffSnapshot'
    | 'sealHandoffIntegrationSealContinuitySnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook {
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook;
  const continuity = ctx.scaleWaveSealHandoffIntegrationSealContinuityOutlook;
  const horizonTurns = handoff?.horizonTurns ?? continuity?.horizonTurns ?? 6;
  const waveOrdinal = 36;

  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffScore ?? 0;
  const continuityScore = continuity?.sealHandoffIntegrationSealContinuityScore ?? 0;
  const priorHandoffPeak = ctx.sealHandoffIntegrationSealContinuityHandoffSnapshot?.peakBand ?? 0;
  const integrationMomentum = Math.max(0, handoffScore - priorHandoffPeak * 0.1);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationScore = Math.min(
    100,
    Math.round(
      handoffScore * 0.25 +
        continuityScore * 0.13 +
        integrationMomentum * 0.19 +
        (handoff?.dryRunEligible ? 22 : 0) +
        (ctx.sealHandoffIntegrationSealContinuitySnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationScore >= 83 ||
    (handoff?.dryRunEligible && handoffScore >= 79);

  const priorHints = [
    handoff?.integrationBaselineShaHint,
    continuity?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (handoff?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationScore > 0 ||
      (continuity?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationScore,
    integrationMomentum: Math.round(integrationMomentum),
    integrationBaselineShaHint: 'ea2bb03',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_962_828,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-204' : null,
  };
}
