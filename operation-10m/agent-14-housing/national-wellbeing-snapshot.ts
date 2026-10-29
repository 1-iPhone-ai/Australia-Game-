import { AGENT14_CORE_REGIONS } from './constants.ts';
import type {
  AffordabilityStressBand,
  NationalHousingWellbeingSnapshot,
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

export function computeNationalHousingWellbeingSnapshot(
  turn: number,
  regions: Record<string, RegionalHousingPipelineState>
): NationalHousingWellbeingSnapshot {
  const list = AGENT14_CORE_REGIONS.map((id) => regions[id]).filter(Boolean);
  const affIndices = list.map((r) => r.affordabilityIndex);
  const minAff = Math.min(...affIndices);
  const maxAff = Math.max(...affIndices);
  const nationalAffordabilityIndex =
    affIndices.length > 0 ? clamp(affIndices.reduce((a, b) => a + b, 0) / affIndices.length) : 50;

  const averagePlanningBacklogMonths =
    list.length > 0
      ? clamp(list.reduce((s, r) => s + r.planningBacklogMonths, 0) / list.length)
      : 12;

  const totalDwellingsInPipeline = list.reduce((s, r) => s + r.dwellingsInPipeline, 0);

  const socialCompletionsIndex = clamp(
    list.length > 0
      ? list.reduce((s, r) => s + r.socialHousingCompletionsRate, 0) / list.length
      : 10
  );

  const regionalEquityGap = clamp(maxAff - minAff);

  const worst = list.reduce(
    (w, r) => (r.affordabilityIndex < w.affordabilityIndex ? r : w),
    list[0]!
  );
  const best = list.reduce(
    (b, r) => (r.affordabilityIndex > b.affordabilityIndex ? r : b),
    list[0]!
  );

  const narrativeSummary =
    list.length === 0
      ? 'No regional housing pipeline data.'
      : `National affordability ${nationalAffordabilityIndex} (${stressBand(nationalAffordabilityIndex)}). ` +
        `Backlog avg ${averagePlanningBacklogMonths}m; pipeline ${totalDwellingsInPipeline} dwellings. ` +
        `Equity gap ${regionalEquityGap} (${worst.regionId} ${worst.affordabilityIndex} → ${best.regionId} ${best.affordabilityIndex}).`;

  return {
    turn,
    nationalAffordabilityIndex,
    affordabilityStress: stressBand(nationalAffordabilityIndex),
    averagePlanningBacklogMonths,
    totalDwellingsInPipeline,
    socialCompletionsIndex,
    regionalEquityGap,
    regions,
    narrativeSummary,
  };
}
