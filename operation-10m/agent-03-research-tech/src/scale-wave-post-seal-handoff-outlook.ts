import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWavePostSealHandoffOutlook,
} from './types.ts';

/** Post-seal handoff for Agent 25 O10-181 (read-only, round 25). */
export function computeResearchScaleWavePostSealHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveIntegrationSealOutlook'
    | 'scaleWavePostIntegrationDryRunOutlook'
    | 'integrationSealSnapshot'
    | 'postIntegrationDryRunSnapshot'
  >
): ResearchScaleWavePostSealHandoffOutlook {
  const seal = ctx.scaleWaveIntegrationSealOutlook;
  const postDryRun = ctx.scaleWavePostIntegrationDryRunOutlook;
  const horizonTurns = seal?.horizonTurns ?? postDryRun?.horizonTurns ?? 6;
  const waveOrdinal = 25;

  const sealScore = seal?.integrationSealScore ?? 0;
  const postScore = postDryRun?.postIntegrationDryRunScore ?? 0;
  const priorSealPeak = ctx.integrationSealSnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, sealScore - priorSealPeak * 0.22);

  const postSealHandoffScore = Math.min(
    100,
    Math.round(
      sealScore * 0.35 +
        postScore * 0.18 +
        handoffMomentum * 0.21 +
        (seal?.dryRunEligible ? 15 : 0) +
        (ctx.postIntegrationDryRunSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    postSealHandoffScore >= 70 ||
    (seal?.dryRunEligible && sealScore >= 66);

  const priorHints = [
    seal?.integrationBaselineShaHint,
    postDryRun?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (seal?.active ?? false) ||
      postSealHandoffScore > 0 ||
      (postDryRun?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    postSealHandoffScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '8d741ac7',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_525_288,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-182' : null,
  };
}
