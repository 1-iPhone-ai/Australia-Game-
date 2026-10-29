import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffContinuityOutlook,
} from './types.ts';

/** Seal handoff continuity for Agent 25 O10-193 (read-only, scale wave round 31). */
export function computeResearchScaleWaveSealHandoffContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveIntegrationSealHandoffOutlook'
    | 'scaleWaveHandoffIntegrationSealOutlook'
    | 'integrationSealHandoffSnapshot'
    | 'handoffIntegrationSealSnapshot'
  >
): ResearchScaleWaveSealHandoffContinuityOutlook {
  const sealHandoff = ctx.scaleWaveIntegrationSealHandoffOutlook;
  const seal = ctx.scaleWaveHandoffIntegrationSealOutlook;
  const horizonTurns = sealHandoff?.horizonTurns ?? seal?.horizonTurns ?? 6;
  const waveOrdinal = 31;

  const handoffScore = sealHandoff?.integrationSealHandoffScore ?? 0;
  const sealScore = seal?.handoffIntegrationSealScore ?? 0;
  const priorHandoffPeak = ctx.integrationSealHandoffSnapshot?.peakBand ?? 0;
  const continuityMomentum = Math.max(0, handoffScore - priorHandoffPeak * 0.15);

  const sealHandoffContinuityScore = Math.min(
    100,
    Math.round(
      handoffScore * 0.3 +
        sealScore * 0.16 +
        continuityMomentum * 0.18 +
        (sealHandoff?.dryRunEligible ? 17 : 0) +
        (ctx.handoffIntegrationSealSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffContinuityScore >= 78 ||
    (sealHandoff?.dryRunEligible && handoffScore >= 74);

  const priorHints = [
    sealHandoff?.integrationBaselineShaHint,
    seal?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (sealHandoff?.active ?? false) ||
      sealHandoffContinuityScore > 0 ||
      (seal?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffContinuityScore,
    continuityMomentum: Math.round(continuityMomentum),
    integrationBaselineShaHint: '81b50b8',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_760_131,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-194' : null,
  };
}
