import type { EvolvingPanelDefinition, ProgressionTier } from '../types/progression.js';

const modal = (
  id: string,
  label: string,
  tier: ProgressionTier,
  unlock: EvolvingPanelDefinition['unlock'],
  extra?: Partial<EvolvingPanelDefinition>
): EvolvingPanelDefinition => ({
  id,
  label,
  description: extra?.description ?? `${label} (modal surface).`,
  category: extra?.category ?? 'core',
  kind: 'modal',
  progressionTier: tier,
  unlock,
  essential: extra?.essential,
  railOrder: extra?.railOrder,
  tags: extra?.tags,
  legacyUiPatchKeys: extra?.legacyUiPatchKeys,
});

/** V9.4 GlobalUISurfaceManager modal ids with progression metadata (scale wave tranche). */
export const MODAL_PANELS: EvolvingPanelDefinition[] = [
  modal('modal_travel', 'Travel', 0, {}, { essential: true, legacyUiPatchKeys: ['showTravelModal'], category: 'core', railOrder: 11 }),
  modal('modal_market', 'Market', 1, { minDay: 1 }, { legacyUiPatchKeys: ['showMarket'], category: 'economy', railOrder: 51 }),
  modal('modal_resource_market', 'Resource Market', 1, { minDay: 2 }, { legacyUiPatchKeys: ['showResourceMarket'], category: 'economy' }),
  modal('modal_shop', 'Shop', 1, { minDay: 2 }, { legacyUiPatchKeys: ['showShop'], category: 'economy' }),
  modal('modal_workshop', 'Workshop', 1, { minDay: 1 }, { legacyUiPatchKeys: ['showWorkshop'], category: 'economy' }),
  modal('modal_challenges', 'Challenges', 0, {}, { legacyUiPatchKeys: ['showChallenges'], category: 'regional' }),
  modal('modal_regional_contracts', 'Regional Contracts', 2, { minDay: 3, minInterfaceLevel: 'guided' }, {
    legacyUiPatchKeys: ['showRegionalContractsModal'],
    category: 'regional',
  }),
  modal('modal_infrastructure_projects', 'Infrastructure Projects', 2, { minDay: 6 }, {
    legacyUiPatchKeys: ['showInfrastructureProjectsModal'],
    category: 'regional',
  }),
  modal('modal_expeditions_relics', 'Expeditions & Relics', 3, { minDay: 8, minInterfaceLevel: 'advanced' }, {
    legacyUiPatchKeys: ['showExpeditionsRelicsModal'],
    category: 'strategic',
  }),
  modal('modal_investments', 'Investments', 2, { minDay: 4, requiredConceptIds: ['capital_allocation'] }, {
    legacyUiPatchKeys: ['showInvestments'],
    category: 'strategic',
  }),
  modal('modal_ai_rivalry', 'AI Rivalry / Diplomacy', 3, { minDay: 10 }, {
    legacyUiPatchKeys: ['showAiRivalryModal'],
    category: 'social',
  }),
  modal('modal_sabotage', 'Sabotage', 3, { minDay: 12, minInterfaceLevel: 'advanced' }, {
    legacyUiPatchKeys: ['showSabotage'],
    category: 'strategic',
  }),
  modal('modal_ai_command_center', 'AI Command Center', 3, { minDay: 7, minInterfaceLevel: 'advanced' }, {
    category: 'automation',
    tags: ['ai', 'command'],
  }),
  modal('modal_crisis_management', 'Crisis Management', 2, { minDay: 5, requiredMilestoneIds: ['first_crisis'] }, {
    category: 'regional',
    essential: false,
  }),
  modal('modal_campaign_progression', 'Campaign Progression', 1, { minDay: 2 }, { category: 'core' }),
  modal('modal_career_progression', 'Career Progression', 2, { minDay: 8 }, { category: 'core' }),
  modal('modal_fog_of_war_intel', 'Fog of War Intel', 3, { minDay: 9, minInterfaceLevel: 'advanced' }, { category: 'strategic' }),
  modal('modal_what_if_timelines', 'What-If Timelines', 4, { minInterfaceLevel: 'expert' }, { category: 'diagnostics' }),
  modal('modal_scenario_builder', 'Scenario Builder', 4, { minInterfaceLevel: 'expert' }, { category: 'diagnostics' }),
  modal('modal_stats', 'Stats', 2, { minDay: 4 }, { category: 'core' }),
  modal('modal_save_load', 'Save / Load', 0, {}, { essential: true, category: 'core' }),
  modal('modal_guardian_warning', 'Guardian Critical Warning', 0, {}, {
    essential: true,
    category: 'automation',
    description: 'Never progression-gated; safety-critical surface.',
  }),
  modal('modal_major_transition_confirmation', 'Major Transition Confirmation', 1, { minDay: 3 }, { category: 'core' }),
  modal('modal_determinism_audit', 'Determinism Audit', 5, { minInterfaceLevel: 'expert' }, { category: 'diagnostics' }),
  modal('modal_save_migration', 'Save Migration', 0, {}, { essential: true, category: 'core' }),
  modal('modal_campaign_select', 'Campaign Select', 0, {}, { essential: true, category: 'core', kind: 'modal' }),
];

export const MODAL_PANEL_BY_SURFACE_ID: Record<string, EvolvingPanelDefinition> = {
  travel_modal: MODAL_PANELS[0],
  market_modal: MODAL_PANELS[1],
  resource_market_modal: MODAL_PANELS[2],
  shop_modal: MODAL_PANELS[3],
  workshop_modal: MODAL_PANELS[4],
  challenges_modal: MODAL_PANELS[5],
  regional_contracts_modal: MODAL_PANELS[6],
  infrastructure_projects_modal: MODAL_PANELS[7],
  expeditions_relics_modal: MODAL_PANELS[8],
  investments_modal: MODAL_PANELS[9],
  ai_rivalry_modal: MODAL_PANELS[10],
  sabotage_modal: MODAL_PANELS[11],
  ai_command_center_modal: MODAL_PANELS[12],
  crisis_management_modal: MODAL_PANELS[13],
  campaign_progression_modal: MODAL_PANELS[14],
  career_progression_modal: MODAL_PANELS[15],
  fog_of_war_intel_modal: MODAL_PANELS[16],
  what_if_timelines_modal: MODAL_PANELS[17],
  scenario_builder_modal: MODAL_PANELS[18],
  stats_modal: MODAL_PANELS[19],
  save_load_modal: MODAL_PANELS[20],
  guardian_warning_modal: MODAL_PANELS[21],
  major_transition_confirmation_modal: MODAL_PANELS[22],
  determinism_audit_modal: MODAL_PANELS[23],
  save_migration_modal: MODAL_PANELS[24],
  campaign_select_modal: MODAL_PANELS[25],
};

export function listModalPanelForSurface(surfaceId: string): EvolvingPanelDefinition | undefined {
  return MODAL_PANEL_BY_SURFACE_ID[surfaceId];
}
