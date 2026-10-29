import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveIntegrationSealHandoffOutlook,
} from './types.ts';

/** Integration seal handoff for Agent 25 O10-191 (read-only, scale wave round 30). */
export function computeResearchScaleWaveIntegrationSealHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveHandoffIntegrationSealOutlook'
    | 'scaleWaveHandoffIntegrationOutlook'
    | 'handoffIntegrationSealSnapshot'
    | 'handoffIntegrationSnapshot'
  >
): ResearchScaleWaveIntegrationSealHandoffOutlook {
  const seal = ctx.scaleWaveHandoffIntegrationSealOutlook;
  const integration = ctx.scaleWaveHandoffIntegrationOutlook;
  const horizonTurns = seal?.horizonTurns ?? integration?.horizonTurns ?? 6;
  const waveOrdinal = 30;

  const sealScore = seal?.handoffIntegrationSealScore ?? 0;
  const integrationScore = integration?.handoffIntegrationScore ?? 0;
  const priorSealPeak = ctx.handoffIntegrationSealSnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, sealScore - priorSealPeak * 0.16);

  const integrationSealHandoffScore = Math.min(
    100,
    Math.round(
      sealScore * 0.31 +
        integrationScore * 0.17 +
        handoffMomentum * 0.19 +
        (seal?.dryRunEligible ? 16 : 0) +
        (ctx.handoffIntegrationSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    integrationSealHandoffScore >= 77 ||
    (seal?.dryRunEligible && sealScore >= 73);

  const priorHints = [
    seal?.integrationBaselineShaHint,
    integration?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (seal?.active ?? false) ||
      integrationSealHandoffScore > 0 ||
      (integration?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    integrationSealHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '88fa570',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_721_932,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-192' : null,
  };
}
