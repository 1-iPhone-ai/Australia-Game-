import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveHandoffIntegrationSealOutlook,
} from './types.ts';

/** Handoff integration seal for Agent 25 O10-189 (read-only, scale wave round 29). */
export function computeResearchScaleWaveHandoffIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveHandoffIntegrationOutlook'
    | 'scaleWaveContinuityHandoffOutlook'
    | 'handoffIntegrationSnapshot'
    | 'continuityHandoffSnapshot'
  >
): ResearchScaleWaveHandoffIntegrationSealOutlook {
  const integration = ctx.scaleWaveHandoffIntegrationOutlook;
  const handoff = ctx.scaleWaveContinuityHandoffOutlook;
  const horizonTurns = integration?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = 29;

  const integrationScore = integration?.handoffIntegrationScore ?? 0;
  const handoffScore = handoff?.continuityHandoffScore ?? 0;
  const priorIntegrationPeak = ctx.handoffIntegrationSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.17);

  const handoffIntegrationSealScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.32 +
        handoffScore * 0.18 +
        sealMomentum * 0.2 +
        (integration?.dryRunEligible ? 15 : 0) +
        (ctx.continuityHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    handoffIntegrationSealScore >= 76 ||
    (integration?.dryRunEligible && integrationScore >= 72);

  const priorHints = [
    integration?.integrationBaselineShaHint,
    handoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      handoffIntegrationSealScore > 0 ||
      (handoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    handoffIntegrationSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: '70df4aee',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_683_733,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-190' : null,
  };
}
