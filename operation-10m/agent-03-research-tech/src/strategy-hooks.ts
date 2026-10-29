import { RESEARCH_NODE_BY_ID } from './branches.ts';
import type { StrategyHookDefinition } from './types.ts';

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
