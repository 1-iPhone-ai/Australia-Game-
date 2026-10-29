import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchStrategicDeliveryLink,
  ResearchStrategicDeliveryOutlook,
} from './types.ts';

/** Deterministic strategic delivery horizon (read-only, round 15). */
export function computeResearchStrategicDeliveryOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'researchExecutionOutlook'
    | 'exportContinuityOutlook'
    | 'adoptionHorizonOutlook'
    | 'researchExecutionSnapshot'
  >
): ResearchStrategicDeliveryOutlook {
  const execution = ctx.researchExecutionOutlook;
  const exportOutlook = ctx.exportContinuityOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = execution?.horizonTurns ?? exportOutlook?.horizonTurns ?? adoption?.horizonTurns ?? 6;

  const nationalDeliveryScore = Math.min(
    100,
    Math.round(
      (execution?.nationalExecutionScore ?? 0) * 0.4 +
        (exportOutlook?.nationalContinuityScore ?? 0) * 0.28 +
        (adoption?.nationalAdoptionScore ?? 0) * 0.22
    )
  );
  const projectedDeliveryScore = Math.min(
    100,
    Math.round(
      nationalDeliveryScore +
        Math.max(0, (execution?.projectedExecutionScore ?? 0) - (execution?.nationalExecutionScore ?? 0)) * 0.3 +
        Math.max(0, (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)) *
          0.12
    )
  );

  const links: ResearchStrategicDeliveryLink[] = (execution?.links ?? [])
    .slice(0, 4)
    .map(l => ({
      regionId: l.regionId,
      deliveryPosture: l.executionPriority === 'accelerate' ? 'expedite' : l.executionPriority === 'steady' ? 'sustain' : 'monitor',
      executionDelta: l.convergenceDelta,
    }));

  const priorPeak = ctx.researchExecutionSnapshot?.peakBand ?? 0;
  const executionMomentum = Math.max(0, (execution?.nationalExecutionScore ?? 0) - priorPeak * 0.4);

  return {
    active:
      inputs.turn >= 14 ||
      (execution?.active ?? false) ||
      (exportOutlook?.active ?? false) ||
      nationalDeliveryScore > 0 ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalDeliveryScore,
    projectedDeliveryScore,
    exportContinuityHeadroom: Math.max(
      0,
      (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)
    ),
    executionMomentum: Math.round(executionMomentum),
    links,
  };
}
