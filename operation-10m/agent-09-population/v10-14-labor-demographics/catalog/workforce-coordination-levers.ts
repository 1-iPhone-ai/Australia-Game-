import type { StrategicIndustryKind } from '../types';

export type WorkforceCoordinationLeverKind =
  | 'sector_roundtable'
  | 'corridor_taskforce'
  | 'skills_council'
  | 'regional_compact'
  | 'automation_pact';

export interface WorkforceCoordinationLever {
  id: string;
  kind: WorkforceCoordinationLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  coordinationStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_COORDINATION_LEVERS: WorkforceCoordinationLever[] = [
  {
    id: 'coord_manufacturing_vic',
    kind: 'sector_roundtable',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    coordinationStrength: 0.71,
    label: 'Manufacturing sector roundtable',
    narrative: 'Roundtables align upskilling with participation equity without micro policy sim.'
  },
  {
    id: 'coord_health_nsw',
    kind: 'skills_council',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    coordinationStrength: 0.74,
    label: 'Capital health skills council',
    narrative: 'Skills councils stabilize credential mobility across capital corridors.'
  },
  {
    id: 'coord_agri_tas',
    kind: 'regional_compact',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    coordinationStrength: 0.63,
    label: 'Regional agri workforce compact',
    narrative: 'Compacts smooth seasonal participation buffers in regional agri hubs.'
  },
  {
    id: 'coord_tourism_qld',
    kind: 'corridor_taskforce',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    coordinationStrength: 0.66,
    label: 'Coastal tourism corridor taskforce',
    narrative: 'Taskforces coordinate absorption with migration-shock buffers.'
  },
  {
    id: 'coord_tech_nsw_vic',
    kind: 'automation_pact',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    coordinationStrength: 0.77,
    label: 'Tech automation coordination pact',
    narrative: 'Automation pacts align resilience outlooks with onboarding levers.'
  },
  {
    id: 'coord_mining_wa',
    kind: 'corridor_taskforce',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    coordinationStrength: 0.7,
    label: 'Frontier mining corridor taskforce',
    narrative: 'Taskforces sequence rebalancing stress before wage spillover surges.'
  },
  {
    id: 'coord_energy_nt',
    kind: 'sector_roundtable',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    coordinationStrength: 0.65,
    label: 'Energy sector roundtable',
    narrative: 'Roundtables align capacity-participation alignment in energy corridors.'
  },
  {
    id: 'coord_trade_sa',
    kind: 'regional_compact',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    coordinationStrength: 0.61,
    label: 'Trade logistics regional compact',
    narrative: 'Compacts reinforce labor-market stability across logistics hubs.'
  }
];

export function lookupWorkforceCoordinationLever(id: string): WorkforceCoordinationLever | undefined {
  return WORKFORCE_COORDINATION_LEVERS.find(l => l.id === id);
}

export function coordinationLeversForIndustry(industry: StrategicIndustryKind): WorkforceCoordinationLever[] {
  return WORKFORCE_COORDINATION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function coordinationEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_COORDINATION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.coordinationStrength, 0) / matches.length;
}
