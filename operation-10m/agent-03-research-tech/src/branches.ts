import type { ResearchBranchDefinition, ResearchBranchNodeDefinition } from './types.ts';

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
];

export const RESEARCH_NODE_BY_ID: Record<string, ResearchBranchNodeDefinition> = Object.fromEntries(
  RESEARCH_BRANCH_NODES.map(node => [node.id, node])
);

export const RESEARCH_BRANCH_BY_ID = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, b])) as Record<
  ResearchBranchDefinition['id'],
  ResearchBranchDefinition
>;
