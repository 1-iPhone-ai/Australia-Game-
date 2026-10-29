import type { StrategicIndustryKind } from '../types';

export type WorkforceSteadfastLeverKind =
  | 'steadfast_coaching_lane'
  | 'shift_steadfast_pack'
  | 'resolve_forum_band'
  | 'continuity_steadfast_cell'
  | 'peer_steadfast_circle';

export interface WorkforceSteadfastLever {
  id: string;
  kind: WorkforceSteadfastLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  steadfastStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_STEADFAST_LEVERS: WorkforceSteadfastLever[] = [
  {
    id: 'steadfast_manufacturing_vic',
    kind: 'shift_steadfast_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    steadfastStrength: 0.7,
    label: 'Manufacturing steadfast pack',
    narrative: 'Steadfast packs stabilize resolve depth without literal attrition counts.'
  },
  {
    id: 'steadfast_health_nsw',
    kind: 'steadfast_coaching_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    steadfastStrength: 0.73,
    label: 'Capital steadfast coaching lane',
    narrative: 'Coaching lanes reinforce resolve-steadfast coupling outlooks.'
  },
  {
    id: 'steadfast_agri_tas',
    kind: 'continuity_steadfast_cell',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'VIC'],
    steadfastStrength: 0.68,
    label: 'Tasmanian continuity steadfast cell',
    narrative: 'Steadfast cells ease seasonal resolve drag on steadfast indices.'
  },
  {
    id: 'steadfast_tech_nsw_vic',
    kind: 'peer_steadfast_circle',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    steadfastStrength: 0.76,
    label: 'Tech steadfast circle',
    narrative: 'Circles pair with subject steadfast readiness checks.'
  },
  {
    id: 'steadfast_mining_wa',
    kind: 'resolve_forum_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    steadfastStrength: 0.71,
    label: 'Frontier steadfast forum',
    narrative: 'Forums bound steadfast resilience outlook spikes.'
  }
];

export function lookupWorkforceSteadfastLever(id: string): WorkforceSteadfastLever | undefined {
  return WORKFORCE_STEADFAST_LEVERS.find(lever => lever.id === id);
}

export function steadfastEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0.08;
  let best = 0;
  for (const lever of WORKFORCE_STEADFAST_LEVERS) {
    if (!lever.hostRegions.includes(regionId)) continue;
    if (lever.targetIndustry !== dominantIndustry) continue;
    best = Math.max(best, lever.steadfastStrength);
  }
  return best > 0 ? best : 0.06;
}
