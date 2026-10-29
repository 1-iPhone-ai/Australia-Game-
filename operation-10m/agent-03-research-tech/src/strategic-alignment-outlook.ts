import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchStrategicAlignmentLink,
  ResearchStrategicAlignmentOutlook,
} from './types.ts';

/** Deterministic cross-branch strategic alignment horizon (read-only, round 12). */
export function computeResearchStrategicAlignmentOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'portfolioBalance'
    | 'nationalCoherenceOutlook'
    | 'synergyOutlook'
    | 'portfolioBalanceSnapshot'
    | 'branchEmphasis'
  >
): ResearchStrategicAlignmentOutlook {
  const balance = ctx.portfolioBalance;
  const coherence = ctx.nationalCoherenceOutlook;
  const synergy = ctx.synergyOutlook;
  const horizonTurns = coherence?.horizonTurns ?? synergy?.horizonTurns ?? 6;

  const nationalAlignmentScore = Math.min(
    100,
    Math.round(
      (balance?.nationalBalanceScore ?? 50) * 0.45 +
        (coherence?.nationalCoherenceScore ?? 0) * 0.28 +
        (synergy?.currentSynergyScore ?? 0) * 0.18 -
        (balance?.hints.filter(h => h.priority === 'critical').length ?? 0) * 5
    )
  );
  const projectedAlignmentScore = Math.min(
    100,
    Math.round(
      nationalAlignmentScore +
        Math.max(0, (synergy?.projectedSynergyScore ?? 0) - (synergy?.currentSynergyScore ?? 0)) * 0.35 +
        (coherence?.projectedCoherenceScore ?? 0) * 0.08
    )
  );

  const emphasis = ctx.branchEmphasis ?? [];
  const links: ResearchStrategicAlignmentLink[] = (balance?.hints ?? [])
    .filter(h => h.suggestedEmphasis !== h.currentEmphasis || h.priority !== 'balanced')
    .slice(0, 5)
    .map(h => {
      const emph = emphasis.find(e => e.branchId === h.branchId)?.emphasis ?? h.currentEmphasis;
      return {
        branchId: h.branchId,
        emphasis: emph,
        driver: h.priority === 'critical' ? 'critical_gap' : 'emphasis_drift',
      };
    });

  const priorPeak = ctx.portfolioBalanceSnapshot?.peakBand ?? 0;
  const balanceMomentum = Math.max(0, (balance?.nationalBalanceScore ?? 0) - priorPeak * 0.5);

  return {
    active:
      inputs.turn >= 10 ||
      (balance?.active ?? false) ||
      links.length > 0 ||
      nationalAlignmentScore < 75,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalAlignmentScore,
    projectedAlignmentScore,
    misalignedBranchCount: links.filter(l => l.driver === 'emphasis_drift').length,
    balanceMomentum: Math.round(balanceMomentum),
    links,
  };
}
