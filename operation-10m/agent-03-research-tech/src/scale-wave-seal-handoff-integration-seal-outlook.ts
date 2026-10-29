import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealOutlook,
} from './types.ts';

/** Seal handoff integration seal for Agent 25 O10-197 (read-only, scale wave round 33). */
export function computeResearchScaleWaveSealHandoffIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationOutlook'
    | 'scaleWaveSealHandoffContinuityOutlook'
    | 'sealHandoffIntegrationSnapshot'
    | 'sealHandoffContinuitySnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealOutlook {
  const integration = ctx.scaleWaveSealHandoffIntegrationOutlook;
  const continuity = ctx.scaleWaveSealHandoffContinuityOutlook;
  const horizonTurns = integration?.horizonTurns ?? continuity?.horizonTurns ?? 6;
  const waveOrdinal = 33;

  const integrationScore = integration?.sealHandoffIntegrationScore ?? 0;
  const continuityScore = continuity?.sealHandoffContinuityScore ?? 0;
  const priorIntegrationPeak = ctx.sealHandoffIntegrationSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.13);

  const sealHandoffIntegrationSealScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.28 +
        continuityScore * 0.14 +
        sealMomentum * 0.16 +
        (integration?.dryRunEligible ? 19 : 0) +
        (ctx.sealHandoffContinuitySnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealScore >= 80 ||
    (integration?.dryRunEligible && integrationScore >= 76);

  const priorHints = [
    integration?.integrationBaselineShaHint,
    continuity?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      sealHandoffIntegrationSealScore > 0 ||
      (continuity?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: 'c5f6d0b',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_836_529,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-198' : null,
  };
}
