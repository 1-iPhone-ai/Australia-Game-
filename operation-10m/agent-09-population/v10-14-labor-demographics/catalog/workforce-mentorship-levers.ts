import type { StrategicIndustryKind } from '../types';

export type WorkforceMentorshipLeverKind =
  | 'peer_mentor_lane'
  | 'apprentice_sponsor'
  | 'executive_shadow_band'
  | 'cross_sector_rotation'
  | 'frontier_coach_pack';

export interface WorkforceMentorshipLever {
  id: string;
  kind: WorkforceMentorshipLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  mentorshipStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_MENTORSHIP_LEVERS: WorkforceMentorshipLever[] = [
  {
    id: 'mentor_manufacturing_vic',
    kind: 'apprentice_sponsor',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    mentorshipStrength: 0.7,
    label: 'Manufacturing apprentice sponsor',
    narrative: 'Sponsor lanes lift youth pipeline without literal mentor counts.'
  },
  {
    id: 'mentor_health_nsw',
    kind: 'executive_shadow_band',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    mentorshipStrength: 0.73,
    label: 'Capital health shadow band',
    narrative: 'Shadow bands reinforce credential mobility in capital corridors.'
  },
  {
    id: 'mentor_agri_tas',
    kind: 'peer_mentor_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    mentorshipStrength: 0.62,
    label: 'Regional agri peer mentor',
    narrative: 'Peer mentors ease seasonal participation-velocity coupling.'
  },
  {
    id: 'mentor_tourism_qld',
    kind: 'cross_sector_rotation',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    mentorshipStrength: 0.65,
    label: 'Coastal tourism rotation band',
    narrative: 'Rotation bands stabilize hybrid-remote participation outlooks.'
  },
  {
    id: 'mentor_tech_nsw_vic',
    kind: 'frontier_coach_pack',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    mentorshipStrength: 0.76,
    label: 'Tech frontier coach pack',
    narrative: 'Coach packs align skills coherence with onboarding levers.'
  },
  {
    id: 'mentor_mining_wa',
    kind: 'apprentice_sponsor',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    mentorshipStrength: 0.69,
    label: 'Frontier mining sponsor lane',
    narrative: 'Sponsor lanes offset corridor capacity stress in resource regions.'
  },
  {
    id: 'mentor_energy_nt',
    kind: 'peer_mentor_lane',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    mentorshipStrength: 0.64,
    label: 'Energy peer mentor corridor',
    narrative: 'Peer mentors reinforce steward intervention priorities.'
  },
  {
    id: 'mentor_trade_sa',
    kind: 'cross_sector_rotation',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    mentorshipStrength: 0.61,
    label: 'Trade logistics rotation pack',
    narrative: 'Rotation packs smooth integrated readiness in logistics hubs.'
  }
];

export function lookupWorkforceMentorshipLever(id: string): WorkforceMentorshipLever | undefined {
  return WORKFORCE_MENTORSHIP_LEVERS.find(l => l.id === id);
}

export function mentorshipLeversForIndustry(industry: StrategicIndustryKind): WorkforceMentorshipLever[] {
  return WORKFORCE_MENTORSHIP_LEVERS.filter(l => l.targetIndustry === industry);
}

export function mentorshipEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_MENTORSHIP_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.mentorshipStrength, 0) / matches.length;
}
