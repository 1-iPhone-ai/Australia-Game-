import type {
  ResearchExportContinuityLink,
  ResearchExportContinuityOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic export continuity horizon (read-only, round 10). */
export function computeResearchExportContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'commercialization'
    | 'portfolioStabilizationOutlook'
    | 'adoptionHorizonOutlook'
    | 'commercializationSnapshot'
  >
): ResearchExportContinuityOutlook {
  const report = ctx.commercialization;
  const stabilization = ctx.portfolioStabilizationOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = stabilization?.horizonTurns ?? adoption?.horizonTurns ?? 6;

  const nationalExportScore = report?.nationalExportScore ?? 0;
  const nationalContinuityScore = Math.min(
    100,
    Math.round(
      nationalExportScore * 0.5 +
        (stabilization?.nationalStabilizationScore ?? 50) * 0.22 +
        (adoption?.projectedAdoptionScore ?? 0) * 0.18 -
        (stabilization?.criticalBranchCount ?? 0) * 4
    )
  );
  const projectedContinuityScore = Math.min(
    100,
    Math.round(
      nationalContinuityScore +
        Math.max(0, (adoption?.projectedAdoptionScore ?? 0) - (adoption?.nationalAdoptionScore ?? 0)) * 0.35 +
        (report?.hints.filter(h => h.exportPriority === 'high').length ?? 0) * 2
    )
  );

  const links: ResearchExportContinuityLink[] = (report?.hints ?? [])
    .filter(h => h.exportPriority !== 'low')
    .slice(0, 5)
    .map(h => ({
      branchId: h.branchId,
      exportPriority: h.exportPriority,
      driver: h.emphasis === 'commercial' ? 'commercial_emphasis' : 'readiness_floor',
    }));

  const priorPeak = ctx.commercializationSnapshot?.peakMilestone ?? 0;
  const exportMomentum = Math.max(0, nationalExportScore - priorPeak * 0.45);

  return {
    active:
      inputs.turn >= 12 ||
      nationalContinuityScore > 0 ||
      (report?.active ?? false) ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalContinuityScore,
    projectedContinuityScore,
    highPriorityExportCount: report?.hints.filter(h => h.exportPriority === 'high').length ?? 0,
    exportMomentum: Math.round(exportMomentum),
    links,
  };
}
