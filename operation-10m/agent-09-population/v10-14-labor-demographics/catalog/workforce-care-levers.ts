import type { StrategicIndustryKind } from '../types';

export type WorkforceCareLeverKind =
  | 'childcare_subsidy'
  | 'after_school_care'
  | 'elder_care_respite'
  | 'shift_flex_pack'
  | 'commute_relief';

export interface WorkforceCareLever {
  id: string;
  kind: WorkforceCareLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  careReliefStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_CARE_LEVERS: WorkforceCareLever[] = [
  {
    id: 'care_health_nsw',
    kind: 'shift_flex_pack',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    careReliefStrength: 0.74,
    label: 'Capital health shift-flex pack',
    narrative: 'Shift-flex packs ease caregiver participation drag in capital research bands.'
  },
  {
    id: 'care_manufacturing_vic',
    kind: 'after_school_care',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    careReliefStrength: 0.68,
    label: 'Manufacturing after-school relief',
    narrative: 'After-school relief indices lift manufacturing participation without micro childcare sim.'
  },
  {
    id: 'care_agri_tas',
    kind: 'commute_relief',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    careReliefStrength: 0.59,
    label: 'Regional agri commute relief',
    narrative: 'Commute relief eases seasonal caregiver friction in regional agri corridors.'
  },
  {
    id: 'care_tourism_qld',
    kind: 'childcare_subsidy',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    careReliefStrength: 0.63,
    label: 'Coastal tourism childcare subsidy',
    narrative: 'Subsidy indices stabilize service-sector participation in coastal hubs.'
  },
  {
    id: 'care_tech_nsw_vic',
    kind: 'elder_care_respite',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    careReliefStrength: 0.71,
    label: 'Tech elder-care respite band',
    narrative: 'Respite bands reduce hybrid-participation friction for dual-care households.'
  },
  {
    id: 'care_mining_wa',
    kind: 'shift_flex_pack',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    careReliefStrength: 0.66,
    label: 'Frontier mining roster flex',
    narrative: 'Roster flex packs offset caregiver drag in frontier resource regions.'
  },
  {
    id: 'care_energy_nt',
    kind: 'after_school_care',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    careReliefStrength: 0.62,
    label: 'Energy transition care pack',
    narrative: 'Care packs align transition participation with automation shift bands.'
  },
  {
    id: 'care_trade_sa',
    kind: 'commute_relief',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    careReliefStrength: 0.57,
    label: 'Trade logistics commute relief',
    narrative: 'Logistics commute relief stabilizes participation under wage pressure.'
  }
];

export function lookupWorkforceCareLever(id: string): WorkforceCareLever | undefined {
  return WORKFORCE_CARE_LEVERS.find(l => l.id === id);
}

export function careLeversForIndustry(industry: StrategicIndustryKind): WorkforceCareLever[] {
  return WORKFORCE_CARE_LEVERS.filter(l => l.targetIndustry === industry);
}

export function careReliefForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_CARE_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.careReliefStrength, 0) / matches.length;
}
