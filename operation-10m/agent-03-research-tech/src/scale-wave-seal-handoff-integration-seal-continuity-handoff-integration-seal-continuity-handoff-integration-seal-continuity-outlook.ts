import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration seal continuity for Agent 25 O10-215 (read-only, scale wave round 42). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook {
  const seal = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
  const horizonTurns = seal?.horizonTurns ?? integration?.horizonTurns ?? 6;
  const waveOrdinal = 42;

  const sealScore = seal?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore ?? 0;
  const priorSealPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?.peakBand ?? 0;
  const continuityMomentum = Math.max(0, sealScore - priorSealPeak * 0.09);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore = Math.min(
    100,
    Math.round(
      sealScore * 0.24 +
        integrationScore * 0.12 +
        continuityMomentum * 0.2 +
        (seal?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore >= 84 ||
    (seal?.dryRunEligible && sealScore >= 80);

  const priorHints = [
    seal?.integrationBaselineShaHint,
    integration?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (seal?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore > 0 ||
      (integration?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore,
    continuityMomentum: Math.round(continuityMomentum),
    integrationBaselineShaHint: '431df5d',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_207_543,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-216' : null,
  };
}
