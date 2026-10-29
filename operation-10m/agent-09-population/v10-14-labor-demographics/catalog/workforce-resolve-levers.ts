import type { StrategicIndustryKind } from '../types';

export type WorkforceResolveLeverKind =
  | 'resolve_coaching_lane'
  | 'shift_resolve_pack'
  | 'grit_forum_band'
  | 'continuity_resolve_cell'
  | 'peer_resolve_circle';

export interface WorkforceResolveLever {
  id: string;
  kind: WorkforceResolveLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  resolveStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_RESOLVE_LEVERS: WorkforceResolveLever[] = [
  {
    id: 'resolve_manufacturing_vic',
    kind: 'shift_resolve_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    resolveStrength: 0.71,
    label: 'Manufacturing resolve pack',
    narrative: 'Resolve packs stabilize grit depth without literal attrition counts.'
  },
  {
    id: 'resolve_health_nsw',
    kind: 'resolve_coaching_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    resolveStrength: 0.74,
    label: 'Capital resolve coaching lane',
    narrative: 'Coaching lanes reinforce grit-resolve coupling outlooks.'
  },
  {
    id: 'resolve_agri_tas',
    kind: 'continuity_resolve_cell',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'VIC'],
    resolveStrength: 0.69,
    label: 'Tasmanian continuity resolve cell',
    narrative: 'Resolve cells ease seasonal grit drag on resolve indices.'
  },
  {
    id: 'resolve_tech_nsw_vic',
    kind: 'peer_resolve_circle',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    resolveStrength: 0.77,
    label: 'Tech resolve circle',
    narrative: 'Circles pair with subject resolve readiness checks.'
  },
  {
    id: 'resolve_mining_wa',
    kind: 'grit_forum_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    resolveStrength: 0.72,
    label: 'Frontier resolve forum',
    narrative: 'Forums bound resolve resilience outlook spikes.'
  }
];

export function lookupWorkforceResolveLever(id: string): WorkforceResolveLever | undefined {
  return WORKFORCE_RESOLVE_LEVERS.find(lever => lever.id === id);
}

export function resolveEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0.08;
  let best = 0;
  for (const lever of WORKFORCE_RESOLVE_LEVERS) {
    if (!lever.hostRegions.includes(regionId)) continue;
    if (lever.targetIndustry !== dominantIndustry) continue;
    best = Math.max(best, lever.resolveStrength);
  }
  return best > 0 ? best : 0.06;
}
