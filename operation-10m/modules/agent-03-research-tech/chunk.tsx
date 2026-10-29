// OP10M_MODULE_BEGIN agent-03-research-tech
// Operation 10M — Agent 03 research / technology / progression (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-03-research-tech/src/ — regenerate via npm run bundle:agent-03-chunk
// --- bundled from src/internal-constants.ts ---
/** Shared status matcher for active infrastructure / project records. */
export const AGENT03_ACTIVE_PROJECT = /^(active|upgraded|partial|operational|completed)/i;

// --- bundled from src/v94-ids.ts ---
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

// --- bundled from src/types.ts ---
export type ResearchBranchId =
  | 'digital_frontier'
  | 'resource_innovation'
  | 'industrial_transformation'
  | 'energy_transition'
  | 'agri_water_systems'
  | 'sovereign_research';

export type ResearchNodeTier = 1 | 2 | 3 | 4 | 5;

/** External gate — must be satisfied before a branch node can complete. */
export type ResearchExternalPrerequisite =
  | { kind: 'capability'; capability: V94EmergingCapabilityId; minMaturity: V94CapabilityMaturity }
  | { kind: 'project_active'; projectType: V94InfrastructureProjectType; regionId?: V94AustralianRegionCode }
  | { kind: 'contract_completed'; contractType: V94ContractType; minCount?: number }
  | { kind: 'megaproject_stage'; program: V94MegaprojectKind; minCompletedStages: number }
  | { kind: 'faction_standing'; factionId: V94FactionId; minStanding: number }
  | { kind: 'sector_strength'; regionId: V94AustralianRegionCode; sector: V94LRSector; minScore: number }
  | { kind: 'branch_progress'; branchId: ResearchBranchId; minTier: ResearchNodeTier };

export interface ResearchBranchNodeDefinition {
  id: string;
  branchId: ResearchBranchId;
  tier: ResearchNodeTier;
  label: string;
  summary: string;
  /** Other branch nodes that must be unlocked first (same save). */
  requiresNodes: string[];
  external: ResearchExternalPrerequisite[];
  /** Weight for diffusion seed when this node unlocks (0..1). */
  diffusionSeed: number;
  /** Late-game strategic hooks emitted when this node unlocks. */
  hookIds: string[];
}

export interface ResearchBranchDefinition {
  id: ResearchBranchId;
  label: string;
  icon: string;
  description: string;
  anchorRegions: V94AustralianRegionCode[];
  primaryCapability: V94EmergingCapabilityId;
  secondaryCapabilities: V94EmergingCapabilityId[];
  sectors: V94LRSector[];
}

export type InstitutionType = 'national_lab' | 'university_network' | 'industry_council' | 'federal_agency';

export interface ResearchInstitutionDefinition {
  id: V94FactionId | string;
  name: string;
  type: InstitutionType;
  homeRegions: V94AustralianRegionCode[];
  supportedBranches: ResearchBranchId[];
  /** Adds to branch readiness score in home + linked regions (0..15). */
  readinessBonus: number;
  /** Standing threshold before institution contributes (player ↔ faction). */
  minStanding: number;
  preferredProjectTypes: V94InfrastructureProjectType[];
  preferredContractTypes: V94ContractType[];
  description: string;
}

export type InstitutionUpgradeTier =
  | 'dormant'
  | 'affiliate'
  | 'partner'
  | 'strategic'
  | 'national_integration';

export interface InstitutionUpgradeState {
  institutionId: string;
  tier: InstitutionUpgradeTier;
  readinessMultiplier: number;
  diffusionMultiplier: number;
  assessedTurn: number;
  reasons: string[];
}

export interface LateGameDiffusionPulse {
  fromRegionId: V94AustralianRegionCode;
  toRegionId: V94AustralianRegionCode;
  hops: number;
  strength: number;
}

export interface LateGameDiffusionReport {
  active: boolean;
  trigger: 'tier4_unlock' | 'national_institution' | 'both' | 'none';
  tier4UnlockCount: number;
  nationalInstitutionCount: number;
  pulses: LateGameDiffusionPulse[];
  nationalPenetration: number;
}

export interface ResearchProgressInputs {
  turn: number;
  regions: Array<{
    code: V94AustralianRegionCode;
    sectors: Partial<Record<V94LRSector, number>>;
  }>;
  capabilities: Partial<
    Record<V94EmergingCapabilityId, { maturity: V94CapabilityMaturity; activeRegionIds: string[] }>
  >;
  projects: Array<{
    id: string;
    regionId: V94AustralianRegionCode | null;
    projectType: string;
    status: string;
  }>;
  completedContracts: Array<{ contractType: string; regionId: string | null }>;
  megaprojects: Partial<
    Record<V94MegaprojectKind, { completedStages: number; status: string }>
  >;
  factionStanding: Partial<Record<V94FactionId, number>>;
}

export interface RegionalDiffusionCell {
  regionId: V94AustralianRegionCode;
  score: number;
  level: 'latent' | 'aware' | 'adopting' | 'integrated';
  sourceNodeIds: string[];
  institutionBoost?: number;
  cascadeBoost?: number;
}

export interface UnlockedResearchNode {
  nodeId: string;
  branchId: ResearchBranchId;
  unlockedTurn: number;
  anchorRegionId: V94AustralianRegionCode | null;
}

export interface ResearchScaleWaveReport {
  active: boolean;
  tier5UnlockCount: number;
  crossBranchSynergyScore: number;
  technologyTransferLinks: Array<{
    fromBranch: ResearchBranchId;
    toBranch: ResearchBranchId;
    strength: number;
  }>;
  dominantCapabilityCluster: V94EmergingCapabilityId | null;
}

export type ResearchProgramEmphasis = 'applied' | 'fundamental' | 'commercial' | 'sovereign';

export interface ResearchBranchEmphasisState {
  branchId: ResearchBranchId;
  emphasis: ResearchProgramEmphasis;
  setTurn: number;
}

export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v3' as const;

export type ResearchProgressSchemaVersion =
  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION
  | 'op10m-agent03-v2'
  | 'op10m-agent03-v1';

export interface ResearchSaveMigrationEntry {
  fromVersion: ResearchProgressSchemaVersion | 'array-legacy';
  toVersion: ResearchProgressSchemaVersion;
  turn: number;
}

export interface ResearchProgressState {
  schemaVersion: ResearchProgressSchemaVersion;
  revision: number;
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  diffusion: RegionalDiffusionCell[];
  readinessByBranch: Record<ResearchBranchId, number>;
  activeHookIds: string[];
  leadingResearchRegion: V94AustralianRegionCode | null;
  inputHash: string;
  institutionUpgrades: InstitutionUpgradeState[];
  lateGameDiffusion: LateGameDiffusionReport | null;
  scaleWave: ResearchScaleWaveReport | null;
  unlockSeq: number;
  branchEmphasis?: ResearchBranchEmphasisState[];
  emphasisRevision?: number;
  migrationLog?: ResearchSaveMigrationEntry[];
}

export interface StrategyHookDefinition {
  id: string;
  title: string;
  phase: 'mid' | 'late' | 'endgame';
  description: string;
  /** Real V9.4 systems the UI/AI should prioritize when this hook is active. */
  targets: {
    capabilities?: Array<{ id: V94EmergingCapabilityId; aimMaturity: V94CapabilityMaturity }>;
    megaprojects?: V94MegaprojectKind[];
    projectTypes?: V94InfrastructureProjectType[];
    contractTypes?: V94ContractType[];
    factions?: V94FactionId[];
  };
  branchIds: ResearchBranchId[];
  minUnlockedTier?: ResearchNodeTier;
}

export interface Agent03SelfTestResult {
  id: string;
  passed: boolean;
  detail?: string;
}

// --- bundled from src/branches.ts ---
export const RESEARCH_BRANCHES: ResearchBranchDefinition[] = [
  {
    id: 'digital_frontier',
    label: 'Digital Frontier',
    icon: '🧠',
    description:
      'National compute, subsea links, and research campuses — aligned with V10.5 AI compute and continental digital backbone programs.',
    anchorRegions: ['ACT', 'NSW', 'VIC'],
    primaryCapability: 'ai_compute_infrastructure',
    secondaryCapabilities: ['research_commercialization'],
    sectors: ['technology', 'research'],
  },
  {
    id: 'resource_innovation',
    label: 'Resource Innovation',
    icon: '⛏',
    description:
      'Automated mining and export corridors where Pilbara-scale mining meets digital freight and remote logistics.',
    anchorRegions: ['WA', 'QLD', 'NT'],
    primaryCapability: 'automated_mining',
    secondaryCapabilities: ['advanced_logistics'],
    sectors: ['mining', 'logistics', 'technology'],
  },
  {
    id: 'industrial_transformation',
    label: 'Industrial Transformation',
    icon: '🏭',
    description:
      'Advanced manufacturing precincts and research-to-industry pipelines across Victoria and NSW industrial belts.',
    anchorRegions: ['VIC', 'NSW', 'SA'],
    primaryCapability: 'advanced_manufacturing',
    secondaryCapabilities: ['research_commercialization'],
    sectors: ['manufacturing', 'research', 'technology'],
  },
  {
    id: 'energy_transition',
    label: 'Energy Transition',
    icon: '🔋',
    description:
      'Grid-scale storage, renewable supergrids, and hydrogen export — bounded modifiers through existing energy networks.',
    anchorRegions: ['SA', 'QLD', 'TAS'],
    primaryCapability: 'grid_scale_storage',
    secondaryCapabilities: ['advanced_manufacturing'],
    sectors: ['renewables', 'energy'],
  },
  {
    id: 'agri_water_systems',
    label: 'Agri–Water Systems',
    icon: '🌾',
    description:
      'Precision agriculture and advanced water systems for drought-era resilience without eliminating crisis gameplay.',
    anchorRegions: ['NSW', 'VIC', 'SA'],
    primaryCapability: 'precision_agriculture',
    secondaryCapabilities: ['advanced_water_systems'],
    sectors: ['agriculture'],
  },
  {
    id: 'sovereign_research',
    label: 'Sovereign Research',
    icon: '🔬',
    description:
      'Public-good research commercialization, CSIRO-aligned directorates, and nationally integrated research capability.',
    anchorRegions: ['ACT', 'TAS', 'NSW'],
    primaryCapability: 'research_commercialization',
    secondaryCapabilities: ['ai_compute_infrastructure'],
    sectors: ['research', 'technology', 'finance'],
  },
];

const n = (
  partial: Omit<ResearchBranchNodeDefinition, 'requiresNodes' | 'external' | 'diffusionSeed' | 'hookIds'> &
    Partial<Pick<ResearchBranchNodeDefinition, 'requiresNodes' | 'external' | 'diffusionSeed' | 'hookIds'>>
): ResearchBranchNodeDefinition => ({
  requiresNodes: [],
  external: [],
  diffusionSeed: 0.15,
  hookIds: [],
  ...partial,
});

export const RESEARCH_BRANCH_NODES: ResearchBranchNodeDefinition[] = [
  // --- digital_frontier ---
  n({
    id: 'df_t1_campus_foundation',
    branchId: 'digital_frontier',
    tier: 1,
    label: 'Campus Foundation',
    summary: 'Establish research campus capacity in Canberra or Sydney digital belt.',
    external: [{ kind: 'project_active', projectType: 'research_campus', regionId: 'ACT' }],
    hookIds: ['hook_df_campus_online'],
  }),
  n({
    id: 'df_t2_cable_backbone',
    branchId: 'digital_frontier',
    tier: 2,
    label: 'Subsea & Cable Backbone',
    summary: 'Link subsea cable hubs to national digital condition thresholds.',
    requiresNodes: ['df_t1_campus_foundation'],
    external: [{ kind: 'project_active', projectType: 'subsea_cable_hub' }],
    diffusionSeed: 0.22,
    hookIds: ['hook_df_digital_backbone'],
  }),
  n({
    id: 'df_t3_compute_cluster',
    branchId: 'digital_frontier',
    tier: 3,
    label: 'Compute Cluster',
    summary: 'Operational data-centre footprint with energy reliability gates.',
    requiresNodes: ['df_t2_cable_backbone'],
    external: [
      { kind: 'project_active', projectType: 'data_center' },
      { kind: 'capability', capability: 'ai_compute_infrastructure', minMaturity: 'emerging' },
    ],
    diffusionSeed: 0.28,
    hookIds: ['hook_df_ai_compute_operational'],
  }),
  n({
    id: 'df_t4_continental_integrated',
    branchId: 'digital_frontier',
    tier: 4,
    label: 'Continental Integration',
    summary: 'Late-game: continental digital backbone program + nationally integrated compute.',
    requiresNodes: ['df_t3_compute_cluster'],
    external: [
      { kind: 'megaproject_stage', program: 'continental_digital_backbone', minCompletedStages: 2 },
      { kind: 'capability', capability: 'ai_compute_infrastructure', minMaturity: 'nationally_integrated' },
    ],
    diffusionSeed: 0.35,
    hookIds: ['hook_endgame_digital_sovereignty'],
  }),
  n({
    id: 'df_t5_scale_wave_mesh',
    branchId: 'digital_frontier',
    tier: 5,
    label: 'Continental Research Mesh',
    summary: 'Scale wave: sovereign research tier-4 + integrated compute + digital backbone completion.',
    requiresNodes: ['df_t4_continental_integrated'],
    external: [
      { kind: 'branch_progress', branchId: 'sovereign_research', minTier: 4 },
      { kind: 'megaproject_stage', program: 'continental_digital_backbone', minCompletedStages: 4 },
    ],
    diffusionSeed: 0.4,
    hookIds: ['hook_scale_df_research_mesh'],
  }),

  // --- resource_innovation ---
  n({
    id: 'ri_t1_remote_logistics',
    branchId: 'resource_innovation',
    tier: 1,
    label: 'Remote Logistics Base',
    summary: 'Remote logistics supporting Pilbara or northern mining frontiers.',
    external: [{ kind: 'project_active', projectType: 'remote_logistics_base', regionId: 'WA' }],
    hookIds: ['hook_ri_remote_ops'],
  }),
  n({
    id: 'ri_t2_mining_tech',
    branchId: 'resource_innovation',
    tier: 2,
    label: 'Mining Tech Initiative',
    summary: 'Deliver mining technology contracts with technology sector strength.',
    requiresNodes: ['ri_t1_remote_logistics'],
    external: [
      { kind: 'contract_completed', contractType: 'mining_tech_initiative', minCount: 1 },
      { kind: 'sector_strength', regionId: 'WA', sector: 'mining', minScore: 35 },
    ],
    diffusionSeed: 0.2,
    hookIds: ['hook_ri_automation_path'],
  }),
  n({
    id: 'ri_t3_automated_mining',
    branchId: 'resource_innovation',
    tier: 3,
    label: 'Automated Mining Operational',
    summary: 'V10.5 automated mining capability at operational maturity in anchor region.',
    requiresNodes: ['ri_t2_mining_tech'],
    external: [{ kind: 'capability', capability: 'automated_mining', minMaturity: 'operational' }],
    diffusionSeed: 0.3,
    hookIds: ['hook_ri_export_corridor'],
  }),
  n({
    id: 'ri_t4_northern_export',
    branchId: 'resource_innovation',
    tier: 4,
    label: 'Northern Export Power',
    summary: 'Northern export corridor megaproject + scaled logistics capability.',
    requiresNodes: ['ri_t3_automated_mining'],
    external: [
      { kind: 'megaproject_stage', program: 'northern_export_corridor', minCompletedStages: 3 },
      { kind: 'capability', capability: 'advanced_logistics', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.32,
    hookIds: ['hook_endgame_resource_export'],
  }),
  n({
    id: 'ri_t5_scale_wave_autonomy',
    branchId: 'resource_innovation',
    tier: 5,
    label: 'Autonomous Export Mesh',
    summary: 'Scale wave: freight modernization + industrial tier-3+ absorbing mining automation outputs.',
    requiresNodes: ['ri_t4_northern_export'],
    external: [
      { kind: 'megaproject_stage', program: 'national_freight_modernization', minCompletedStages: 2 },
      { kind: 'branch_progress', branchId: 'industrial_transformation', minTier: 3 },
      { kind: 'capability', capability: 'automated_mining', minMaturity: 'nationally_integrated' },
    ],
    diffusionSeed: 0.38,
    hookIds: ['hook_scale_ri_autonomous_mesh'],
  }),

  // --- industrial_transformation ---
  n({
    id: 'it_t1_tech_park',
    branchId: 'industrial_transformation',
    tier: 1,
    label: 'Innovation Park',
    summary: 'Tech innovation park in Victoria or NSW manufacturing corridor.',
    external: [{ kind: 'project_active', projectType: 'tech_innovation_park', regionId: 'VIC' }],
    hookIds: ['hook_it_manufacturing_modernization'],
  }),
  n({
    id: 'it_t2_precinct',
    branchId: 'industrial_transformation',
    tier: 2,
    label: 'Advanced Precinct',
    summary: 'Advanced manufacturing precinct with energy and freight prerequisites.',
    requiresNodes: ['it_t1_tech_park'],
    external: [{ kind: 'project_active', projectType: 'advanced_manufacturing' }],
    diffusionSeed: 0.21,
    hookIds: ['hook_it_supply_chain_depth'],
  }),
  n({
    id: 'it_t3_commercialization',
    branchId: 'industrial_transformation',
    tier: 3,
    label: 'Research Commercialization',
    summary: 'Research commercialization capability demonstrated nationally.',
    requiresNodes: ['it_t2_precinct'],
    external: [{ kind: 'capability', capability: 'research_commercialization', minMaturity: 'demonstrated' }],
    diffusionSeed: 0.27,
    hookIds: ['hook_it_advanced_mfg_operational'],
  }),
  n({
    id: 'it_t4_integrated_economy',
    branchId: 'industrial_transformation',
    tier: 4,
    label: 'Integrated Industrial Economy',
    summary: 'Late-game: advanced manufacturing nationally integrated + council standing.',
    requiresNodes: ['it_t3_commercialization'],
    external: [
      { kind: 'capability', capability: 'advanced_manufacturing', minMaturity: 'nationally_integrated' },
      { kind: 'faction_standing', factionId: 'vic_technology_council', minStanding: 55 },
    ],
    diffusionSeed: 0.33,
    hookIds: ['hook_endgame_industrial_sovereignty'],
  }),
  n({
    id: 'it_t5_scale_wave_value_chain',
    branchId: 'industrial_transformation',
    tier: 5,
    label: 'National Value Chain',
    summary: 'Scale wave: HSR program progress + digital frontier tier-4 feeding manufacturing integration.',
    requiresNodes: ['it_t4_integrated_economy'],
    external: [
      { kind: 'megaproject_stage', program: 'national_high_speed_rail', minCompletedStages: 2 },
      { kind: 'branch_progress', branchId: 'digital_frontier', minTier: 4 },
    ],
    diffusionSeed: 0.37,
    hookIds: ['hook_scale_it_value_chain'],
  }),

  // --- energy_transition ---
  n({
    id: 'et_t1_renewable_grid',
    branchId: 'energy_transition',
    tier: 1,
    label: 'Renewable Grid Anchor',
    summary: 'Renewable grid project active in SA or QLD renewables belt.',
    external: [{ kind: 'project_active', projectType: 'renewable_grid', regionId: 'SA' }],
    hookIds: ['hook_et_supergrid_eligibility'],
  }),
  n({
    id: 'et_t2_storage_emerging',
    branchId: 'energy_transition',
    tier: 2,
    label: 'Storage Emerging',
    summary: 'Grid-scale storage capability emerging with hydro or hydrogen assets.',
    requiresNodes: ['et_t1_renewable_grid'],
    external: [
      { kind: 'capability', capability: 'grid_scale_storage', minMaturity: 'emerging' },
      { kind: 'project_active', projectType: 'hydro_expansion' },
    ],
    diffusionSeed: 0.24,
    hookIds: ['hook_et_energy_supergrid'],
  }),
  n({
    id: 'et_t3_hydrogen_export',
    branchId: 'energy_transition',
    tier: 3,
    label: 'Hydrogen Export Network',
    summary: 'Green hydrogen terminal + export network program progress.',
    requiresNodes: ['et_t2_storage_emerging'],
    external: [
      { kind: 'project_active', projectType: 'green_hydrogen_terminal' },
      { kind: 'megaproject_stage', program: 'green_hydrogen_export_network', minCompletedStages: 1 },
    ],
    diffusionSeed: 0.29,
    hookIds: ['hook_et_hydrogen_corridor'],
  }),
  n({
    id: 'et_t4_renewable_powerhouse',
    branchId: 'energy_transition',
    tier: 4,
    label: 'Renewable Powerhouse',
    summary: 'Endgame: eastern energy supergrid completed stages + scaled storage.',
    requiresNodes: ['et_t3_hydrogen_export'],
    external: [
      { kind: 'megaproject_stage', program: 'eastern_energy_supergrid', minCompletedStages: 4 },
      { kind: 'capability', capability: 'grid_scale_storage', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.34,
    hookIds: ['hook_endgame_renewable_dominance'],
  }),
  n({
    id: 'et_t5_scale_wave_hydrogen_dominance',
    branchId: 'energy_transition',
    tier: 5,
    label: 'Hydrogen Export Dominance',
    summary: 'Scale wave: hydrogen export network advanced stages + agri-water digital load balancing.',
    requiresNodes: ['et_t4_renewable_powerhouse'],
    external: [
      { kind: 'megaproject_stage', program: 'green_hydrogen_export_network', minCompletedStages: 3 },
      { kind: 'branch_progress', branchId: 'agri_water_systems', minTier: 3 },
    ],
    diffusionSeed: 0.39,
    hookIds: ['hook_scale_et_hydrogen_dominance'],
  }),

  // --- agri_water_systems ---
  n({
    id: 'aw_t1_water_security',
    branchId: 'agri_water_systems',
    tier: 1,
    label: 'Water Security Baseline',
    summary: 'Desalination or pipeline infrastructure addressing water need.',
    external: [{ kind: 'project_active', projectType: 'desalination_plant' }],
    hookIds: ['hook_aw_national_water_program'],
  }),
  n({
    id: 'aw_t2_precision_emerging',
    branchId: 'agri_water_systems',
    tier: 2,
    label: 'Precision Ag Emerging',
    summary: 'Precision agriculture emerging with digital connectivity in farm regions.',
    requiresNodes: ['aw_t1_water_security'],
    external: [{ kind: 'capability', capability: 'precision_agriculture', minMaturity: 'emerging' }],
    diffusionSeed: 0.23,
    hookIds: ['hook_aw_farm_technology'],
  }),
  n({
    id: 'aw_t3_advanced_water',
    branchId: 'agri_water_systems',
    tier: 3,
    label: 'Advanced Water Operational',
    summary: 'Advanced water systems operational — drought mitigation support active.',
    requiresNodes: ['aw_t2_precision_emerging'],
    external: [{ kind: 'capability', capability: 'advanced_water_systems', minMaturity: 'operational' }],
    diffusionSeed: 0.26,
    hookIds: ['hook_aw_drought_resilience'],
  }),
  n({
    id: 'aw_t4_ag_export',
    branchId: 'agri_water_systems',
    tier: 4,
    label: 'Agricultural Export Economy',
    summary: 'Late-game: national water security program + precision ag scaled.',
    requiresNodes: ['aw_t3_advanced_water'],
    external: [
      { kind: 'megaproject_stage', program: 'national_water_security', minCompletedStages: 3 },
      { kind: 'capability', capability: 'precision_agriculture', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.31,
    hookIds: ['hook_endgame_ag_export'],
  }),
  n({
    id: 'aw_t5_scale_wave_national_resilience',
    branchId: 'agri_water_systems',
    tier: 5,
    label: 'National Ag–Water Resilience',
    summary: 'Scale wave: water security program completion + energy transition tier-4 grid support.',
    requiresNodes: ['aw_t4_ag_export'],
    external: [
      { kind: 'megaproject_stage', program: 'national_water_security', minCompletedStages: 4 },
      { kind: 'branch_progress', branchId: 'energy_transition', minTier: 4 },
    ],
    diffusionSeed: 0.36,
    hookIds: ['hook_scale_aw_national_resilience'],
  }),

  // --- sovereign_research ---
  n({
    id: 'sr_t1_csiro_standing',
    branchId: 'sovereign_research',
    tier: 1,
    label: 'CSIRO Partnership',
    summary: 'CSIRO AI Directorate standing sufficient for national lab collaboration.',
    external: [{ kind: 'faction_standing', factionId: 'csiro_ai_directorate', minStanding: 40 }],
    hookIds: ['hook_sr_ai_research_contracts'],
  }),
  n({
    id: 'sr_t2_ai_research_center',
    branchId: 'sovereign_research',
    tier: 2,
    label: 'AI Research Center Delivered',
    summary: 'Complete ai_research_center contract in ACT research ecosystem.',
    requiresNodes: ['sr_t1_csiro_standing'],
    external: [{ kind: 'contract_completed', contractType: 'ai_research_center', minCount: 1 }],
    diffusionSeed: 0.25,
    hookIds: ['hook_sr_compute_network'],
  }),
  n({
    id: 'sr_t3_public_research',
    branchId: 'sovereign_research',
    tier: 3,
    label: 'Public Research Programs',
    summary: 'Australian AI compute network megaproject under construction or partial.',
    requiresNodes: ['sr_t2_ai_research_center'],
    external: [{ kind: 'megaproject_stage', program: 'australian_ai_compute_network', minCompletedStages: 2 }],
    diffusionSeed: 0.28,
    hookIds: ['hook_sr_commercialization_wave'],
  }),
  n({
    id: 'sr_t4_sovereign_integrated',
    branchId: 'sovereign_research',
    tier: 4,
    label: 'Sovereign Integrated Research',
    summary: 'Endgame: research commercialization nationally integrated + federal office alignment.',
    requiresNodes: ['sr_t3_public_research'],
    external: [
      { kind: 'capability', capability: 'research_commercialization', minMaturity: 'nationally_integrated' },
      { kind: 'faction_standing', factionId: 'federal_infrastructure_office', minStanding: 50 },
    ],
    diffusionSeed: 0.36,
    hookIds: ['hook_endgame_sovereign_research'],
  }),
  n({
    id: 'sr_t5_scale_wave_public_private',
    branchId: 'sovereign_research',
    tier: 5,
    label: 'Public–Private Research Compact',
    summary: 'Scale wave: three branches at tier-4+ and CSIRO at national integration standing.',
    requiresNodes: ['sr_t4_sovereign_integrated'],
    external: [
      { kind: 'branch_progress', branchId: 'digital_frontier', minTier: 4 },
      { kind: 'branch_progress', branchId: 'industrial_transformation', minTier: 4 },
      { kind: 'faction_standing', factionId: 'csiro_ai_directorate', minStanding: 78 },
    ],
    diffusionSeed: 0.42,
    hookIds: ['hook_scale_sr_public_private'],
  }),
];

export const RESEARCH_NODE_BY_ID: Record<string, ResearchBranchNodeDefinition> = Object.fromEntries(
  RESEARCH_BRANCH_NODES.map(node => [node.id, node])
);

export const RESEARCH_BRANCH_BY_ID = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, b])) as Record<
  ResearchBranchDefinition['id'],
  ResearchBranchDefinition
>;

// --- bundled from src/institutions.ts ---
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

// --- bundled from src/prerequisites.ts ---
export interface PrerequisiteEvaluation {
  nodeId: string;
  satisfied: boolean;
  missingNodeIds: string[];
  unmetExternal: ResearchExternalPrerequisite[];
  detail: string[];
}

function countContracts(inputs: ResearchProgressInputs, contractType: string): number {
  return inputs.completedContracts.filter(c => c.contractType === contractType).length;
}

function projectActive(
  inputs: ResearchProgressInputs,
  projectType: string,
  regionId?: string
): boolean {
  return inputs.projects.some(
    p =>
      p.projectType === projectType &&
      AGENT03_ACTIVE_PROJECT.test(p.status) &&
      (regionId == null || p.regionId === regionId)
  );
}

function capabilityAtLeast(
  inputs: ResearchProgressInputs,
  capability: string,
  minMaturity: keyof typeof V94_CAPABILITY_MATURITY_RANK
): boolean {
  const cap = inputs.capabilities[capability as keyof typeof inputs.capabilities];
  if (!cap) return false;
  return V94_CAPABILITY_MATURITY_RANK[cap.maturity] >= V94_CAPABILITY_MATURITY_RANK[minMaturity];
}

function megaprojectStages(inputs: ResearchProgressInputs, program: string): number {
  return inputs.megaprojects[program as keyof typeof inputs.megaprojects]?.completedStages ?? 0;
}

function factionStanding(inputs: ResearchProgressInputs, factionId: string): number {
  return inputs.factionStanding[factionId as keyof typeof inputs.factionStanding] ?? 0;
}

function sectorScore(inputs: ResearchProgressInputs, regionId: string, sector: string): number {
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  return Number(region.sectors[sector as keyof typeof region.sectors] ?? 0);
}

function maxTierOnBranch(unlockedNodeIds: Set<string>, branchId: string): number {
  let max = 0;
  for (const id of unlockedNodeIds) {
    const node = RESEARCH_NODE_BY_ID[id];
    if (node?.branchId === branchId) max = Math.max(max, node.tier);
  }
  return max;
}

export function evaluateExternalPrerequisite(
  inputs: ResearchProgressInputs,
  req: ResearchExternalPrerequisite,
  unlockedNodeIds: Set<string> = new Set()
): boolean {
  switch (req.kind) {
    case 'capability':
      return capabilityAtLeast(inputs, req.capability, req.minMaturity);
    case 'project_active':
      return projectActive(inputs, req.projectType, req.regionId);
    case 'contract_completed':
      return countContracts(inputs, req.contractType) >= (req.minCount ?? 1);
    case 'megaproject_stage':
      return megaprojectStages(inputs, req.program) >= req.minCompletedStages;
    case 'faction_standing':
      return factionStanding(inputs, req.factionId) >= req.minStanding;
    case 'sector_strength':
      return sectorScore(inputs, req.regionId, req.sector) >= req.minScore;
    case 'branch_progress':
      return maxTierOnBranch(unlockedNodeIds, req.branchId) >= req.minTier;
    default:
      return false;
  }
}

export function evaluateNodePrerequisites(
  inputs: ResearchProgressInputs,
  nodeId: string,
  unlockedNodeIds: Set<string>
): PrerequisiteEvaluation {
  const def = RESEARCH_NODE_BY_ID[nodeId];
  if (!def) {
    return {
      nodeId,
      satisfied: false,
      missingNodeIds: [],
      unmetExternal: [],
      detail: ['unknown node'],
    };
  }

  const missingNodeIds = def.requiresNodes.filter(id => !unlockedNodeIds.has(id));
  const unmetExternal = def.external.filter(ext => !evaluateExternalPrerequisite(inputs, ext, unlockedNodeIds));
  const satisfied = missingNodeIds.length === 0 && unmetExternal.length === 0;

  const detail: string[] = [];
  missingNodeIds.forEach(id => detail.push(`requires node ${id}`));
  unmetExternal.forEach(ext => detail.push(`external:${ext.kind}`));

  return { nodeId, satisfied, missingNodeIds, unmetExternal, detail };
}

/** Topological order for branch nodes (respects requiresNodes only). */
export function branchNodeTopologicalOrder(branchId: string): string[] {
  const nodes = Object.values(RESEARCH_NODE_BY_ID).filter(n => n.branchId === branchId);
  const ids = new Set(nodes.map(n => n.id));
  const order: string[] = [];
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (!def) return;
    def.requiresNodes.filter(r => ids.has(r)).forEach(visit);
    order.push(id);
  };

  nodes.sort((a, b) => a.tier - b.tier).forEach(n => visit(n.id));
  return order;
}

export function detectPrerequisiteCycle(): string | null {
  const visiting = new Set<string>();
  const done = new Set<string>();

  const dfs = (id: string): string | null => {
    if (done.has(id)) return null;
    if (visiting.has(id)) return id;
    visiting.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (def) {
      for (const pre of def.requiresNodes) {
        const cycle = dfs(pre);
        if (cycle) return cycle;
      }
    }
    visiting.delete(id);
    done.add(id);
    return null;
  };

  for (const id of Object.keys(RESEARCH_NODE_BY_ID)) {
    const c = dfs(id);
    if (c) return `cycle at ${c}`;
  }
  return null;
}

// --- bundled from src/institution-upgrades.ts ---
export const INSTITUTION_UPGRADE_TIER_RANK: Record<InstitutionUpgradeTier, number> = {
  dormant: 0,
  affiliate: 1,
  partner: 2,
  strategic: 3,
  national_integration: 4,
};

export const INSTITUTION_UPGRADE_LABEL: Record<InstitutionUpgradeTier, string> = {
  dormant: 'Dormant',
  affiliate: 'Affiliate',
  partner: 'Research Partner',
  strategic: 'Strategic Alliance',
  national_integration: 'National Integration',
};

export interface InstitutionUpgradeThresholds {
  partnerStandingDelta: number;
  strategicMinBranchTier: 3 | 4;
  nationalStanding: number;
}

export const DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS: InstitutionUpgradeThresholds = {
  partnerStandingDelta: 12,
  strategicMinBranchTier: 3,
  nationalStanding: 72,
};


function standing(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
}

function hasPreferredProject(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): boolean {
  return inputs.projects.some(
    p =>
      AGENT03_ACTIVE_PROJECT.test(p.status) &&
      inst.preferredProjectTypes.includes(p.projectType as (typeof inst.preferredProjectTypes)[number])
  );
}

function preferredContractCount(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.completedContracts.filter(c =>
    inst.preferredContractTypes.includes(c.contractType as (typeof inst.preferredContractTypes)[number])
  ).length;
}

function maxUnlockedTierOnBranches(
  unlocked: UnlockedResearchNode[],
  branches: ResearchBranchId[]
): number {
  let max = 0;
  for (const u of unlocked) {
    if (!branches.includes(u.branchId)) continue;
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    if (tier > max) max = tier;
  }
  return max;
}

export function evaluateInstitutionUpgrade(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  inst: ResearchInstitutionDefinition,
  thresholds: InstitutionUpgradeThresholds = DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS
): InstitutionUpgradeState {
  const st = standing(inputs, inst);
  const reasons: string[] = [];

  if (st < inst.minStanding) {
    return {
      institutionId: inst.id,
      tier: 'dormant',
      readinessMultiplier: 0,
      diffusionMultiplier: 0,
      assessedTurn: inputs.turn,
      reasons: ['standing below minimum'],
    };
  }

  let tier: InstitutionUpgradeTier = 'affiliate';
  reasons.push('affiliate standing');

  const partnerFloor = inst.minStanding + thresholds.partnerStandingDelta;
  const partnerEvidence =
    st >= partnerFloor && (hasPreferredProject(inputs, inst) || preferredContractCount(inputs, inst) >= 1);
  if (partnerEvidence) {
    tier = 'partner';
    reasons.push('partner project or contract evidence');
  }

  const branchTier = maxUnlockedTierOnBranches(unlocked, inst.supportedBranches);
  if (tier === 'partner' && branchTier >= thresholds.strategicMinBranchTier) {
    tier = 'strategic';
    reasons.push(`tier-${branchTier} branch unlock on supported path`);
  }

  if (
    tier === 'strategic' &&
    (branchTier >= 4 || st >= thresholds.nationalStanding)
  ) {
    tier = 'national_integration';
    reasons.push(branchTier >= 4 ? 'tier-4 branch integration' : 'exceptional standing');
  }

  const rank = INSTITUTION_UPGRADE_TIER_RANK[tier];
  return {
    institutionId: inst.id,
    tier,
    readinessMultiplier: rank === 0 ? 0 : 1 + rank * 0.1,
    diffusionMultiplier: rank === 0 ? 0 : 1 + rank * 0.14,
    assessedTurn: inputs.turn,
    reasons,
  };
}

export function computeInstitutionUpgrades(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): InstitutionUpgradeState[] {
  return RESEARCH_INSTITUTIONS.map(inst => evaluateInstitutionUpgrade(inputs, unlocked, inst)).sort((a, b) =>
    a.institutionId.localeCompare(b.institutionId)
  );
}

export function institutionUpgradesById(
  upgrades: InstitutionUpgradeState[]
): Record<string, InstitutionUpgradeState> {
  return Object.fromEntries(upgrades.map(u => [u.institutionId, u]));
}

// --- bundled from src/late-game-diffusion.ts ---
/** Late-game cascade: max graph hops from integrated anchor regions. */
export const LATE_GAME_CASCADE_MAX_HOPS = 3;
export const LATE_GAME_CASCADE_DECAY = 0.52;
export const LATE_GAME_INTEGRATED_THRESHOLD = 0.68;


function undirectedNeighbors(regionId: string): string[] {
  const out = new Set<string>(INSTITUTION_DIFFUSION_NEIGHBORS[regionId] || []);
  for (const [home, list] of Object.entries(INSTITUTION_DIFFUSION_NEIGHBORS)) {
    if (list.includes(regionId)) out.add(home);
  }
  return [...out];
}

function countTier4Unlocks(unlocked: UnlockedResearchNode[]): number {
  return unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 4).length;
}

function countNationalInstitutions(upgrades: InstitutionUpgradeState[]): number {
  return upgrades.filter(u => u.tier === 'national_integration').length;
}

/**
 * After base diffusion, propagate surplus from integrated regions along neighbor graph.
 * Activates when at least one tier-4 branch node is unlocked OR an institution hits national integration.
 */
export function applyLateGameDiffusionCascade(
  base: RegionalDiffusionCell[],
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[]
): { cells: RegionalDiffusionCell[]; report: LateGameDiffusionReport } {
  const tier4 = countTier4Unlocks(unlocked);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const nationalInst = countNationalInstitutions(institutionUpgrades);
  const trigger =
    tier4 > 0 && nationalInst > 0
      ? 'both'
      : tier4 > 0 || tier5 > 0
        ? 'tier4_unlock'
        : nationalInst > 0
          ? 'national_institution'
          : 'none';
  const active = trigger !== 'none';

  const scores: Record<string, number> = Object.fromEntries(base.map(c => [c.regionId, c.score]));
  const cascadeBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const pulses: LateGameDiffusionPulse[] = [];

  if (active) {
    const sources = base.filter(c => c.score >= LATE_GAME_INTEGRATED_THRESHOLD || c.level === 'integrated');
    const visitedDepth = new Map<string, number>();

    for (const src of sources) {
      const queue: Array<{ id: string; hops: number; strength: number }> = [
        { id: src.regionId, hops: 0, strength: src.score },
      ];
      visitedDepth.set(`${src.regionId}:0`, 0);

      while (queue.length) {
        const cur = queue.shift()!;
        if (cur.hops >= LATE_GAME_CASCADE_MAX_HOPS) continue;

        for (const nxt of undirectedNeighbors(cur.id)) {
          const nextHop = cur.hops + 1;
          const key = `${nxt}:${nextHop}`;
          if (visitedDepth.has(key)) continue;
          visitedDepth.set(key, nextHop);

          const strength = cur.strength * LATE_GAME_CASCADE_DECAY * (1 + nationalInst * 0.04);
          if (strength < 0.015) continue;

          cascadeBoost[nxt] = (cascadeBoost[nxt] ?? 0) + strength;
          pulses.push({
            fromRegionId: src.regionId as V94AustralianRegionCode,
            toRegionId: nxt as V94AustralianRegionCode,
            hops: nextHop,
            strength: Math.round(strength * 1000) / 1000,
          });

          queue.push({ id: nxt, hops: nextHop, strength });
        }
      }
    }
  }

  const cap = 0.85;
  const cells = base.map(cell => {
    const add = cascadeBoost[cell.regionId] ?? 0;
    const score = Math.min(cap, Math.round((cell.score + add) * 1000) / 1000);
    return {
      ...cell,
      score,
      cascadeBoost: Math.round(add * 1000) / 1000,
      level:
        score >= 0.68 ? 'integrated' : score >= 0.42 ? 'adopting' : score >= 0.18 ? 'aware' : 'latent',
      sourceNodeIds: add > 0 ? [...cell.sourceNodeIds, 'late_game_cascade'] : cell.sourceNodeIds,
    };
  });

  const nationalPenetration =
    cells.reduce((s, c) => s + c.score, 0) / Math.max(1, cells.length);

  return {
    cells,
    report: {
      active,
      trigger,
      tier4UnlockCount: tier4,
      nationalInstitutionCount: nationalInst,
      pulses: pulses.slice(0, 48),
      nationalPenetration: Math.round(nationalPenetration * 1000) / 1000,
    },
  };
}

export function topInstitutionUpgradeTier(upgrades: InstitutionUpgradeState[]): InstitutionUpgradeState | null {
  const sorted = upgrades
    .slice()
    .sort(
      (a, b) =>
        INSTITUTION_UPGRADE_TIER_RANK[b.tier] - INSTITUTION_UPGRADE_TIER_RANK[a.tier] ||
        b.readinessMultiplier - a.readinessMultiplier
    );
  return sorted[0]?.tier === 'dormant' ? null : sorted[0];
}

// --- bundled from src/diffusion.ts ---
/** Aligned with V10.5 V105_THRESHOLDS.diffusionCap (0.85) — branch overlay uses same cap. */
export const DIFFUSION_CAP = 0.85;

const LEVEL_THRESHOLDS = {
  latent: 0,
  aware: 0.18,
  adopting: 0.42,
  integrated: 0.68,
} as const;

function diffusionLevel(score: number): RegionalDiffusionCell['level'] {
  if (score >= LEVEL_THRESHOLDS.integrated) return 'integrated';
  if (score >= LEVEL_THRESHOLDS.adopting) return 'adopting';
  if (score >= LEVEL_THRESHOLDS.aware) return 'aware';
  return 'latent';
}

function institutionDiffusionBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  upgrades: Record<string, InstitutionUpgradeState>
): number {
  let boost = 0;
  for (const inst of RESEARCH_INSTITUTIONS) {
    const upgrade = upgrades[inst.id];
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding];
    if (standing == null || standing < inst.minStanding) continue;
    const mult = upgrade?.diffusionMultiplier ?? 1;
    const inHome = inst.homeRegions.includes(regionId);
    const neighborOfHome = inst.homeRegions.some(h =>
      (INSTITUTION_DIFFUSION_NEIGHBORS[h] || []).includes(regionId)
    );
    if (inHome) boost += inst.readinessBonus * 0.008 * mult;
    else if (neighborOfHome) boost += inst.readinessBonus * 0.004 * mult;
  }
  return boost;
}

function sectorAlignmentBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  branchId: string
): number {
  const branch = RESEARCH_BRANCH_BY_ID[branchId as keyof typeof RESEARCH_BRANCH_BY_ID];
  if (!branch) return 0;
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  let sum = 0;
  for (const sec of branch.sectors) {
    sum += Number(region.sectors[sec] ?? 0);
  }
  return Math.min(0.12, sum / 400);
}

/**
 * Spread research influence from unlocked nodes into regional diffusion grid.
 */
export function computeRegionalDiffusion(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[] = []
): RegionalDiffusionCell[] {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const scores: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const institutionBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const sources: Record<string, Set<string>> = Object.fromEntries(
    V94_REGION_CODES.map(c => [c, new Set<string>()])
  );

  for (const u of unlocked) {
    const node = RESEARCH_NODE_BY_ID[u.nodeId];
    if (!node) continue;
    const seed = node.diffusionSeed;
    const branch = RESEARCH_BRANCH_BY_ID[node.branchId];
    const anchors = branch?.anchorRegions ?? [];

    for (const code of V94_REGION_CODES) {
      let add = seed * 0.35;
      if (u.anchorRegionId === code) add += seed * 0.45;
      else if (anchors.includes(code)) add += seed * 0.25;
      add += sectorAlignmentBoost(inputs, code, node.branchId);
      const instAdd = institutionDiffusionBoost(inputs, code, upgrades);
      add += instAdd;
      institutionBoost[code] = (institutionBoost[code] ?? 0) + instAdd;
      if (add > 0) {
        scores[code] = Math.min(DIFFUSION_CAP, (scores[code] ?? 0) + add);
        sources[code]?.add(u.nodeId);
      }
    }
  }

  return V94_REGION_CODES.map(regionId => ({
    regionId,
    score: Math.round((scores[regionId] ?? 0) * 1000) / 1000,
    level: diffusionLevel(scores[regionId] ?? 0),
    sourceNodeIds: [...(sources[regionId] ?? [])],
    institutionBoost: Math.round((institutionBoost[regionId] ?? 0) * 1000) / 1000,
    cascadeBoost: 0,
  }));
}

export function pickLeadingResearchRegion(cells: RegionalDiffusionCell[]): V94AustralianRegionCode | null {
  const sorted = cells.slice().sort((a, b) => b.score - a.score);
  return sorted[0]?.score > 0 ? sorted[0].regionId : null;
}

// --- bundled from src/strategy-hooks.ts ---
export const STRATEGY_HOOKS: StrategyHookDefinition[] = [
  {
    id: 'hook_df_campus_online',
    title: 'Research campus online',
    phase: 'mid',
    description: 'Prioritize ACT research campus upgrades and Research Funds contracts.',
    targets: {
      projectTypes: ['research_campus', 'tech_innovation_park'],
      contractTypes: ['ai_research_center'],
      factions: ['csiro_ai_directorate'],
    },
    branchIds: ['digital_frontier'],
  },
  {
    id: 'hook_df_digital_backbone',
    title: 'Digital backbone push',
    phase: 'mid',
    description: 'Invest in subsea cable hubs and continental digital backbone eligibility.',
    targets: {
      megaprojects: ['continental_digital_backbone'],
      projectTypes: ['subsea_cable_hub', 'data_center'],
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'emerging' }],
    },
    branchIds: ['digital_frontier'],
  },
  {
    id: 'hook_df_ai_compute_operational',
    title: 'AI compute operational',
    phase: 'late',
    description: 'Balance energy reliability with data-centre expansion — routes through V10.5 modifier hooks only.',
    targets: {
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'operational' }],
      megaprojects: ['australian_ai_compute_network'],
      projectTypes: ['data_center', 'research_campus'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_digital_sovereignty',
    title: 'Digital sovereignty (endgame)',
    phase: 'endgame',
    description: 'Complete continental backbone and nationally integrated compute — late-game strategy panel anchor.',
    targets: {
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'nationally_integrated' }],
      megaprojects: ['continental_digital_backbone', 'australian_ai_compute_network'],
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_ri_remote_ops',
    title: 'Remote operations',
    phase: 'mid',
    description: 'Remote logistics bases in WA/NT mining frontiers.',
    targets: { projectTypes: ['remote_logistics_base', 'freight_rail_upgrade'] },
    branchIds: ['resource_innovation'],
  },
  {
    id: 'hook_ri_automation_path',
    title: 'Automation path',
    phase: 'mid',
    description: 'Mining tech contracts and technology sector momentum in Pilbara-scale regions.',
    targets: {
      contractTypes: ['mining_tech_initiative'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'emerging' }],
    },
    branchIds: ['resource_innovation'],
  },
  {
    id: 'hook_ri_export_corridor',
    title: 'Export corridor',
    phase: 'late',
    description: 'Align automated mining with northern export corridor megaproject stages.',
    targets: {
      megaprojects: ['northern_export_corridor'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'operational' }, { id: 'advanced_logistics', aimMaturity: 'demonstrated' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_resource_export',
    title: 'Resource export endgame',
    phase: 'endgame',
    description: 'Scaled logistics + northern corridor completion — ties to national development directions.',
    targets: {
      megaprojects: ['northern_export_corridor', 'national_freight_modernization'],
      capabilities: [{ id: 'advanced_logistics', aimMaturity: 'scaled' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_it_manufacturing_modernization',
    title: 'Manufacturing modernization',
    phase: 'mid',
    description: 'Tech parks and manufacturing_modernization contracts in Victoria.',
    targets: {
      projectTypes: ['tech_innovation_park'],
      contractTypes: ['manufacturing_modernization'],
      factions: ['vic_technology_council'],
    },
    branchIds: ['industrial_transformation'],
  },
  {
    id: 'hook_it_supply_chain_depth',
    title: 'Supply chain depth',
    phase: 'mid',
    description: 'Advanced manufacturing precincts with energy and freight inputs.',
    targets: { projectTypes: ['advanced_manufacturing', 'inland_rail_hub'] },
    branchIds: ['industrial_transformation'],
  },
  {
    id: 'hook_it_advanced_mfg_operational',
    title: 'Advanced manufacturing operational',
    phase: 'late',
    description: 'Research commercialization demonstrated — link campuses to precincts.',
    targets: {
      capabilities: [
        { id: 'research_commercialization', aimMaturity: 'demonstrated' },
        { id: 'advanced_manufacturing', aimMaturity: 'operational' },
      ],
      projectTypes: ['research_campus', 'advanced_manufacturing'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_industrial_sovereignty',
    title: 'Industrial sovereignty',
    phase: 'endgame',
    description: 'Nationally integrated manufacturing with Victoria Technology Council backing.',
    targets: {
      capabilities: [{ id: 'advanced_manufacturing', aimMaturity: 'nationally_integrated' }],
      factions: ['vic_technology_council'],
      megaprojects: ['eastern_energy_supergrid'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_et_supergrid_eligibility',
    title: 'Supergrid eligibility',
    phase: 'mid',
    description: 'Renewable grids in SA/QLD — prerequisite for eastern energy supergrid.',
    targets: { projectTypes: ['renewable_grid', 'hydro_expansion'], megaprojects: ['eastern_energy_supergrid'] },
    branchIds: ['energy_transition'],
  },
  {
    id: 'hook_et_energy_supergrid',
    title: 'Energy supergrid',
    phase: 'late',
    description: 'Grid-scale storage emerging — energy network condition gates remain in V10.5.',
    targets: {
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'emerging' }],
      megaprojects: ['eastern_energy_supergrid'],
    },
    branchIds: ['energy_transition'],
  },
  {
    id: 'hook_et_hydrogen_corridor',
    title: 'Hydrogen corridor',
    phase: 'late',
    description: 'Green hydrogen terminal + export network program.',
    targets: {
      projectTypes: ['green_hydrogen_terminal'],
      megaprojects: ['green_hydrogen_export_network'],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_renewable_dominance',
    title: 'Renewable dominance',
    phase: 'endgame',
    description: 'Scaled storage after supergrid completion — invites manufacturing energy demand tradeoff.',
    targets: {
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'scaled' }],
      megaprojects: ['eastern_energy_supergrid', 'green_hydrogen_export_network'],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_aw_national_water_program',
    title: 'National water program',
    phase: 'mid',
    description: 'Desalination/pipeline assets feeding national_water_security program.',
    targets: {
      projectTypes: ['desalination_plant', 'water_pipeline'],
      megaprojects: ['national_water_security'],
      contractTypes: ['water_security'],
    },
    branchIds: ['agri_water_systems'],
  },
  {
    id: 'hook_aw_farm_technology',
    title: 'Farm technology',
    phase: 'mid',
    description: 'Precision agriculture emerging — digital connectivity in farm regions required.',
    targets: { capabilities: [{ id: 'precision_agriculture', aimMaturity: 'emerging' }] },
    branchIds: ['agri_water_systems'],
  },
  {
    id: 'hook_aw_drought_resilience',
    title: 'Drought resilience',
    phase: 'late',
    description: 'Advanced water operational — crisis mitigation support, not immunity.',
    targets: { capabilities: [{ id: 'advanced_water_systems', aimMaturity: 'operational' }] },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_ag_export',
    title: 'Agricultural export endgame',
    phase: 'endgame',
    description: 'National water security + scaled precision agriculture.',
    targets: {
      megaprojects: ['national_water_security'],
      capabilities: [{ id: 'precision_agriculture', aimMaturity: 'scaled' }],
    },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_sr_ai_research_contracts',
    title: 'AI research contracts',
    phase: 'mid',
    description: 'Raise CSIRO standing and bid ai_research_center contracts.',
    targets: { contractTypes: ['ai_research_center'], factions: ['csiro_ai_directorate'] },
    branchIds: ['sovereign_research'],
  },
  {
    id: 'hook_sr_compute_network',
    title: 'Compute network',
    phase: 'late',
    description: 'Australian AI compute network megaproject stages after research center delivery.',
    targets: { megaprojects: ['australian_ai_compute_network'], projectTypes: ['data_center', 'research_campus'] },
    branchIds: ['sovereign_research'],
  },
  {
    id: 'hook_sr_commercialization_wave',
    title: 'Commercialization wave',
    phase: 'late',
    description: 'Bridge sovereign research into manufacturing and technology sectors.',
    targets: {
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'operational' }],
      projectTypes: ['research_campus', 'tech_innovation_park'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_sovereign_research',
    title: 'Sovereign research endgame',
    phase: 'endgame',
    description: 'Nationally integrated research commercialization with federal infrastructure alignment.',
    targets: {
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'nationally_integrated' }],
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
      megaprojects: ['australian_ai_compute_network', 'national_high_speed_rail'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_scale_df_research_mesh',
    title: 'Continental research mesh',
    phase: 'endgame',
    description: 'Scale wave capstone: mesh sovereign research with completed digital backbone.',
    targets: {
      megaprojects: ['continental_digital_backbone', 'australian_ai_compute_network'],
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'nationally_integrated' }],
      factions: ['csiro_ai_directorate'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_ri_autonomous_mesh',
    title: 'Autonomous export mesh',
    phase: 'endgame',
    description: 'Scale wave: nationally integrated automated mining + freight modernization.',
    targets: {
      megaprojects: ['northern_export_corridor', 'national_freight_modernization'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_it_value_chain',
    title: 'National value chain',
    phase: 'endgame',
    description: 'Scale wave: HSR-linked manufacturing fed by continental compute.',
    targets: {
      megaprojects: ['national_high_speed_rail'],
      capabilities: [{ id: 'advanced_manufacturing', aimMaturity: 'nationally_integrated' }],
      projectTypes: ['advanced_manufacturing', 'data_center'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_et_hydrogen_dominance',
    title: 'Hydrogen export dominance',
    phase: 'endgame',
    description: 'Scale wave: hydrogen export network + cross-sector load from agri-water digitization.',
    targets: {
      megaprojects: ['green_hydrogen_export_network', 'eastern_energy_supergrid'],
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_aw_national_resilience',
    title: 'National ag–water resilience',
    phase: 'endgame',
    description: 'Scale wave: completed water security with supergrid-backed desal energy.',
    targets: {
      megaprojects: ['national_water_security'],
      capabilities: [{ id: 'precision_agriculture', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_sr_public_private',
    title: 'Public–private research compact',
    phase: 'endgame',
    description: 'Scale wave: CSIRO national integration with dual tier-4 industrial/digital branches.',
    targets: {
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'nationally_integrated' }],
      megaprojects: ['australian_ai_compute_network'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 5,
  },
];

export const STRATEGY_HOOK_BY_ID = Object.fromEntries(STRATEGY_HOOKS.map(h => [h.id, h]));

export function resolveActiveStrategyHooks(unlockedNodeIds: Set<string>): StrategyHookDefinition[] {
  const maxTierByBranch: Record<string, number> = {};
  for (const id of unlockedNodeIds) {
    const node = RESEARCH_NODE_BY_ID[id];
    if (!node) continue;
    maxTierByBranch[node.branchId] = Math.max(maxTierByBranch[node.branchId] ?? 0, node.tier);
  }

  const active = new Set<string>();
  for (const id of unlockedNodeIds) {
    RESEARCH_NODE_BY_ID[id]?.hookIds.forEach(h => active.add(h));
  }

  return STRATEGY_HOOKS.filter(h => {
    if (!active.has(h.id)) return false;
    if (!h.minUnlockedTier) return true;
    return h.branchIds.some(b => (maxTierByBranch[b] ?? 0) >= h.minUnlockedTier!);
  });
}

// --- bundled from src/scale-wave.ts ---
/** Pairs of branches that exchange technology transfer when both reach tier 3+. */
export const TECHNOLOGY_TRANSFER_PAIRS: Array<[ResearchBranchId, ResearchBranchId]> = [
  ['digital_frontier', 'industrial_transformation'],
  ['digital_frontier', 'sovereign_research'],
  ['resource_innovation', 'industrial_transformation'],
  ['energy_transition', 'agri_water_systems'],
  ['sovereign_research', 'industrial_transformation'],
  ['energy_transition', 'digital_frontier'],
];

function maxTierByBranch(unlocked: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const tiers = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of unlocked) {
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    tiers[u.branchId] = Math.max(tiers[u.branchId], tier);
  }
  return tiers;
}

export function computeTechnologyTransferLinks(
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['technologyTransferLinks'] {
  const tiers = maxTierByBranch(unlocked);
  const links: ResearchScaleWaveReport['technologyTransferLinks'] = [];
  for (const [a, b] of TECHNOLOGY_TRANSFER_PAIRS) {
    const ta = tiers[a];
    const tb = tiers[b];
    if (ta >= 3 && tb >= 3) {
      const strength = Math.round(((ta + tb) / 10) * 100) / 100;
      links.push({ fromBranch: a, toBranch: b, strength });
    }
  }
  return links.sort((x, y) => y.strength - x.strength);
}

export function computeCrossBranchSynergyScore(unlocked: UnlockedResearchNode[]): number {
  const tiers = maxTierByBranch(unlocked);
  const values = Object.values(tiers).filter(t => t >= 3);
  if (values.length < 2) return 0;
  const avg = values.reduce((s, t) => s + t, 0) / values.length;
  const spread = Math.max(...values) - Math.min(...values);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  return Math.round(Math.min(100, avg * 12 + values.length * 4 + tier5 * 6 - spread * 2));
}

export function pickDominantCapabilityCluster(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['dominantCapabilityCluster'] {
  const tiers = maxTierByBranch(unlocked);
  let bestBranch: ResearchBranchId | null = null;
  let best = 0;
  for (const b of RESEARCH_BRANCHES) {
    const score = tiers[b.id] * 10 + (inputs.capabilities[b.primaryCapability] ? 15 : 0);
    if (score > best) {
      best = score;
      bestBranch = b.id;
    }
  }
  if (!bestBranch) return null;
  return RESEARCH_BRANCHES.find(b => b.id === bestBranch)?.primaryCapability ?? null;
}

export function computeResearchScaleWaveReport(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport {
  const tier5UnlockCount = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const crossBranchSynergyScore = computeCrossBranchSynergyScore(unlocked);
  const technologyTransferLinks = computeTechnologyTransferLinks(unlocked);
  return {
    active: tier5UnlockCount > 0 || crossBranchSynergyScore >= 40,
    tier5UnlockCount,
    crossBranchSynergyScore,
    technologyTransferLinks,
    dominantCapabilityCluster: pickDominantCapabilityCluster(inputs, unlocked),
  };
}

/** Applies bounded readiness uplift from synergy + transfer (does not bypass V10.5 caps). */
export function applyScaleWaveReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchScaleWaveReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const bonus = Math.min(8, Math.floor(report.crossBranchSynergyScore / 12));
  const out = { ...readinessByBranch };
  for (const link of report.technologyTransferLinks) {
    out[link.fromBranch] = Math.min(100, (out[link.fromBranch] ?? 0) + Math.round(link.strength * 2));
    out[link.toBranch] = Math.min(100, (out[link.toBranch] ?? 0) + Math.round(link.strength * 2));
  }
  for (const b of RESEARCH_BRANCHES) {
    out[b.id] = Math.min(100, (out[b.id] ?? 0) + bonus);
  }
  return out;
}

/** Extra diffusion micro-boost when scale wave is active (still capped downstream). */
export function scaleWaveDiffusionBonus(report: ResearchScaleWaveReport | null): number {
  if (!report?.active) return 0;
  return Math.min(0.06, report.tier5UnlockCount * 0.008 + report.technologyTransferLinks.length * 0.003);
}

// --- bundled from src/save-migration.ts ---
export function defaultBranchEmphasis(): ResearchBranchEmphasisState[] {
  return RESEARCH_BRANCHES.map(b => ({
    branchId: b.id,
    emphasis: (
      {
        sovereign_research: 'sovereign',
        industrial_transformation: 'commercial',
        digital_frontier: 'applied',
      } as Partial<Record<ResearchBranchId, ResearchProgramEmphasis>>
    )[b.id] ?? 'fundamental',
    setTurn: 0,
  }));
}

/** Fields written to disk; derived analytics recomputed on load/turn. */
export interface ResearchProgressPersistedCore {
  schemaVersion: typeof RESEARCH_PROGRESS_SCHEMA_VERSION;
  revision: number;
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  institutionUpgrades: InstitutionUpgradeState[];
  leadingResearchRegion: ResearchProgressState['leadingResearchRegion'];
  unlockSeq: number;
  branchEmphasis: ResearchBranchEmphasisState[];
  /** Stable hash of persistable payload (excludes fingerprint field). */
  coreFingerprint: string;
  /** Increment when player/system changes branch emphasis on save core. */
  emphasisRevision: number;
  /** Audit trail of schema hops applied to this blob. */
  migrationLog: ResearchSaveMigrationEntry[];
}


const LEGACY_V1 = 'op10m-agent03-v1' as const;
const LEGACY_V2 = 'op10m-agent03-v2' as const;

/** Keys that must never appear on persisted save blobs (Agent 25 guard). */
export const RESEARCH_SAVE_DERIVED_KEYS = [
  'diffusion',
  'readinessByBranch',
  'activeHookIds',
  'inputHash',
  'lateGameDiffusion',
  'scaleWave',
] as const;

function finalizeCoreForPersist(
  partial: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> & { coreFingerprint?: string }
): ResearchProgressPersistedCore {
  const draft: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: partial.revision,
    turn: partial.turn,
    unlockedNodes: partial.unlockedNodes,
    institutionUpgrades: partial.institutionUpgrades,
    leadingResearchRegion: partial.leadingResearchRegion,
    unlockSeq: partial.unlockSeq,
    branchEmphasis: partial.branchEmphasis,
    emphasisRevision: partial.emphasisRevision ?? 0,
    migrationLog: partial.migrationLog ?? [],
  };
  return { ...draft, coreFingerprint: computePersistedCoreFingerprint(draft) };
}

export function computePersistedCoreFingerprint(
  core: Omit<ResearchProgressPersistedCore, 'coreFingerprint'>
): string {
  let h = 2166136261 >>> 0;
  const payload = JSON.stringify({
    schemaVersion: core.schemaVersion,
    revision: core.revision,
    turn: core.turn,
    unlockSeq: core.unlockSeq,
    emphasisRevision: core.emphasisRevision,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    branchEmphasis: core.branchEmphasis,
    migrationLog: core.migrationLog,
  });
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function upgradeToCurrentCore(
  base: Omit<ResearchProgressPersistedCore, 'coreFingerprint' | 'emphasisRevision' | 'migrationLog'> & {
    emphasisRevision?: number;
    migrationLog?: ResearchSaveMigrationEntry[];
  },
  fromVersion: ResearchSaveMigrationEntry['fromVersion']
): ResearchProgressPersistedCore {
  const migrationLog: ResearchSaveMigrationEntry[] = [
    ...(base.migrationLog ?? []),
    { fromVersion, toVersion: RESEARCH_PROGRESS_SCHEMA_VERSION, turn: base.turn },
  ];
  return finalizeCoreForPersist({
    ...base,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    emphasisRevision: base.emphasisRevision ?? 0,
    migrationLog,
  });
}

export function emptyResearchProgressCore(turn = 0): ResearchProgressPersistedCore {
  return emptyCore(turn);
}

function emptyCore(turn = 0): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    institutionUpgrades: [],
    leadingResearchRegion: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
  });
}

function sanitizeUnlockedNodes(raw: unknown): UnlockedResearchNode[] {
  if (!Array.isArray(raw)) return [];
  const out: UnlockedResearchNode[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as UnlockedResearchNode;
    if (typeof o.nodeId !== 'string' || !RESEARCH_NODE_BY_ID[o.nodeId]) continue;
    const def = RESEARCH_NODE_BY_ID[o.nodeId];
    out.push({
      nodeId: o.nodeId,
      branchId: def.branchId,
      unlockedTurn: Number(o.unlockedTurn) || 0,
      anchorRegionId: o.anchorRegionId ?? null,
    });
  }
  return out.sort((a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId));
}

function sanitizeInstitutionUpgrades(raw: unknown): InstitutionUpgradeState[] {
  if (!Array.isArray(raw)) return [];
  const tiers = new Set<InstitutionUpgradeTier>([
    'dormant',
    'affiliate',
    'partner',
    'strategic',
    'national_integration',
  ]);
  return raw
    .filter(x => x && typeof x === 'object' && typeof (x as InstitutionUpgradeState).institutionId === 'string')
    .map(x => {
      const o = x as InstitutionUpgradeState;
      const tier = tiers.has(o.tier) ? o.tier : 'dormant';
      return {
        institutionId: String(o.institutionId),
        tier,
        readinessMultiplier: Number(o.readinessMultiplier) || 0,
        diffusionMultiplier: Number(o.diffusionMultiplier) || 0,
        assessedTurn: Number(o.assessedTurn) || 0,
        reasons: Array.isArray(o.reasons) ? o.reasons.map(String) : [],
      };
    });
}

function sanitizeBranchEmphasis(raw: unknown): ResearchBranchEmphasisState[] {
  const defaults = defaultBranchEmphasis();
  if (!Array.isArray(raw)) return defaults;
  const byId = Object.fromEntries(defaults.map(d => [d.branchId, d]));
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchBranchEmphasisState;
    if (!byId[o.branchId]) continue;
    const emph = o.emphasis;
    if (emph === 'applied' || emph === 'fundamental' || emph === 'commercial' || emph === 'sovereign') {
      byId[o.branchId] = { branchId: o.branchId, emphasis: emph, setTurn: Number(o.setTurn) || 0 };
    }
  }
  return RESEARCH_BRANCHES.map(b => byId[b.id]);
}

function mergeMonotonicUpgrades(
  incoming: InstitutionUpgradeState[],
  previous: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = Object.fromEntries(previous.map(u => [u.institutionId, u]));
  return incoming.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

function computeUnlockSeq(nodes: UnlockedResearchNode[]): number {
  return nodes.length;
}

export function migrateResearchProgressSave(raw: unknown): ResearchProgressPersistedCore | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion as ResearchProgressSchemaVersion | undefined;

  if (ver === RESEARCH_PROGRESS_SCHEMA_VERSION) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const draft = finalizeCoreForPersist({
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      revision: Number(o.revision) || 0,
      turn: Number(o.turn) || 0,
      unlockedNodes: nodes,
      institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
      leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
      unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
      branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
      emphasisRevision: Number(o.emphasisRevision) || 0,
      migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
    });
    if (typeof o.coreFingerprint === 'string' && o.coreFingerprint !== draft.coreFingerprint) {
      return draft;
    }
    return draft;
  }

  if (ver === LEGACY_V2) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
      },
      LEGACY_V2
    );
  }

  if (ver === LEGACY_V1) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: 1,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: computeUnlockSeq(nodes),
        branchEmphasis: defaultBranchEmphasis(),
      },
      LEGACY_V1
    );
  }

  if (Array.isArray(raw)) {
    const nodes = sanitizeUnlockedNodes(raw);
    return upgradeToCurrentCore(
      { ...emptyCore(0), revision: 1, unlockedNodes: nodes, unlockSeq: computeUnlockSeq(nodes) },
      'array-legacy'
    );
  }

  return null;
}

export function extractPersistedCore(state: ResearchProgressState): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: state.revision ?? 0,
    turn: state.turn,
    unlockedNodes: state.unlockedNodes,
    institutionUpgrades: state.institutionUpgrades,
    leadingResearchRegion: state.leadingResearchRegion,
    unlockSeq: state.unlockSeq ?? computeUnlockSeq(state.unlockedNodes),
    branchEmphasis: state.branchEmphasis ?? defaultBranchEmphasis(),
    emphasisRevision: state.emphasisRevision ?? 0,
    migrationLog: state.migrationLog ?? [],
  });
}

export function prepareResearchProgressForSave(state: ResearchProgressState): ResearchProgressPersistedCore {
  return extractPersistedCore(state);
}

export function hydrateResearchProgressCore(core: ResearchProgressPersistedCore | null): ResearchProgressState | null {
  if (!core) return null;
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision,
    turn: core.turn,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockSeq: core.unlockSeq,
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent' as const,
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    inputHash: '',
    lateGameDiffusion: null,
    scaleWave: null,
  };
}

export function mergeComputedResearchState(
  core: ResearchProgressPersistedCore,
  computed: ResearchProgressState
): ResearchProgressState {
  const mergedUpgrades = mergeMonotonicUpgrades(computed.institutionUpgrades, core.institutionUpgrades);
  const unlockSet = new Map<string, UnlockedResearchNode>();
  core.unlockedNodes.forEach(u => unlockSet.set(u.nodeId, u));
  computed.unlockedNodes.forEach(u => {
    if (!unlockSet.has(u.nodeId)) unlockSet.set(u.nodeId, u);
  });
  const unlockedNodes = [...unlockSet.values()].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );
  const newUnlocks = unlockedNodes.length - core.unlockedNodes.length;
  return {
    ...computed,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision + (newUnlocks > 0 ? 1 : 0),
    turn: computed.turn,
    unlockedNodes,
    institutionUpgrades: mergedUpgrades,
    unlockSeq: Math.max(core.unlockSeq, unlockedNodes.length),
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
  };
}

export function detectForeignSaveFields(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
  const o = raw as Record<string, unknown>;
  return RESEARCH_SAVE_DERIVED_KEYS.filter(k => k in o);
}

export function validatePersistedCoreForWrite(core: ResearchProgressPersistedCore): string[] {
  const issues: string[] = [];
  if (core.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION) {
    issues.push(`schema must be ${RESEARCH_PROGRESS_SCHEMA_VERSION}`);
  }
  const { coreFingerprint, ...rest } = core;
  if (coreFingerprint !== computePersistedCoreFingerprint(rest)) {
    issues.push('coreFingerprint mismatch');
  }
  if ((core.unlockSeq ?? 0) < core.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  return issues;
}

export function setResearchBranchEmphasisOnCore(
  core: ResearchProgressPersistedCore,
  branchId: ResearchBranchId,
  emphasis: ResearchProgramEmphasis,
  turn: number
): ResearchProgressPersistedCore {
  const branchEmphasis = core.branchEmphasis.map(e =>
    e.branchId === branchId ? { ...e, emphasis, setTurn: turn } : e
  );
  return finalizeCoreForPersist({
    ...core,
    branchEmphasis,
    emphasisRevision: core.emphasisRevision + 1,
    turn: Math.max(core.turn, turn),
  });
}

export function sanitizeResearchProgressPersisted(raw: unknown): ResearchProgressState | null {
  const core = migrateResearchProgressSave(raw);
  return hydrateResearchProgressCore(core);
}

export function assertResearchProgressSaveIntegrity(state: ResearchProgressState): string[] {
  const issues: string[] = [];
  if (
    state.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION &&
    state.schemaVersion !== LEGACY_V1 &&
    state.schemaVersion !== LEGACY_V2
  ) {
    issues.push(`unexpected schema ${state.schemaVersion}`);
  }
  if ((state.unlockSeq ?? 0) < state.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  for (const id of state.unlockedNodes.map(u => u.nodeId)) {
    if (!RESEARCH_NODE_BY_ID[id]) issues.push(`unknown node ${id}`);
  }
  const readinessKeys = Object.keys(state.readinessByBranch ?? {});
  if (readinessKeys.length && readinessKeys.length !== RESEARCH_BRANCHES.length) {
    issues.push('readinessByBranch incomplete');
  }
  for (const cell of state.diffusion ?? []) {
    if (!V94_REGION_CODES.includes(cell.regionId)) issues.push(`bad region ${cell.regionId}`);
  }
  return issues;
}

export function applyBranchEmphasisReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  emphasis: ResearchBranchEmphasisState[]
): Record<ResearchBranchId, number> {
  const out = { ...readinessByBranch };
  for (const e of emphasis) {
    out[e.branchId] = Math.min(100, (out[e.branchId] ?? 0) + (e.emphasis === 'sovereign' ? 2 : 1));
  }
  return out;
}

// --- bundled from src/compute.ts ---
export function researchInputHash(inputs: ResearchProgressInputs): string {
  let h = 2166136261 >>> 0;
  const mix = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  };
  mix(`t${inputs.turn}`);
  inputs.regions.forEach(r => {
    mix(r.code);
    Object.keys(r.sectors)
      .sort()
      .forEach(k => mix(`${k}:${Math.round(Number(r.sectors[k as keyof typeof r.sectors] ?? 0) / 5)}`));
  });
  Object.keys(inputs.capabilities)
    .sort()
    .forEach(k => {
      const c = inputs.capabilities[k as keyof typeof inputs.capabilities];
      if (c) mix(`cap:${k}:${c.maturity}:${c.activeRegionIds.join(',')}`);
    });
  inputs.projects.forEach(p => mix(`${p.id}:${p.status}:${p.projectType}`));
  inputs.completedContracts.forEach(c => mix(`cc:${c.contractType}`));
  Object.keys(inputs.megaprojects)
    .sort()
    .forEach(k => {
      const m = inputs.megaprojects[k as keyof typeof inputs.megaprojects];
      if (m) mix(`mp:${k}:${m.completedStages}:${m.status}`);
    });
  Object.keys(inputs.factionStanding)
    .sort()
    .forEach(k => mix(`fs:${k}:${inputs.factionStanding[k as keyof typeof inputs.factionStanding]}`));
  return h.toString(36);
}

function computeBranchReadiness(
  inputs: ResearchProgressInputs,
  branchId: ResearchBranchId,
  institutionUpgrades: InstitutionUpgradeState[]
): number {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return 0;

  let score = 0;
  for (const anchor of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === anchor);
    if (!region) continue;
    for (const sec of branch.sectors) {
      score += Number(region.sectors[sec] ?? 0) * 0.15;
    }
  }

  const cap = inputs.capabilities[branch.primaryCapability];
  if (cap) {
    score += { unavailable: 0, emerging: 12, demonstrated: 22, operational: 32, scaled: 42, nationally_integrated: 52 }[
      cap.maturity
    ];
  }

  for (const inst of RESEARCH_INSTITUTIONS) {
    if (!inst.supportedBranches.includes(branchId)) continue;
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
    const upgrade = upgrades[inst.id];
    if (standing >= inst.minStanding) {
      score += inst.readinessBonus * (upgrade?.readinessMultiplier ?? 1);
    }
  }

  return Math.round(Math.min(100, score));
}

function inferAnchorRegion(inputs: ResearchProgressInputs, branchId: ResearchBranchId): string | null {
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return null;
  let best: { code: string; score: number } | null = null;
  for (const code of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === code);
    if (!region) continue;
    let s = 0;
    branch.sectors.forEach(sec => {
      s += Number(region.sectors[sec] ?? 0);
    });
    if (!best || s > best.score) best = { code, score: s };
  }
  return best?.code ?? branch.anchorRegions[0] ?? null;
}

export function createEmptyResearchProgressState(turn = 0): ResearchProgressState {
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent',
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    leadingResearchRegion: null,
    inputHash: '',
    institutionUpgrades: [],
    lateGameDiffusion: null,
    scaleWave: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
  };
}

export function computeResearchProgress(
  inputs: ResearchProgressInputs,
  previous: ResearchProgressState | null
): ResearchProgressState {
  const coreBase = previous ? extractPersistedCore(previous) : emptyResearchProgressCore(inputs.turn);
  const unlockedMap = new Map<string, UnlockedResearchNode>();
  (previous?.unlockedNodes ?? []).forEach(u => unlockedMap.set(u.nodeId, u));

  const unlockedIds = () => new Set(unlockedMap.keys());

  for (const branch of RESEARCH_BRANCHES) {
    const order = branchNodeTopologicalOrder(branch.id);
    for (const nodeId of order) {
      if (unlockedMap.has(nodeId)) continue;
      const evalResult = evaluateNodePrerequisites(inputs, nodeId, unlockedIds());
      if (!evalResult.satisfied) continue;
      const def = RESEARCH_NODE_BY_ID[nodeId];
      unlockedMap.set(nodeId, {
        nodeId,
        branchId: def.branchId,
        unlockedTurn: inputs.turn,
        anchorRegionId: inferAnchorRegion(inputs, def.branchId) as UnlockedResearchNode['anchorRegionId'],
      });
    }
  }

  const unlockedNodes = [...unlockedMap.values()].sort((a, b) =>
    a.unlockedTurn !== b.unlockedTurn ? a.unlockedTurn - b.unlockedTurn : a.nodeId.localeCompare(b.nodeId)
  );

  const institutionUpgrades = mergeMonotonicInstitutionUpgrades(
    computeInstitutionUpgrades(inputs, unlockedNodes),
    previous?.institutionUpgrades ?? []
  );

  const baseDiffusion = computeRegionalDiffusion(inputs, unlockedNodes, institutionUpgrades);
  const { cells: diffusionRaw, report: lateGameDiffusion } = applyLateGameDiffusionCascade(
    baseDiffusion,
    unlockedNodes,
    institutionUpgrades
  );

  const scaleWave = computeResearchScaleWaveReport(inputs, unlockedNodes);
  const swBonus = scaleWaveDiffusionBonus(scaleWave);
  const diffusion = diffusionRaw.map(cell => ({
    ...cell,
    score: Math.min(0.85, Math.round((cell.score + swBonus) * 1000) / 1000),
  }));

  const hooks = resolveActiveStrategyHooks(new Set(unlockedNodes.map(u => u.nodeId)));

  let readinessByBranch = Object.fromEntries(
    RESEARCH_BRANCHES.map(b => [b.id, computeBranchReadiness(inputs, b.id, institutionUpgrades)])
  ) as Record<ResearchBranchId, number>;
  readinessByBranch = applyScaleWaveReadinessBonus(readinessByBranch, scaleWave);
  readinessByBranch = applyBranchEmphasisReadinessBonus(readinessByBranch, coreBase.branchEmphasis);

  const computed: ResearchProgressState = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: coreBase.revision,
    turn: inputs.turn,
    unlockedNodes,
    diffusion,
    readinessByBranch,
    activeHookIds: hooks.map(h => h.id),
    leadingResearchRegion: pickLeadingResearchRegion(diffusion),
    inputHash: researchInputHash(inputs),
    institutionUpgrades,
    lateGameDiffusion,
    scaleWave,
    unlockSeq: coreBase.unlockSeq,
    branchEmphasis: coreBase.branchEmphasis,
  };

  return mergeComputedResearchState(coreBase, computed);
}

export function computeResearchProgressFromSave(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): ResearchProgressState {
  const hydrated = sanitizeResearchProgressPersisted(persistedRaw);
  return computeResearchProgress(inputs, hydrated);
}

export function applyResearchProgressSavePipeline(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): { state: ResearchProgressState; persist: ReturnType<typeof prepareResearchProgressForSave> } {
  const state = computeResearchProgressFromSave(inputs, persistedRaw);
  const persist = prepareResearchProgressForSave(state);
  return { state, persist };
}

function mergeMonotonicInstitutionUpgrades(
  next: InstitutionUpgradeState[],
  prev: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = institutionUpgradesById(prev);
  return next.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

/** Integration adapter: map V10.5 innovation snapshot fields into Agent 03 inputs (pure). */
export function buildResearchProgressInputs(src: {
  turn: number;
  regions: ResearchProgressInputs['regions'];
  innovationCapabilities?: ResearchProgressInputs['capabilities'];
  projects: ResearchProgressInputs['projects'];
  completedContracts: ResearchProgressInputs['completedContracts'];
  megaprojects: ResearchProgressInputs['megaprojects'];
  factionStanding: ResearchProgressInputs['factionStanding'];
}): ResearchProgressInputs {
  return {
    turn: src.turn,
    regions: src.regions,
    capabilities: src.innovationCapabilities ?? {},
    projects: src.projects,
    completedContracts: src.completedContracts,
    megaprojects: src.megaprojects,
    factionStanding: src.factionStanding,
  };
}

export function getStrategyHooksForState(state: ResearchProgressState) {
  return state.activeHookIds.map(id => STRATEGY_HOOK_BY_ID[id]).filter(Boolean);
}

export const AGENT03_CATALOG = {
  branches: RESEARCH_BRANCHES,
  nodes: RESEARCH_BRANCH_NODES,
  institutions: RESEARCH_INSTITUTIONS,
};


/** Agent 25 — smoke self-tests (subset of npm run test:agent-03). */
export function runAgent03ResearchTechSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent03_chunk_01', detectPrerequisiteCycle() === null, detectPrerequisiteCycle() ?? undefined);
  push('agent03_chunk_02', RESEARCH_BRANCH_NODES.length === 30, String(RESEARCH_BRANCH_NODES.length));
  push('agent03_chunk_03', STRATEGY_HOOKS.length === 30, String(STRATEGY_HOOKS.length));

  const inputs: ResearchProgressInputs = {
    turn: 10,
    regions: [{ code: 'ACT', sectors: { research: 40, technology: 35 } }],
    capabilities: {},
    projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    completedContracts: [],
    megaprojects: {},
    factionStanding: { csiro_ai_directorate: 45 },
  };
  const state = computeResearchProgress(inputs, createEmptyResearchProgressState());
  push('agent03_chunk_04', state.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'));
  push('agent03_chunk_05', (state.institutionUpgrades?.length ?? 0) >= 6, String(state.institutionUpgrades?.length));
  push('agent03_chunk_06', OP10M_AGENT03_MODULE_META.schemaVersion === 'op10m-agent03-v3');
  const saved = prepareResearchProgressForSave(state);
  push('agent03_chunk_07', validatePersistedCoreForWrite(saved).length === 0);

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export function runAgent03ResearchSaveFormatSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });
  const v2 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v2', turn: 1, revision: 0, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [] });
  push('savefmt_v2_to_v3', v2?.schemaVersion === 'op10m-agent03-v3');
  push('savefmt_foreign', detectForeignSaveFields({ diffusion: [] }).includes('diffusion'));
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT03_MODULE_META = {
  moduleId: 'agent-03-research-tech',
  schemaVersion: 'op10m-agent03-v3',
  saveFormatVersion: 3,
  touchesSaveFormat: true,
  proposedGameStateField: 'researchProgress',
  integrationDoc: 'operation-10m/agent-03-research-tech/INTEGRATION.md',
  slot: 'post-v10z',
} as const;
// OP10M_MODULE_END agent-03-research-tech
