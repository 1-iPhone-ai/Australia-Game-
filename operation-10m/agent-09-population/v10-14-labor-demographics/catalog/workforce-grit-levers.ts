import type { StrategicIndustryKind } from '../types';

export type WorkforceGritLeverKind =
  | 'grit_coaching_lane'
  | 'shift_grit_pack'
  | 'resolve_forum_band'
  | 'continuity_grit_cell'
  | 'peer_grit_circle';

export interface WorkforceGritLever {
  id: string;
  kind: WorkforceGritLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  gritStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_GRIT_LEVERS: WorkforceGritLever[] = [
  {
    id: 'grit_manufacturing_vic',
    kind: 'shift_grit_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    gritStrength: 0.7,
    label: 'Manufacturing grit pack',
    narrative: 'Grit packs stabilize resolve without literal attrition counts.'
  },
  {
    id: 'grit_health_nsw',
    kind: 'grit_coaching_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    gritStrength: 0.73,
    label: 'Capital grit coaching lane',
    narrative: 'Coaching lanes reinforce perseverance-grit coupling outlooks.'
  },
  {
    id: 'grit_agri_tas',
    kind: 'continuity_grit_cell',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'VIC'],
    gritStrength: 0.68,
    label: 'Tasmanian continuity grit cell',
    narrative: 'Grit cells ease seasonal perseverance drag on grit indices.'
  },
  {
    id: 'grit_tech_nsw_vic',
    kind: 'peer_grit_circle',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    gritStrength: 0.76,
    label: 'Tech grit circle',
    narrative: 'Circles pair with subject grit readiness checks.'
  },
  {
    id: 'grit_mining_wa',
    kind: 'resolve_forum_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    gritStrength: 0.71,
    label: 'Frontier grit forum',
    narrative: 'Forums bound grit resilience outlook spikes.'
  }
];

export function lookupWorkforceGritLever(id: string): WorkforceGritLever | undefined {
  return WORKFORCE_GRIT_LEVERS.find(lever => lever.id === id);
}

export function gritEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0.08;
  let best = 0;
  for (const lever of WORKFORCE_GRIT_LEVERS) {
    if (!lever.hostRegions.includes(regionId)) continue;
    if (lever.targetIndustry !== dominantIndustry) continue;
    best = Math.max(best, lever.gritStrength);
  }
  return best > 0 ? best : 0.06;
}
