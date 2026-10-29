import type { StrategicIndustryKind } from '../types';

export type WorkforceAdvocacyLeverKind =
  | 'worker_voice_forum'
  | 'grievance_fast_lane'
  | 'sector_advocacy_pack'
  | 'regional_labor_council'
  | 'equity_watch_band';

export interface WorkforceAdvocacyLever {
  id: string;
  kind: WorkforceAdvocacyLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  advocacyStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_ADVOCACY_LEVERS: WorkforceAdvocacyLever[] = [
  {
    id: 'adv_manufacturing_vic',
    kind: 'sector_advocacy_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    advocacyStrength: 0.69,
    label: 'Manufacturing sector advocacy pack',
    narrative: 'Advocacy packs reinforce participation equity without literal union sim.'
  },
  {
    id: 'adv_health_nsw',
    kind: 'worker_voice_forum',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    advocacyStrength: 0.72,
    label: 'Capital health worker voice forum',
    narrative: 'Voice forums align household coupling with coordination levers.'
  },
  {
    id: 'adv_agri_tas',
    kind: 'regional_labor_council',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    advocacyStrength: 0.61,
    label: 'Regional agri labor council',
    narrative: 'Labor councils smooth participation-velocity coupling in seasonal corridors.'
  },
  {
    id: 'adv_tourism_qld',
    kind: 'grievance_fast_lane',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    advocacyStrength: 0.64,
    label: 'Coastal tourism grievance lane',
    narrative: 'Fast lanes stabilize migration-equity buffers in coastal hubs.'
  },
  {
    id: 'adv_tech_nsw_vic',
    kind: 'equity_watch_band',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    advocacyStrength: 0.75,
    label: 'Tech equity watch band',
    narrative: 'Equity watch bands support skills-tightness coherence in tech corridors.'
  },
  {
    id: 'adv_mining_wa',
    kind: 'worker_voice_forum',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    advocacyStrength: 0.68,
    label: 'Frontier mining worker voice',
    narrative: 'Worker voice eases rebalancing stress before wage spillover surges.'
  },
  {
    id: 'adv_energy_nt',
    kind: 'sector_advocacy_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    advocacyStrength: 0.63,
    label: 'Energy sector advocacy pack',
    narrative: 'Advocacy packs reinforce integrated labor readiness in energy corridors.'
  },
  {
    id: 'adv_trade_sa',
    kind: 'regional_labor_council',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    advocacyStrength: 0.6,
    label: 'Trade logistics labor council',
    narrative: 'Councils align capacity-participation alignment across logistics hubs.'
  }
];

export function lookupWorkforceAdvocacyLever(id: string): WorkforceAdvocacyLever | undefined {
  return WORKFORCE_ADVOCACY_LEVERS.find(l => l.id === id);
}

export function advocacyLeversForIndustry(industry: StrategicIndustryKind): WorkforceAdvocacyLever[] {
  return WORKFORCE_ADVOCACY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function advocacyEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_ADVOCACY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.advocacyStrength, 0) / matches.length;
}
