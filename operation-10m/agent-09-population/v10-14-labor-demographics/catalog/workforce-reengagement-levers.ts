import type { StrategicIndustryKind } from '../types';

export type WorkforceReengagementLeverKind =
  | 'returnship_band'
  | 'absence_reentry'
  | 'part_time_ramp'
  | 'sector_switch_coach'
  | 'community_hire_lane';

export interface WorkforceReengagementLever {
  id: string;
  kind: WorkforceReengagementLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  reengagementStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_REENGAGEMENT_LEVERS: WorkforceReengagementLever[] = [
  {
    id: 'reeng_manufacturing_vic',
    kind: 'returnship_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    reengagementStrength: 0.71,
    label: 'Manufacturing returnship band',
    narrative: 'Returnship indices widen participation after absence without micro hiring sim.'
  },
  {
    id: 'reeng_health_nsw',
    kind: 'part_time_ramp',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    reengagementStrength: 0.68,
    label: 'Capital health part-time ramp',
    narrative: 'Part-time ramps ease equity gaps in capital research corridors.'
  },
  {
    id: 'reeng_agri_tas',
    kind: 'community_hire_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    reengagementStrength: 0.6,
    label: 'Regional agri community hire',
    narrative: 'Community hire lanes absorb seasonal slack in regional agri hubs.'
  },
  {
    id: 'reeng_tourism_qld',
    kind: 'absence_reentry',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    reengagementStrength: 0.64,
    label: 'Coastal tourism reentry pack',
    narrative: 'Reentry packs stabilize service participation after cyclical absence.'
  },
  {
    id: 'reeng_tech_nsw_vic',
    kind: 'sector_switch_coach',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    reengagementStrength: 0.73,
    label: 'Tech sector-switch coaching',
    narrative: 'Switch coaching aligns credential mobility with upskilling pathways.'
  },
  {
    id: 'reeng_mining_wa',
    kind: 'returnship_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    reengagementStrength: 0.67,
    label: 'Frontier mining returnship',
    narrative: 'Returnship bands offset participation drag in frontier resource regions.'
  },
  {
    id: 'reeng_energy_nt',
    kind: 'part_time_ramp',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    reengagementStrength: 0.62,
    label: 'Energy corridor part-time ramp',
    narrative: 'Ramp packs ease rebalancing stress along energy frontier corridors.'
  },
  {
    id: 'reeng_trade_sa',
    kind: 'community_hire_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    reengagementStrength: 0.59,
    label: 'Trade logistics community lane',
    narrative: 'Community lanes smooth household-participation coupling in logistics hubs.'
  }
];

export function lookupWorkforceReengagementLever(id: string): WorkforceReengagementLever | undefined {
  return WORKFORCE_REENGAGEMENT_LEVERS.find(l => l.id === id);
}

export function reengagementLeversForIndustry(industry: StrategicIndustryKind): WorkforceReengagementLever[] {
  return WORKFORCE_REENGAGEMENT_LEVERS.filter(l => l.targetIndustry === industry);
}

export function reengagementPullForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_REENGAGEMENT_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.reengagementStrength, 0) / matches.length;
}
