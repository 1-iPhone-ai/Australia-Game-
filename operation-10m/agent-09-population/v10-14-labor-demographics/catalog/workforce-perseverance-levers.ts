import type { StrategicIndustryKind } from '../types';

export type WorkforcePerseveranceLeverKind =
  | 'grit_coaching_lane'
  | 'shift_perseverance_pack'
  | 'resolve_forum_band'
  | 'continuity_grit_cell'
  | 'peer_perseverance_circle';

export interface WorkforcePerseveranceLever {
  id: string;
  kind: WorkforcePerseveranceLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  perseveranceStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_PERSEVERANCE_LEVERS: WorkforcePerseveranceLever[] = [
  {
    id: 'perseverance_manufacturing_vic',
    kind: 'shift_perseverance_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    perseveranceStrength: 0.71,
    label: 'Manufacturing perseverance pack',
    narrative: 'Perseverance packs stabilize grit without literal attrition counts.'
  },
  {
    id: 'perseverance_health_nsw',
    kind: 'grit_coaching_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    perseveranceStrength: 0.74,
    label: 'Capital grit coaching lane',
    narrative: 'Coaching lanes reinforce tenacity-perseverance coupling outlooks.'
  },
  {
    id: 'perseverance_agri_tas',
    kind: 'continuity_grit_cell',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'VIC'],
    perseveranceStrength: 0.69,
    label: 'Tasmanian continuity grit cell',
    narrative: 'Grit cells ease seasonal tenacity drag on perseverance indices.'
  },
  {
    id: 'perseverance_tech_nsw_vic',
    kind: 'peer_perseverance_circle',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    perseveranceStrength: 0.77,
    label: 'Tech perseverance circle',
    narrative: 'Circles pair with subject perseverance readiness checks.'
  },
  {
    id: 'perseverance_mining_wa',
    kind: 'resolve_forum_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    perseveranceStrength: 0.72,
    label: 'Frontier resolve forum',
    narrative: 'Forums bound perseverance resilience outlook spikes.'
  }
];

export function lookupWorkforcePerseveranceLever(id: string): WorkforcePerseveranceLever | undefined {
  return WORKFORCE_PERSEVERANCE_LEVERS.find(lever => lever.id === id);
}

export function perseveranceEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0.08;
  let best = 0;
  for (const lever of WORKFORCE_PERSEVERANCE_LEVERS) {
    if (!lever.hostRegions.includes(regionId)) continue;
    if (lever.targetIndustry !== dominantIndustry) continue;
    best = Math.max(best, lever.perseveranceStrength);
  }
  return best > 0 ? best : 0.06;
}
