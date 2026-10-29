import type { StrategicIndustryKind } from '../types';

export type WorkforceUpskillingProgramKind =
  | 'digital_transition'
  | 'trades_apprentice'
  | 'frontier_reskill'
  | 'metro_tech_stack'
  | 'regional_services';

export interface WorkforceUpskillingProgram {
  id: string;
  kind: WorkforceUpskillingProgramKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  upliftStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_UPSKILLING_PROGRAMS: WorkforceUpskillingProgram[] = [
  {
    id: 'upskill_tech_nsw_vic',
    kind: 'metro_tech_stack',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    upliftStrength: 0.82,
    label: 'Metro tech stack uplift',
    narrative: 'Digital stack programs raise skilled supply indices in output-heavy metros.'
  },
  {
    id: 'upskill_mining_wa',
    kind: 'frontier_reskill',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    upliftStrength: 0.76,
    label: 'Resource automation reskill',
    narrative: 'Frontier reskill packs offset automation drag without literal training counts.'
  },
  {
    id: 'upskill_manufacturing_vic',
    kind: 'trades_apprentice',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    upliftStrength: 0.69,
    label: 'Industrial trades depth',
    narrative: 'Apprentice-depth indices tighten skill mismatch in manufacturing corridors.'
  },
  {
    id: 'upskill_energy_nt',
    kind: 'frontier_reskill',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'WA'],
    upliftStrength: 0.73,
    label: 'Energy transition reskill',
    narrative: 'Transition reskill eases mismatch when automation pressure rises in frontiers.'
  },
  {
    id: 'upskill_agri_sa_tas',
    kind: 'regional_services',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS', 'VIC'],
    upliftStrength: 0.58,
    label: 'Regional agri precision uplift',
    narrative: 'Precision ag uplift supports seasonal skill depth in regional hosts.'
  },
  {
    id: 'upskill_research_act',
    kind: 'digital_transition',
    targetIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    upliftStrength: 0.71,
    label: 'Policy-research digital uplift',
    narrative: 'Research adjacency programs lift skilled supply in capital corridors.'
  },
  {
    id: 'upskill_tourism_qld',
    kind: 'regional_services',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS', 'NSW'],
    upliftStrength: 0.52,
    label: 'Tourism service uplift',
    narrative: 'Service uplift indices reduce mismatch during seasonal demand peaks.'
  },
  {
    id: 'upskill_trade_nsw',
    kind: 'metro_tech_stack',
    targetIndustry: 'trade',
    hostRegions: ['NSW', 'VIC'],
    upliftStrength: 0.64,
    label: 'Gateway logistics uplift',
    narrative: 'Logistics uplift supports trade-linked skilled supply in gateway regions.'
  }
];

export function upskillingProgramsForIndustry(industry: StrategicIndustryKind): WorkforceUpskillingProgram[] {
  return WORKFORCE_UPSKILLING_PROGRAMS.filter(p => p.targetIndustry === industry);
}

export function lookupWorkforceUpskillingProgram(id: string): WorkforceUpskillingProgram | undefined {
  return WORKFORCE_UPSKILLING_PROGRAMS.find(p => p.id === id);
}

export function upskillingUpliftForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_UPSKILLING_PROGRAMS.filter(
    p => p.targetIndustry === dominantIndustry && p.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, p) => a + p.upliftStrength, 0) / matches.length;
}
