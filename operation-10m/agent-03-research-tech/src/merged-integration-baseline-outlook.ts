import type {
  ResearchMergedIntegrationBaselineOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Merged Agent 25 integration baseline chain (read-only, round 22 / O10-175). */
export function computeResearchMergedIntegrationBaselineOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'trancheDryRunHandoffOutlook'
    | 'scaleWaveIntegrationGateOutlook'
    | 'dryRunHandoffSnapshot'
    | 'integrationGateSnapshot'
  >
): ResearchMergedIntegrationBaselineOutlook {
  const handoff = ctx.trancheDryRunHandoffOutlook;
  const gate = ctx.scaleWaveIntegrationGateOutlook;
  const horizonTurns = handoff?.horizonTurns ?? gate?.horizonTurns ?? 6;
  const waveOrdinal = 22;

  const handoffScore = handoff?.handoffReadinessScore ?? 0;
  const gateScore = gate?.integrationGateScore ?? 0;
  const priorHandoffPeak = ctx.dryRunHandoffSnapshot?.peakBand ?? 0;
  const mergeMomentum = Math.max(0, handoffScore - priorHandoffPeak * 0.28);

  const mergedBaselineScore = Math.min(
    100,
    Math.round(
      handoffScore * 0.38 +
        gateScore * 0.24 +
        mergeMomentum * 0.18 +
        (handoff?.dryRunEligible ? 12 : 0) +
        (ctx.integrationGateSnapshot?.peakBand ?? 0) * 0.05
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    mergedBaselineScore >= 64 ||
    (handoff?.dryRunEligible && handoffScore >= 60);

  const priorHints = [
    handoff?.integrationBaselineShaHint,
    gate?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (handoff?.active ?? false) ||
      mergedBaselineScore > 0 ||
      (gate?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    mergedBaselineScore,
    mergeMomentum: Math.round(mergeMomentum),
    integrationBaselineShaHint: '634656bb',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 1_401_419,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-176' : null,
  };
}
