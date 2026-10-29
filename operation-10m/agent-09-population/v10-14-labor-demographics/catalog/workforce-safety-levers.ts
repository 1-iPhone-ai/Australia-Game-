import type { StrategicIndustryKind } from '../types';

export type WorkforceSafetyLeverKind =
  | 'site_safety_pack'
  | 'heat_stress_mitigation'
  | 'equipment_guard_band'
  | 'wellbeing_check_lane'
  | 'incident_prevention_forum';

export interface WorkforceSafetyLever {
  id: string;
  kind: WorkforceSafetyLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  safetyStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_SAFETY_LEVERS: WorkforceSafetyLever[] = [
  {
    id: 'safe_manufacturing_vic',
    kind: 'equipment_guard_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    safetyStrength: 0.71,
    label: 'Manufacturing guard band',
    narrative: 'Guard bands stabilize participation without literal incident counts.'
  },
  {
    id: 'safe_health_nsw',
    kind: 'wellbeing_check_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    safetyStrength: 0.74,
    label: 'Capital health wellbeing lane',
    narrative: 'Wellbeing lanes reinforce hybrid-remote participation outlooks.'
  },
  {
    id: 'safe_agri_tas',
    kind: 'heat_stress_mitigation',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    safetyStrength: 0.63,
    label: 'Regional agri heat mitigation',
    narrative: 'Heat mitigation eases seasonal essential-worker participation drag.'
  },
  {
    id: 'safe_tourism_qld',
    kind: 'site_safety_pack',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    safetyStrength: 0.66,
    label: 'Coastal tourism safety pack',
    narrative: 'Safety packs support migration-shock participation buffers.'
  },
  {
    id: 'safe_tech_nsw_vic',
    kind: 'incident_prevention_forum',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    safetyStrength: 0.75,
    label: 'Tech prevention forum',
    narrative: 'Forums align wage-automation coupling with mentorship levers.'
  },
  {
    id: 'safe_mining_wa',
    kind: 'site_safety_pack',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    safetyStrength: 0.72,
    label: 'Frontier mining safety pack',
    narrative: 'Safety packs offset corridor capacity stress in resource regions.'
  },
  {
    id: 'safe_energy_nt',
    kind: 'equipment_guard_band',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    safetyStrength: 0.67,
    label: 'Energy equipment guard band',
    narrative: 'Guard bands reinforce national labor cohesion indices.'
  },
  {
    id: 'safe_trade_sa',
    kind: 'wellbeing_check_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    safetyStrength: 0.62,
    label: 'Trade logistics wellbeing lane',
    narrative: 'Wellbeing lanes smooth steward intervention priorities.'
  }
];

export function lookupWorkforceSafetyLever(id: string): WorkforceSafetyLever | undefined {
  return WORKFORCE_SAFETY_LEVERS.find(l => l.id === id);
}

export function safetyLeversForIndustry(industry: StrategicIndustryKind): WorkforceSafetyLever[] {
  return WORKFORCE_SAFETY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function safetyEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_SAFETY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.safetyStrength, 0) / matches.length;
}
