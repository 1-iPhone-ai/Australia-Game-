import type { StrategicIndustryKind } from '../types';

export type WorkforceTenacityLeverKind =
  | 'commitment_coaching_lane'
  | 'shift_stamina_pack'
  | 'resilience_forum_band'
  | 'continuity_anchor_cell'
  | 'peer_steadfast_circle';

export interface WorkforceTenacityLever {
  id: string;
  kind: WorkforceTenacityLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  tenacityStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_TENACITY_LEVERS: WorkforceTenacityLever[] = [
  {
    id: 'tenacity_manufacturing_vic',
    kind: 'shift_stamina_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    tenacityStrength: 0.72,
    label: 'Manufacturing stamina pack',
    narrative: 'Stamina packs stabilize commitment without literal attrition counts.'
  },
  {
    id: 'tenacity_health_nsw',
    kind: 'commitment_coaching_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    tenacityStrength: 0.75,
    label: 'Capital health coaching lane',
    narrative: 'Coaching lanes reinforce care-tenacity coupling outlooks.'
  },
  {
    id: 'tenacity_agri_tas',
    kind: 'continuity_anchor_cell',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'VIC'],
    tenacityStrength: 0.7,
    label: 'Tasmanian continuity anchor',
    narrative: 'Anchor cells ease seasonal care drag on tenacity indices.'
  },
  {
    id: 'tenacity_tech_nsw_vic',
    kind: 'peer_steadfast_circle',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    tenacityStrength: 0.78,
    label: 'Tech steadfast circle',
    narrative: 'Steadfast circles pair with subject tenacity readiness checks.'
  },
  {
    id: 'tenacity_mining_wa',
    kind: 'resilience_forum_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    tenacityStrength: 0.73,
    label: 'Frontier resilience forum',
    narrative: 'Forums bound tenacity resilience outlook spikes.'
  }
];

export function lookupWorkforceTenacityLever(id: string): WorkforceTenacityLever | undefined {
  return WORKFORCE_TENACITY_LEVERS.find(lever => lever.id === id);
}

export function tenacityEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0.08;
  let best = 0;
  for (const lever of WORKFORCE_TENACITY_LEVERS) {
    if (!lever.hostRegions.includes(regionId)) continue;
    if (lever.targetIndustry !== dominantIndustry) continue;
    best = Math.max(best, lever.tenacityStrength);
  }
  return best > 0 ? best : 0.06;
}
