import type { ResearchInstitutionDefinition } from './types.ts';

export const RESEARCH_INSTITUTIONS: ResearchInstitutionDefinition[] = [
  {
    id: 'csiro_ai_directorate',
    name: 'CSIRO AI Directorate',
    type: 'national_lab',
    homeRegions: ['ACT'],
    supportedBranches: ['digital_frontier', 'sovereign_research'],
    readinessBonus: 12,
    minStanding: 35,
    preferredProjectTypes: ['research_campus', 'tech_innovation_park', 'data_center', 'subsea_cable_hub'],
    preferredContractTypes: ['ai_research_center'],
    description:
      'National research directorate — mirrors V9.4 faction csiro_ai_directorate; boosts digital and sovereign research branches in ACT and nationally when standing holds.',
  },
  {
    id: 'vic_technology_council',
    name: 'Victoria Technology Council',
    type: 'industry_council',
    homeRegions: ['VIC'],
    supportedBranches: ['industrial_transformation', 'digital_frontier'],
    readinessBonus: 10,
    minStanding: 30,
    preferredProjectTypes: ['tech_innovation_park', 'advanced_manufacturing', 'subsea_cable_hub', 'data_center'],
    preferredContractTypes: ['ai_research_center', 'mining_tech_initiative', 'manufacturing_modernization'],
    description:
      'Melbourne technology and advanced manufacturing coalition — accelerates industrial transformation readiness.',
  },
  {
    id: 'tas_innovation_network',
    name: 'Tasmanian Innovation Network',
    type: 'university_network',
    homeRegions: ['TAS'],
    supportedBranches: ['sovereign_research', 'digital_frontier'],
    readinessBonus: 8,
    minStanding: 25,
    preferredProjectTypes: ['subsea_cable_hub', 'tech_innovation_park'],
    preferredContractTypes: ['ai_research_center'],
    description:
      'Emergent Tasmania innovation network — contributes when faction status is active (see V9.4 emergent faction rules).',
  },
  {
    id: 'federal_infrastructure_office',
    name: 'Federal Infrastructure Office',
    type: 'federal_agency',
    homeRegions: ['ACT'],
    supportedBranches: ['energy_transition', 'agri_water_systems', 'sovereign_research'],
    readinessBonus: 9,
    minStanding: 40,
    preferredProjectTypes: ['research_campus', 'desalination_plant', 'inland_rail_hub', 'renewable_grid'],
    preferredContractTypes: ['defense_logistics_hub', 'disaster_relief_supply', 'water_security', 'crisis_recovery'],
    description:
      'Federal coordination for megaprojects and crisis recovery — late-game standing unlocks cross-branch diffusion bonuses.',
  },
  {
    id: 'unsw_research_alliance',
    name: 'UNSW Research Alliance',
    type: 'university_network',
    homeRegions: ['NSW'],
    supportedBranches: ['digital_frontier', 'industrial_transformation', 'sovereign_research'],
    readinessBonus: 7,
    minStanding: 20,
    preferredProjectTypes: ['research_campus', 'data_center'],
    preferredContractTypes: ['ai_research_center', 'manufacturing_modernization'],
    description: 'Sydney–Canberra research corridor — module-local institution for Operation 10M assembly (maps to regional contracts theme).',
  },
  {
    id: 'uq_energy_research',
    name: 'UQ Energy Research Consortium',
    type: 'university_network',
    homeRegions: ['QLD'],
    supportedBranches: ['energy_transition', 'resource_innovation'],
    readinessBonus: 6,
    minStanding: 20,
    preferredProjectTypes: ['renewable_grid', 'green_hydrogen_terminal', 'remote_logistics_base'],
    preferredContractTypes: ['mining_tech_initiative'],
    description: 'Queensland energy and mining research consortium supporting transition and resource innovation branches.',
  },
];

export const RESEARCH_INSTITUTION_BY_ID = Object.fromEntries(
  RESEARCH_INSTITUTIONS.map(i => [i.id, i])
);

/** Regions that receive spillover readiness from an institution home region. */
export const INSTITUTION_DIFFUSION_NEIGHBORS: Record<string, string[]> = {
  ACT: ['NSW', 'VIC'],
  NSW: ['ACT', 'VIC', 'QLD'],
  VIC: ['NSW', 'SA', 'TAS'],
  QLD: ['NSW', 'NT'],
  SA: ['VIC', 'WA', 'NT'],
  WA: ['SA', 'NT'],
  TAS: ['VIC'],
  NT: ['QLD', 'WA', 'SA'],
  AAT: [],
};
