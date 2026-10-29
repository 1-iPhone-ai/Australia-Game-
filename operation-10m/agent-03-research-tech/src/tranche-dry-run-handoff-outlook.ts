import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchTrancheDryRunHandoffOutlook,
} from './types.ts';

/** Agent 25 post-wave dry-run handoff signal (read-only, round 21 / O10-173). */
export function computeResearchTrancheDryRunHandoffOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveIntegrationGateOutlook'
    | 'trancheProjectionReadinessOutlook'
    | 'integrationGateSnapshot'
    | 'trancheProjectionSnapshot'
  >
): ResearchTrancheDryRunHandoffOutlook {
  const gate = ctx.scaleWaveIntegrationGateOutlook;
  const tranche = ctx.trancheProjectionReadinessOutlook;
  const horizonTurns = gate?.horizonTurns ?? tranche?.horizonTurns ?? 6;
  const waveOrdinal = 21;

  const gateScore = gate?.integrationGateScore ?? 0;
  const trancheScore = tranche?.trancheReadinessScore ?? 0;
  const priorGatePeak = ctx.integrationGateSnapshot?.peakBand ?? 0;
  const handoffMomentum = Math.max(0, gateScore - priorGatePeak * 0.3);

  const handoffReadinessScore = Math.min(
    100,
    Math.round(
      gateScore * 0.42 +
        trancheScore * 0.26 +
        handoffMomentum * 0.16 +
        (gate?.dryRunEligible ? 11 : 0) +
        (ctx.trancheProjectionSnapshot?.peakBand ?? 0) * 0.06
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    handoffReadinessScore >= 62 ||
    (gate?.dryRunEligible && gateScore >= 58);

  return {
    active:
      dryRunEligible ||
      (gate?.active ?? false) ||
      handoffReadinessScore > 0 ||
      (tranche?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    handoffReadinessScore,
    handoffMomentum: Math.round(handoffMomentum),
    integrationBaselineShaHint: '99f2e72b',
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-174' : null,
  };
}
