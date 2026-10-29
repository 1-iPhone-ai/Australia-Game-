import type { StrategicIndustryKind } from '../types';

export type SkilledLaborPathwayKind =
  | 'resource_technical'
  | 'metro_digital'
  | 'health_education'
  | 'regional_agri'
  | 'frontier_energy';

export interface SkilledLaborPathway {
  id: string;
  kind: SkilledLaborPathwayKind;
  primaryIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  pullStrength: number;
  label: string;
  narrative: string;
}

export const SKILLED_LABOR_PATHWAYS: SkilledLaborPathway[] = [
  {
    id: 'path_mining_wa_qld',
    kind: 'resource_technical',
    primaryIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    pullStrength: 0.82,
    label: 'Resource technical rotation',
    narrative: 'Fly-in workforce and skilled trades follow supercycle output without census migration counts.'
  },
  {
    id: 'path_tech_nsw_vic',
    kind: 'metro_digital',
    primaryIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    pullStrength: 0.88,
    label: 'Metro digital talent lanes',
    narrative: 'Technology output concentration raises skilled inflow pressure in capital corridors.'
  },
  {
    id: 'path_research_act_nsw',
    kind: 'health_education',
    primaryIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    pullStrength: 0.64,
    label: 'Research–policy talent loop',
    narrative: 'Research output and policy adjacency attract specialized labor in bounded attractiveness indices.'
  },
  {
    id: 'path_agri_sa_tas',
    kind: 'regional_agri',
    primaryIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS'],
    pullStrength: 0.52,
    label: 'Regional agri seasonal depth',
    narrative: 'Agriculture linkage supports seasonal labor depth scores — not literal headcount.'
  },
  {
    id: 'path_energy_nt_qld',
    kind: 'frontier_energy',
    primaryIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    pullStrength: 0.71,
    label: 'Frontier energy crews',
    narrative: 'Energy frontier regions gain skilled pull when output and corridor strength align.'
  },
  {
    id: 'path_manufact_vic_sa',
    kind: 'resource_technical',
    primaryIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    pullStrength: 0.58,
    label: 'Manufacturing supply-chain labor',
    narrative: 'Manufacturing hubs exchange skilled labor through interstate supply-chain coupling.'
  },
  {
    id: 'path_tourism_qld_tas',
    kind: 'regional_agri',
    primaryIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS'],
    pullStrength: 0.49,
    label: 'Tourism seasonal pathways',
    narrative: 'Tourism peaks raise short-horizon skilled service labor pull in host regions.'
  },
  {
    id: 'path_trade_nsw',
    kind: 'metro_digital',
    primaryIndustry: 'trade',
    hostRegions: ['NSW'],
    pullStrength: 0.55,
    label: 'Gateway trade logistics',
    narrative: 'Trade gateway output supports logistics-skilled labor attractiveness in NSW.'
  }
];

export function pathwaysForIndustry(industry: StrategicIndustryKind): SkilledLaborPathway[] {
  return SKILLED_LABOR_PATHWAYS.filter(p => p.primaryIndustry === industry);
}

export function lookupSkilledLaborPathway(id: string): SkilledLaborPathway | undefined {
  return SKILLED_LABOR_PATHWAYS.find(p => p.id === id);
}

export function skilledPathwayPullForRegion(regionId: string, dominantIndustry: StrategicIndustryKind | null): number {
  if (!dominantIndustry) return 0;
  const matches = SKILLED_LABOR_PATHWAYS.filter(
    p => p.primaryIndustry === dominantIndustry && p.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, p) => a + p.pullStrength, 0) / matches.length;
}
