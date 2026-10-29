import {
  AGENT14_CORE_REGIONS,
  AGENT14_HOUSING_REGION_BASELINE,
  type Agent14CoreRegion,
} from './constants.ts';
import type {
  AffordabilityStressBand,
  DelayedSpendingTurnEffects,
  HousingPipelineStage,
  PublicServiceCapacitySnapshot,
  RegionalHousingPipelineState,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function stressBand(index: number): AffordabilityStressBand {
  if (index >= 62) return 'low';
  if (index >= 48) return 'moderate';
  if (index >= 34) return 'elevated';
  return 'severe';
}

function stageFromBacklog(months: number, pipeline: number): HousingPipelineStage {
  if (months >= 16 || pipeline >= 5000) return 'planning';
  if (months >= 12) return 'approvals';
  if (months >= 8) return 'construction';
  if (months >= 5) return 'handover';
  return 'stabilized';
}

export function computeRegionalHousingPipeline(
  regionId: string,
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): RegionalHousingPipelineState {
  const base =
    AGENT14_HOUSING_REGION_BASELINE[regionId as Agent14CoreRegion] ??
    AGENT14_HOUSING_REGION_BASELINE.NSW;
  const regionalBoost = spending.regionalKpiDelta[regionId]?.housing ?? 0;
  const remoteShare = base.remoteShare;

  let planningBacklogMonths = base.planningBacklogMonths;
  planningBacklogMonths += remoteShare * 14;
  planningBacklogMonths -= regionalBoost * 0.35;
  planningBacklogMonths -= (fiscalHeadroom - 50) * 0.04;
  if (capacity.bindingConstraint === 'fiscal_absorption') planningBacklogMonths += 3;
  if (capacity.byPillar.housing.loadRatio > 1.1) planningBacklogMonths += 2;
  planningBacklogMonths = clamp(planningBacklogMonths, 4, 28);

  let dwellingsInPipeline = base.baselinePipelineDwellings;
  dwellingsInPipeline += Math.floor(regionalBoost * 120);
  dwellingsInPipeline -= Math.floor((planningBacklogMonths - 10) * 40);
  dwellingsInPipeline = Math.max(80, dwellingsInPipeline);

  const socialHousingCompletionsRate = clamp(
    12 + regionalBoost * 4 + (capacity.byPillar.housing.capacityIndex - 50) * 0.12 - remoteShare * 18,
    2,
    45
  );

  let affordabilityIndex = base.affordabilityBaseline;
  affordabilityIndex += (fiscalHeadroom - 50) * 0.15;
  affordabilityIndex += regionalBoost * 1.2;
  affordabilityIndex -= remoteShare * 22;
  affordabilityIndex -= Math.max(0, planningBacklogMonths - 12) * 1.1;
  affordabilityIndex = clamp(affordabilityIndex);

  const deliveryPressure = clamp(
    planningBacklogMonths * 2.8 + remoteShare * 35 - socialHousingCompletionsRate * 0.9
  );

  return {
    regionId,
    stage: stageFromBacklog(planningBacklogMonths, dwellingsInPipeline),
    planningBacklogMonths,
    dwellingsInPipeline,
    socialHousingCompletionsRate,
    affordabilityStress: stressBand(affordabilityIndex),
    affordabilityIndex,
    remoteShare,
    deliveryPressure,
    evidence: [
      `t${turn}`,
      `backlog=${planningBacklogMonths}m`,
      `pipeline=${dwellingsInPipeline}`,
      `boost=${regionalBoost.toFixed(2)}`,
    ],
  };
}

export function computeAllRegionalHousingPipelines(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): Record<string, RegionalHousingPipelineState> {
  const out: Record<string, RegionalHousingPipelineState> = {};
  for (const r of AGENT14_CORE_REGIONS) {
    out[r] = computeRegionalHousingPipeline(r, turn, capacity, spending, fiscalHeadroom);
  }
  return out;
}
