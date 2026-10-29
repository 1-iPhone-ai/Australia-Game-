/**
 * Canonical V9.4 identifier unions (mirrored for assembly parity checks).
 * Keep in sync with `(V9.4) australia-game-with-ai.tsx` — do not import that file here.
 */

export type V94EmergingCapabilityId =
  | 'advanced_logistics'
  | 'automated_mining'
  | 'advanced_manufacturing'
  | 'grid_scale_storage'
  | 'advanced_water_systems'
  | 'ai_compute_infrastructure'
  | 'precision_agriculture'
  | 'research_commercialization';

export const V94_CAPABILITY_IDS: V94EmergingCapabilityId[] = [
  'advanced_logistics',
  'automated_mining',
  'advanced_manufacturing',
  'grid_scale_storage',
  'advanced_water_systems',
  'ai_compute_infrastructure',
  'precision_agriculture',
  'research_commercialization',
];

export type V94CapabilityMaturity =
  | 'unavailable'
  | 'emerging'
  | 'demonstrated'
  | 'operational'
  | 'scaled'
  | 'nationally_integrated';

export const V94_CAPABILITY_MATURITY_RANK: Record<V94CapabilityMaturity, number> = {
  unavailable: 0,
  emerging: 1,
  demonstrated: 2,
  operational: 3,
  scaled: 4,
  nationally_integrated: 5,
};

export type V94LRSector =
  | 'mining'
  | 'agriculture'
  | 'technology'
  | 'finance'
  | 'manufacturing'
  | 'energy'
  | 'renewables'
  | 'tourism'
  | 'trade'
  | 'logistics'
  | 'research'
  | 'defense'
  | 'infrastructure';

export type V94MegaprojectKind =
  | 'national_high_speed_rail'
  | 'eastern_energy_supergrid'
  | 'national_water_security'
  | 'australian_ai_compute_network'
  | 'northern_export_corridor'
  | 'green_hydrogen_export_network'
  | 'continental_digital_backbone'
  | 'national_freight_modernization';

export const V94_MEGAPROJECT_KINDS: V94MegaprojectKind[] = [
  'national_high_speed_rail',
  'eastern_energy_supergrid',
  'national_water_security',
  'australian_ai_compute_network',
  'northern_export_corridor',
  'green_hydrogen_export_network',
  'continental_digital_backbone',
  'national_freight_modernization',
];

export type V94InfrastructureProjectType =
  | 'research_campus'
  | 'tech_innovation_park'
  | 'data_center'
  | 'subsea_cable_hub'
  | 'advanced_manufacturing'
  | 'desalination_plant'
  | 'water_pipeline'
  | 'hydro_expansion'
  | 'renewable_grid'
  | 'green_hydrogen_terminal'
  | 'inland_rail_hub'
  | 'freight_rail_upgrade'
  | 'automated_port'
  | 'remote_logistics_base';

export type V94ContractType =
  | 'ai_research_center'
  | 'mining_tech_initiative'
  | 'manufacturing_modernization'
  | 'defense_logistics_hub'
  | 'disaster_relief_supply'
  | 'water_security'
  | 'crisis_recovery';

export type V94FactionId =
  | 'csiro_ai_directorate'
  | 'vic_technology_council'
  | 'tas_innovation_network'
  | 'federal_infrastructure_office';

export type V94AustralianRegionCode =
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'SA'
  | 'WA'
  | 'TAS'
  | 'NT'
  | 'ACT'
  | 'AAT';

export const V94_REGION_CODES: V94AustralianRegionCode[] = [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'NT',
  'ACT',
  'AAT',
];
