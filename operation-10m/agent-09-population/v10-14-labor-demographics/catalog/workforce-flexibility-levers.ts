import type { StrategicIndustryKind } from '../types';

export type WorkforceFlexibilityLeverKind =
  | 'compressed_week'
  | 'job_share_band'
  | 'async_hours_pack'
  | 'seasonal_ramp'
  | 'roster_self_select';

export interface WorkforceFlexibilityLever {
  id: string;
  kind: WorkforceFlexibilityLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  flexibilityStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_FLEXIBILITY_LEVERS: WorkforceFlexibilityLever[] = [
  {
    id: 'flex_health_nsw',
    kind: 'async_hours_pack',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    flexibilityStrength: 0.72,
    label: 'Capital health async hours',
    narrative: 'Async hour bands ease caregiver and hybrid scheduling friction in research hubs.'
  },
  {
    id: 'flex_manufacturing_vic',
    kind: 'compressed_week',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    flexibilityStrength: 0.67,
    label: 'Manufacturing compressed week',
    narrative: 'Compressed-week indices lift participation without micro shift sim.'
  },
  {
    id: 'flex_agri_tas',
    kind: 'seasonal_ramp',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    flexibilityStrength: 0.61,
    label: 'Regional agri seasonal ramp',
    narrative: 'Seasonal ramp packs align peak labor with corridor absorption headroom.'
  },
  {
    id: 'flex_tourism_qld',
    kind: 'job_share_band',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    flexibilityStrength: 0.64,
    label: 'Coastal tourism job-share band',
    narrative: 'Job-share bands stabilize service participation in coastal hubs.'
  },
  {
    id: 'flex_tech_nsw_vic',
    kind: 'roster_self_select',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    flexibilityStrength: 0.75,
    label: 'Tech roster self-select',
    narrative: 'Self-select rosters reduce hybrid friction for dual-care households.'
  },
  {
    id: 'flex_mining_wa',
    kind: 'compressed_week',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    flexibilityStrength: 0.69,
    label: 'Frontier mining roster flex',
    narrative: 'Roster flex offsets participation drag in frontier resource regions.'
  },
  {
    id: 'flex_energy_nt',
    kind: 'async_hours_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    flexibilityStrength: 0.63,
    label: 'Energy async corridor pack',
    narrative: 'Async packs ease shift transitions in energy frontier corridors.'
  },
  {
    id: 'flex_trade_sa',
    kind: 'seasonal_ramp',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    flexibilityStrength: 0.58,
    label: 'Trade logistics seasonal ramp',
    narrative: 'Logistics ramps smooth absorption spikes without wage surge loops.'
  }
];

export function lookupWorkforceFlexibilityLever(id: string): WorkforceFlexibilityLever | undefined {
  return WORKFORCE_FLEXIBILITY_LEVERS.find(l => l.id === id);
}

export function flexibilityLeversForIndustry(industry: StrategicIndustryKind): WorkforceFlexibilityLever[] {
  return WORKFORCE_FLEXIBILITY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function flexibilityEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_FLEXIBILITY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.flexibilityStrength, 0) / matches.length;
}
