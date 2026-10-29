import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveIntegrationGateOutlook,
} from './types.ts';

/** Wave 20 integration gate for Agent 25 O10-171 dry-run (read-only, round 20 / O10-170). */
export function computeResearchScaleWaveIntegrationGateOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'trancheProjectionReadinessOutlook'
    | 'scaleWaveProjectionOutlook'
    | 'trancheProjectionSnapshot'
    | 'scaleWaveProjectionSnapshot'
  >
): ResearchScaleWaveIntegrationGateOutlook {
  const tranche = ctx.trancheProjectionReadinessOutlook;
  const projection = ctx.scaleWaveProjectionOutlook;
  const horizonTurns = tranche?.horizonTurns ?? projection?.horizonTurns ?? 6;
  const waveOrdinal = 20;

  const trancheScore = tranche?.trancheReadinessScore ?? 0;
  const projectionScore = projection?.projectionReadinessScore ?? 0;
  const priorTranchePeak = ctx.trancheProjectionSnapshot?.peakBand ?? 0;
  const gateMomentum = Math.max(0, trancheScore - priorTranchePeak * 0.32);

  const integrationGateScore = Math.min(
    100,
    Math.round(
      trancheScore * 0.4 +
        projectionScore * 0.28 +
        gateMomentum * 0.17 +
        (tranche?.dryRunEligible ? 10 : 0) +
        (ctx.scaleWaveProjectionSnapshot?.peakBand ?? 0) * 0.05
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    integrationGateScore >= 60 ||
    (tranche?.dryRunEligible && trancheScore >= 55);

  return {
    active:
      dryRunEligible ||
      (tranche?.active ?? false) ||
      integrationGateScore > 0 ||
      (projection?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    integrationGateScore,
    gateMomentum: Math.round(gateMomentum),
    integrationBaselineShaHint: '680b9954',
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-171' : null,
  };
}
