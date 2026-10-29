import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal for Agent 25 O10-205 (read-only, scale wave round 37). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook {
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook;
  const horizonTurns = integration?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = 37;

  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationScore ?? 0;
  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffScore ?? 0;
  const priorIntegrationPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.09);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.24 +
        handoffScore * 0.12 +
        sealMomentum * 0.2 +
        (integration?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore >= 84 ||
    (integration?.dryRunEligible && integrationScore >= 80);

  const priorHints = [
    integration?.integrationBaselineShaHint,
    handoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore > 0 ||
      (handoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: 'cfb4603',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_001_028,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-206' : null,
  };
}
