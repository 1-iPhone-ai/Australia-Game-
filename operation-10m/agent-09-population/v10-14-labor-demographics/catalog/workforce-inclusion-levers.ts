import type { StrategicIndustryKind } from '../types';

export type WorkforceInclusionLeverKind =
  | 'apprenticeship_bridge'
  | 'caregiver_flex'
  | 'regional_access'
  | 'language_pathway'
  | 'disability_accommodation';

export interface WorkforceInclusionLever {
  id: string;
  kind: WorkforceInclusionLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  inclusionStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_INCLUSION_LEVERS: WorkforceInclusionLever[] = [
  {
    id: 'incl_manufacturing_vic',
    kind: 'apprenticeship_bridge',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    inclusionStrength: 0.72,
    label: 'Manufacturing apprenticeship bridge',
    narrative: 'Apprenticeship bridges widen participation without literal credential counts.'
  },
  {
    id: 'incl_health_nsw',
    kind: 'caregiver_flex',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    inclusionStrength: 0.69,
    label: 'Caregiver-flex research bands',
    narrative: 'Flexible participation indices support capital-region research depth.'
  },
  {
    id: 'incl_agri_tas',
    kind: 'regional_access',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    inclusionStrength: 0.61,
    label: 'Regional agri access pack',
    narrative: 'Regional access levers ease underemployment slack in seasonal corridors.'
  },
  {
    id: 'incl_tourism_qld',
    kind: 'language_pathway',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    inclusionStrength: 0.58,
    label: 'Tourism language pathway',
    narrative: 'Language pathways lift service-sector participation in coastal hubs.'
  },
  {
    id: 'incl_tech_nsw_vic',
    kind: 'disability_accommodation',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    inclusionStrength: 0.76,
    label: 'Tech accommodation depth',
    narrative: 'Accommodation indices broaden tech participation without HR micro-simulation.'
  },
  {
    id: 'incl_mining_wa',
    kind: 'regional_access',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    inclusionStrength: 0.64,
    label: 'Frontier mining access',
    narrative: 'Frontier access packs reduce hidden underuse in resource regions.'
  },
  {
    id: 'incl_energy_nt',
    kind: 'apprenticeship_bridge',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    inclusionStrength: 0.67,
    label: 'Energy transition bridge',
    narrative: 'Transition bridges align automation shifts with inclusive participation.'
  },
  {
    id: 'incl_trade_sa',
    kind: 'caregiver_flex',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    inclusionStrength: 0.55,
    label: 'Trade logistics flex bands',
    narrative: 'Flex bands stabilize logistics participation under wage pressure.'
  }
];

export function lookupWorkforceInclusionLever(id: string): WorkforceInclusionLever | undefined {
  return WORKFORCE_INCLUSION_LEVERS.find(l => l.id === id);
}

export function inclusionLeversForIndustry(industry: StrategicIndustryKind): WorkforceInclusionLever[] {
  return WORKFORCE_INCLUSION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function inclusionEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_INCLUSION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.inclusionStrength, 0) / matches.length;
}
