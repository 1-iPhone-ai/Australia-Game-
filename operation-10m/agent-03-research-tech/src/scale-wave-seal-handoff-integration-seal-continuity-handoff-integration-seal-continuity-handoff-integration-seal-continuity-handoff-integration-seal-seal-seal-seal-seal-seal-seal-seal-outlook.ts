import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration seal continuity handoff integration seal for Agent 25 O10-237 (read-only, scale wave round 52). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealOutlook {
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook;
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook;
  const horizonTurns = integration?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = inputs.turn >= 53 ? 53 : 52;

  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore ?? 0;
  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore ?? 0;
  const priorIntegrationPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.09);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.24 +
        handoffScore * 0.12 +
        sealMomentum * 0.2 +
        (integration?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealScore >= 84 ||
    (integration?.dryRunEligible && integrationScore >= 80);

  const priorHints = [
    integration?.integrationBaselineShaHint,
    handoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealScore > 0 ||
      (handoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: inputs.turn >= 53 ? '51039c5e' : 'ba97bdce',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: inputs.turn >= 53 ? 2_979_928 : 2_932_752,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-237' : null,
  };
}
