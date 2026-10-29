/**
 * Research & technology institutions — RF-faction-compatible records + V10.11 innovation_coordination hooks.
 * These extend (not replace) canonical RF_FACTION_DEFINITIONS entries such as csiro_ai_directorate.
 */

import type { InstitutionalCapabilityId, LRSector, RegionCode } from '../types';

export type ResearchInstitutionKind =
  | 'national_lab'
  | 'university_network'
  | 'industry_crc'
  | 'clinical_precinct'
  | 'sovereign_platform';

export interface Agent03ResearchInstitution {
  id: string;
  name: string;
  kind: ResearchInstitutionKind;
  homeRegions: RegionCode[];
  description: string;
  supportedSectors: LRSector[];
  preferredInfrastructure: string[];
  preferredContractTypes: string[];
  /** When present, institution only emerges once regional sectors cross threshold */
  emergent?: { regionId: RegionCode; sectors: LRSector[]; threshold: number };
  /** V10.11: which institutional delivery capabilities this body stresses when active */
  stressesInstitutionalCapabilities: InstitutionalCapabilityId[];
  /** Capability ids (baseline + agent03) that gain evidence acceleration when institution is influential */
  acceleratesCapabilities: string[];
  commercializationRole: 'intake' | 'pilot_host' | 'export_licensing' | 'platform_operator' | 'none';
  policyInterests: Array<'growth' | 'stability' | 'automation_friendly' | 'relief' | 'sovereignty'>;
  aliases: string[];
}

export const AGENT03_RESEARCH_INSTITUTIONS: Agent03ResearchInstitution[] = [
  {
    id: 'unsw_translation_hub',
    name: 'UNSW Translation Hub',
    kind: 'university_network',
    homeRegions: ['NSW'],
    description: 'Deep-tech spin-outs and industry secondments bridging university research and Sydney manufacturing.',
    supportedSectors: ['research', 'technology', 'manufacturing'],
    preferredInfrastructure: ['tech_innovation_park', 'subsea_cable_hub', 'advanced_manufacturing', 'research_campus'],
    preferredContractTypes: ['ai_research_center', 'manufacturing_modernization'],
    stressesInstitutionalCapabilities: ['innovation_coordination', 'digital_administration'],
    acceleratesCapabilities: ['research_commercialization', 'advanced_manufacturing', 'sovereign_ai_platforms'],
    commercializationRole: 'intake',
    policyInterests: ['growth', 'automation_friendly'],
    aliases: ['unsw hub', 'translation hub', 'deep tech hub'],
  },
  {
    id: 'melbourne_biomedical_precinct',
    name: 'Melbourne Biomedical Precinct',
    kind: 'clinical_precinct',
    homeRegions: ['VIC'],
    description: 'Hospital, university and med-tech firms co-located for trials and regulated commercialization.',
    supportedSectors: ['research', 'technology', 'manufacturing'],
    preferredInfrastructure: ['research_campus', 'tech_innovation_park', 'data_center'],
    preferredContractTypes: ['ai_research_center'],
    stressesInstitutionalCapabilities: ['innovation_coordination', 'national_project_coordination'],
    acceleratesCapabilities: ['clinical_translation_network', 'research_commercialization'],
    commercializationRole: 'pilot_host',
    policyInterests: ['growth', 'stability'],
    aliases: ['biomedical precinct', 'melbourne medtech', 'clinical precinct'],
  },
  {
    id: 'wa_pawsey_extension',
    name: 'Pawsey Extension Consortium',
    kind: 'national_lab',
    homeRegions: ['WA'],
    description: 'HPC and quantum sensing partnerships for resources, defence and agriculture instrumentation.',
    supportedSectors: ['research', 'technology', 'mining', 'defense'],
    preferredInfrastructure: ['data_center', 'remote_logistics_base', 'tech_innovation_park'],
    preferredContractTypes: ['ai_research_center', 'mining_tech_initiative'],
    emergent: { regionId: 'WA', sectors: ['technology', 'research'], threshold: 28 },
    stressesInstitutionalCapabilities: ['digital_administration', 'interregional_delivery'],
    acceleratesCapabilities: ['quantum_sensing_industry', 'ai_compute_infrastructure', 'automated_mining'],
    commercializationRole: 'platform_operator',
    policyInterests: ['growth', 'sovereignty'],
    aliases: ['pawsey', 'pawsey extension', 'hpc wa'],
  },
  {
    id: 'qld_critical_minerals_research',
    name: 'QLD Critical Minerals Research Office',
    kind: 'industry_crc',
    homeRegions: ['QLD'],
    description: 'Downstream processing research aligned with export corridors and advanced manufacturing inputs.',
    supportedSectors: ['research', 'mining', 'manufacturing', 'trade'],
    preferredInfrastructure: ['port_expansion', 'advanced_manufacturing', 'renewable_grid'],
    preferredContractTypes: ['mining_tech_initiative', 'manufacturing_modernization', 'maritime_export_hub'],
    stressesInstitutionalCapabilities: ['infrastructure_planning', 'innovation_coordination'],
    acceleratesCapabilities: ['advanced_manufacturing', 'research_commercialization', 'defence_dual_use_pipeline'],
    commercializationRole: 'export_licensing',
    policyInterests: ['growth'],
    aliases: ['critical minerals office', 'qld minerals research'],
  },
  {
    id: 'act_sovereign_ai_council',
    name: 'ACT Sovereign AI Council',
    kind: 'sovereign_platform',
    homeRegions: ['ACT'],
    description: 'Cross-agency coordination for sovereign AI platforms, compute allocation and responsible deployment.',
    supportedSectors: ['research', 'technology', 'finance', 'defense'],
    preferredInfrastructure: ['data_center', 'research_campus', 'tech_innovation_park', 'subsea_cable_hub'],
    preferredContractTypes: ['ai_research_center'],
    stressesInstitutionalCapabilities: ['innovation_coordination', 'digital_administration', 'national_project_coordination'],
    acceleratesCapabilities: ['sovereign_ai_platforms', 'ai_compute_infrastructure', 'research_commercialization'],
    commercializationRole: 'platform_operator',
    policyInterests: ['growth', 'sovereignty', 'stability'],
    aliases: ['sovereign ai council', 'ai council act'],
  },
  {
    id: 'sa_defence_innovation_alliance',
    name: 'SA Defence Innovation Alliance',
    kind: 'industry_crc',
    homeRegions: ['SA'],
    description: 'Dual-use research with strict governance — manufacturing and research without bypassing stakeholder constraints.',
    supportedSectors: ['defense', 'research', 'manufacturing', 'technology'],
    preferredInfrastructure: ['advanced_manufacturing', 'research_campus', 'defense_logistics_hub'],
    preferredContractTypes: ['defense_logistics_hub', 'manufacturing_modernization'],
    stressesInstitutionalCapabilities: ['national_project_coordination', 'emergency_coordination'],
    acceleratesCapabilities: ['defence_dual_use_pipeline', 'advanced_manufacturing'],
    commercializationRole: 'pilot_host',
    policyInterests: ['stability', 'sovereignty'],
    aliases: ['defence innovation alliance', 'sa dual use'],
  },
  {
    id: 'tas_antarctic_tech_exchange',
    name: 'Tasmanian Antarctic Tech Exchange',
    kind: 'university_network',
    homeRegions: ['TAS'],
    description: 'Extreme-environment instrumentation and logistics research with tourism and science spillovers.',
    supportedSectors: ['research', 'technology', 'logistics', 'tourism'],
    preferredInfrastructure: ['subsea_cable_hub', 'remote_logistics_base', 'research_campus'],
    preferredContractTypes: ['ai_research_center', 'disaster_relief_supply'],
    emergent: { regionId: 'TAS', sectors: ['research', 'technology'], threshold: 24 },
    stressesInstitutionalCapabilities: ['adaptive_recovery', 'interregional_delivery'],
    acceleratesCapabilities: ['precision_agriculture', 'advanced_logistics', 'quantum_sensing_industry'],
    commercializationRole: 'intake',
    policyInterests: ['growth', 'relief'],
    aliases: ['antarctic tech exchange', 'tas tech exchange'],
  },
  {
    id: 'nt_indigenous_stem_partnership',
    name: 'NT Indigenous STEM Partnership',
    kind: 'university_network',
    homeRegions: ['NT'],
    description: 'Community-governed STEM pathways linking remote logistics, energy and digital inclusion.',
    supportedSectors: ['research', 'technology', 'infrastructure', 'energy'],
    preferredInfrastructure: ['remote_logistics_base', 'renewable_grid', 'subsea_cable_hub'],
    preferredContractTypes: ['renewable_energy_grid', 'freight_capacity'],
    stressesInstitutionalCapabilities: ['interregional_delivery', 'adaptive_recovery'],
    acceleratesCapabilities: ['precision_agriculture', 'grid_scale_storage'],
    commercializationRole: 'none',
    policyInterests: ['relief', 'stability', 'growth'],
    aliases: ['indigenous stem', 'nt stem partnership'],
  },
];

export const AGENT03_INSTITUTION_BY_ID: Record<string, Agent03ResearchInstitution> = Object.fromEntries(
  AGENT03_RESEARCH_INSTITUTIONS.map(i => [i.id, i]),
);

export function institutionsForRegion(region: RegionCode): Agent03ResearchInstitution[] {
  return AGENT03_RESEARCH_INSTITUTIONS.filter(i => i.homeRegions.includes(region));
}

export function institutionsAcceleratingCapability(capabilityId: string): Agent03ResearchInstitution[] {
  return AGENT03_RESEARCH_INSTITUTIONS.filter(i => i.acceleratesCapabilities.includes(capabilityId));
}

export function validateInstitutionCatalog(): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  AGENT03_RESEARCH_INSTITUTIONS.forEach(i => {
    if (ids.has(i.id)) issues.push(`duplicate institution id: ${i.id}`);
    ids.add(i.id);
    if (!i.homeRegions.length) issues.push(`no home region: ${i.id}`);
    if (i.id === 'csiro_ai_directorate') issues.push('do not duplicate canonical csiro_ai_directorate in agent03 catalog');
  });
  return issues;
}
