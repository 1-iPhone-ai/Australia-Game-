import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration seal continuity handoff for Agent 25 O10-217 (read-only, scale wave round 43). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook {
  const continuity = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook;
  const seal = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
  const horizonTurns = continuity?.horizonTurns ?? seal?.horizonTurns ?? 6;
  const waveOrdinal = 43;

  const continuityScore = continuity?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore ?? 0;
  const sealScore = seal?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const priorContinuityPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, continuityScore - priorContinuityPeak * 0.09);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore = Math.min(
    100,
    Math.round(
      continuityScore * 0.24 +
        sealScore * 0.12 +
        handoffMomentum * 0.2 +
        (continuity?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore >= 84 ||
    (continuity?.dryRunEligible && continuityScore >= 80);

  const priorHints = [
    continuity?.integrationBaselineShaHint,
    seal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (continuity?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore > 0 ||
      (seal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '641d7d16',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_253_960,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-218' : null,
  };
}
