import type { StrategicIndustryKind } from '../types';

export type WorkforceOnboardingLeverKind =
  | 'buddy_lane'
  | 'credential_fast_track'
  | 'site_induction_pack'
  | 'language_ramp'
  | 'safety_orientation_band';

export interface WorkforceOnboardingLever {
  id: string;
  kind: WorkforceOnboardingLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  onboardingStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_ONBOARDING_LEVERS: WorkforceOnboardingLever[] = [
  {
    id: 'onboard_manufacturing_vic',
    kind: 'site_induction_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    onboardingStrength: 0.7,
    label: 'Manufacturing site induction pack',
    narrative: 'Induction packs shorten time-to-productivity without literal training counts.'
  },
  {
    id: 'onboard_health_nsw',
    kind: 'credential_fast_track',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    onboardingStrength: 0.73,
    label: 'Capital health credential fast-track',
    narrative: 'Fast-track bands align onboarding with credential mobility pathways.'
  },
  {
    id: 'onboard_agri_tas',
    kind: 'buddy_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    onboardingStrength: 0.62,
    label: 'Regional agri buddy lane',
    narrative: 'Buddy lanes ease seasonal onboarding in regional agri corridors.'
  },
  {
    id: 'onboard_tourism_qld',
    kind: 'language_ramp',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    onboardingStrength: 0.65,
    label: 'Coastal tourism language ramp',
    narrative: 'Language ramps stabilize service-sector onboarding in coastal hubs.'
  },
  {
    id: 'onboard_tech_nsw_vic',
    kind: 'credential_fast_track',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    onboardingStrength: 0.76,
    label: 'Tech onboarding fast-track',
    narrative: 'Fast-track onboarding supports portable credential mobility bands.'
  },
  {
    id: 'onboard_mining_wa',
    kind: 'safety_orientation_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    onboardingStrength: 0.68,
    label: 'Frontier mining safety orientation',
    narrative: 'Safety orientation bands offset automation participation drag in resource regions.'
  },
  {
    id: 'onboard_energy_nt',
    kind: 'site_induction_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    onboardingStrength: 0.64,
    label: 'Energy corridor induction pack',
    narrative: 'Induction packs align onboarding with corridor absorption headroom.'
  },
  {
    id: 'onboard_trade_sa',
    kind: 'buddy_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    onboardingStrength: 0.6,
    label: 'Trade logistics buddy lane',
    narrative: 'Buddy lanes smooth migration-shock participation buffers in logistics hubs.'
  }
];

export function lookupWorkforceOnboardingLever(id: string): WorkforceOnboardingLever | undefined {
  return WORKFORCE_ONBOARDING_LEVERS.find(l => l.id === id);
}

export function onboardingLeversForIndustry(industry: StrategicIndustryKind): WorkforceOnboardingLever[] {
  return WORKFORCE_ONBOARDING_LEVERS.filter(l => l.targetIndustry === industry);
}

export function onboardingEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_ONBOARDING_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.onboardingStrength, 0) / matches.length;
}
