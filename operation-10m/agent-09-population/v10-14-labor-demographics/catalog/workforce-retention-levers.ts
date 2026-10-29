import type { StrategicIndustryKind } from '../types';

export type WorkforceRetentionLeverKind =
  | 'housing_anchor'
  | 'career_ladder'
  | 'regional_incentive'
  | 'automation_transition'
  | 'essential_services';

export interface WorkforceRetentionLever {
  id: string;
  kind: WorkforceRetentionLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  retentionStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_RETENTION_LEVERS: WorkforceRetentionLever[] = [
  {
    id: 'retain_mining_wa',
    kind: 'housing_anchor',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    retentionStrength: 0.74,
    label: 'Resource housing anchor',
    narrative: 'Camp-to-community transitions reduce fly-in churn when affordability indices improve.'
  },
  {
    id: 'retain_tech_nsw',
    kind: 'career_ladder',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    retentionStrength: 0.81,
    label: 'Metro career ladder depth',
    narrative: 'Skilled retention tracks output concentration without literal tenure counts.'
  },
  {
    id: 'retain_health_act',
    kind: 'essential_services',
    targetIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    retentionStrength: 0.68,
    label: 'Policy-research retention loop',
    narrative: 'Research adjacency stabilizes specialized labor bands in capital corridors.'
  },
  {
    id: 'retain_agri_sa',
    kind: 'regional_incentive',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS', 'VIC'],
    retentionStrength: 0.58,
    label: 'Regional agri stay incentives',
    narrative: 'Seasonal depth scores benefit from bounded regional incentive indices.'
  },
  {
    id: 'retain_energy_nt',
    kind: 'automation_transition',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD', 'WA'],
    retentionStrength: 0.71,
    label: 'Frontier energy transition pack',
    narrative: 'Automation transition packs reduce strain-driven outflow in energy frontiers.'
  },
  {
    id: 'retain_manufacturing_vic',
    kind: 'career_ladder',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    retentionStrength: 0.63,
    label: 'Manufacturing skills depth',
    narrative: 'Output-linked retention offsets wage pressure in industrial corridors.'
  },
  {
    id: 'retain_tourism_qld',
    kind: 'regional_incentive',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS', 'NSW'],
    retentionStrength: 0.55,
    label: 'Tourism seasonal retention',
    narrative: 'Service-sector retention moderates migration volatility in coastal hubs.'
  },
  {
    id: 'retain_trade_sa',
    kind: 'essential_services',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    retentionStrength: 0.77,
    label: 'Trade logistics anchor',
    narrative: 'Long-cycle trade output supports stable employment linkage bands.'
  }
];

export function lookupWorkforceRetentionLever(id: string): WorkforceRetentionLever | undefined {
  return WORKFORCE_RETENTION_LEVERS.find(l => l.id === id);
}

export function retentionLeversForIndustry(industry: StrategicIndustryKind): WorkforceRetentionLever[] {
  return WORKFORCE_RETENTION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function retentionPullForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_RETENTION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.retentionStrength, 0) / matches.length;
}
