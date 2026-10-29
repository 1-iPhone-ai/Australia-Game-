import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration for Agent 25 O10-211 (read-only, scale wave round 40). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook {
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook;
  const continuity = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook;
  const horizonTurns = handoff?.horizonTurns ?? continuity?.horizonTurns ?? 6;
  const waveOrdinal = 40;

  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore ?? 0;
  const continuityScore = continuity?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0;
  const priorHandoffPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?.peakBand ?? 0;
  const integrationMomentum = Math.max(0, handoffScore - priorHandoffPeak * 0.1);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore = Math.min(
    100,
    Math.round(
      handoffScore * 0.24 +
        continuityScore * 0.12 +
        integrationMomentum * 0.2 +
        (handoff?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore >= 84 ||
    (handoff?.dryRunEligible && handoffScore >= 80);

  const priorHints = [
    handoff?.integrationBaselineShaHint,
    continuity?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (handoff?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore > 0 ||
      (continuity?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore,
    integrationMomentum: Math.round(integrationMomentum),
    integrationBaselineShaHint: '6f7fa49',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_115_625,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-212' : null,
  };
}
