// OP10M_MODULE_BEGIN agent-22-ui
// content-sha256-prefix: 8d95a1f7672389b5
// Operation 10M — Agent 22 Evolving UI & Accessibility
// Generated from operation-10m/agent-22-ui/src/ — regenerate: npm run build:agent22-chunk

// --- source: types/progression.ts ---
/** Player-facing interface complexity (mirrors V9.4 SettingsExperienceLevel). */
export type InterfaceExperienceLevel = 'simple' | 'guided' | 'advanced' | 'expert';

/** Progression tier for panel unlock ordering (0 = always-on core). */
export type ProgressionTier = 0 | 1 | 2 | 3 | 4 | 5;

export type PanelCategory =
  | 'core'
  | 'economy'
  | 'regional'
  | 'strategic'
  | 'automation'
  | 'diagnostics'
  | 'social';

export type PanelSurfaceKind = 'nav_target' | 'floating_widget' | 'settings_tab' | 'modal';

export interface ProgressionUnlockRule {
  /** Minimum game day (inclusive). */
  minDay?: number;
  /** Minimum completed turns. */
  minTurn?: number;
  /** Minimum interface level required if progression gating is active. */
  minInterfaceLevel?: InterfaceExperienceLevel;
  /** Guided-learning concept ids that must be at least `introduced`. */
  requiredConceptIds?: string[];
  /** Milestone ids from campaign/onboarding. */
  requiredMilestoneIds?: string[];
}

export interface EvolvingPanelDefinition {
  id: string;
  label: string;
  description: string;
  category: PanelCategory;
  kind: PanelSurfaceKind;
  progressionTier: ProgressionTier;
  unlock: ProgressionUnlockRule;
  /** Maps to V9.4 IntentNavTarget when kind is nav_target. */
  navTarget?: string;
  /** Maps to widget id for contextual hiding engine. */
  widgetId?: string;
  /** Legacy uiState patch keys this panel opens (for access preservation). */
  legacyUiPatchKeys?: string[];
  /** Never hide when true (emergency, map, settings). */
  essential?: boolean;
  /** Sort weight within tier (lower = earlier). */
  railOrder?: number;
  tags?: string[];
}

export interface ProgressionSignalSnapshot {
  gameDay: number;
  turnCount: number;
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: string;
  guidedConceptStatuses?: Record<string, 'locked' | 'introduced' | 'mastered'>;
  completedMilestoneIds?: string[];
  playerIntentOnboardingEnabled?: boolean;
}

export type PanelVisibilityState = 'visible' | 'preview' | 'hidden';

export interface PanelVisibilityResult {
  panelId: string;
  state: PanelVisibilityState;
  reason: string;
  progressionTier: ProgressionTier;
  satisfiesUnlock: boolean;
}

export interface EvolvingUiProgressionConfig {
  /** When true, only tier 0 + unlocked tiers show as visible; others preview/hidden. */
  enableProgressionGating: boolean;
  /** Show locked panels as ghost preview with "Unlocks on …" copy. */
  showPreviewForLocked: boolean;
  /** Expert / show-all bypasses tier gates for default chrome. */
  respectShowAllOverride: boolean;
}

export const DEFAULT_EVOLVING_UI_PROGRESSION_CONFIG: EvolvingUiProgressionConfig = {
  enableProgressionGating: true,
  showPreviewForLocked: true,
  respectShowAllOverride: true,
};

const LEVEL_RANK: Record<InterfaceExperienceLevel, number> = {
  simple: 0,
  guided: 1,
  advanced: 2,
  expert: 3,
};

export function interfaceLevelAtLeast(
  current: InterfaceExperienceLevel,
  required: InterfaceExperienceLevel | undefined
): boolean {
  if (!required) return true;
  return LEVEL_RANK[current] >= LEVEL_RANK[required];
}

export function evaluateUnlockRule(
  rule: ProgressionUnlockRule,
  signals: ProgressionSignalSnapshot
): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (rule.minDay != null && signals.gameDay < rule.minDay) {
    reasons.push(`day≥${rule.minDay}`);
  }
  if (rule.minTurn != null && signals.turnCount < rule.minTurn) {
    reasons.push(`turn≥${rule.minTurn}`);
  }
  if (rule.minInterfaceLevel && !interfaceLevelAtLeast(signals.interfaceLevel, rule.minInterfaceLevel)) {
    reasons.push(`interface≥${rule.minInterfaceLevel}`);
  }
  if (rule.requiredConceptIds?.length) {
    const concepts = signals.guidedConceptStatuses ?? {};
    for (const id of rule.requiredConceptIds) {
      const st = concepts[id];
      if (st !== 'introduced' && st !== 'mastered') {
        reasons.push(`concept:${id}`);
      }
    }
  }
  if (rule.requiredMilestoneIds?.length) {
    const done = new Set(signals.completedMilestoneIds ?? []);
    for (const id of rule.requiredMilestoneIds) {
      if (!done.has(id)) reasons.push(`milestone:${id}`);
    }
  }
  return { ok: reasons.length === 0, reasons };
}

export function tierFromInterfaceLevel(level: InterfaceExperienceLevel): ProgressionTier {
  switch (level) {
    case 'simple':
      return 1;
    case 'guided':
      return 2;
    case 'advanced':
      return 3;
    case 'expert':
      return 5;
    default:
      return 2;
  }
}

// --- source: types/accessibility.ts ---
/** Subset of V9.4 AccessibilitySettings for standalone module tests. */
export type FocusRingStyle = 'emerald' | 'cyan' | 'amber' | 'white';
export type ScreenReaderAnnounceVerbosity = 'off' | 'minimal' | 'polite' | 'assertive';

export interface AccessibilitySettingsSnapshot {
  highContrastFocusRings: boolean;
  focusRingStyle: FocusRingStyle;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  announceVerbosity: ScreenReaderAnnounceVerbosity;
  keyboardNavigationHints: boolean;
  trapFocusInModals: boolean;
  restoreFocusOnClose: boolean;
  cycleFocusWithTab: boolean;
  arrowKeyNavigationEnabled: boolean;
  textScaleMultiplier: number;
}

export const DEFAULT_ACCESSIBILITY_SNAPSHOT: AccessibilitySettingsSnapshot = {
  highContrastFocusRings: true,
  focusRingStyle: 'emerald',
  reducedMotion: false,
  screenReaderAnnouncements: true,
  announceVerbosity: 'polite',
  keyboardNavigationHints: true,
  trapFocusInModals: true,
  restoreFocusOnClose: true,
  cycleFocusWithTab: true,
  arrowKeyNavigationEnabled: true,
  textScaleMultiplier: 1.0,
};

export interface FocusRingClassOptions {
  highContrast: boolean;
  style: FocusRingStyle;
}

export interface LiveRegionMessage {
  id: string;
  text: string;
  politeness: 'polite' | 'assertive';
  createdAt: number;
}

export interface MotionPolicy {
  allowTransitions: boolean;
  allowTransformAnimations: boolean;
  allowParallax: boolean;
}

// --- source: types/access-policy.ts ---
/** Policy flags — default preserves legacy direct navigation. */
export interface EvolvingUiAccessPolicy {
  /** Expert toggle / settings: show every panel in default chrome. */
  showAllPanelsOverride: boolean;
  /** Panel ids the player has opened at least once — stay visible in guided mode. */
  rememberedPanelIds: string[];
  /** When true, nav deep-links and resolveIntentNavToUiPatch always apply (canonical behavior). */
  preserveLegacyNavPatches: boolean;
  /** When true, essential panels ignore tier gates. */
  honorEssentialPanels: boolean;
  /** Interface levels that implicitly enable show-all for chrome (not nav). */
  implicitShowAllLevels: InterfaceExperienceLevel[];
}

export const DEFAULT_EVOLVING_UI_ACCESS_POLICY: EvolvingUiAccessPolicy = {
  showAllPanelsOverride: false,
  rememberedPanelIds: [],
  preserveLegacyNavPatches: true,
  honorEssentialPanels: true,
  implicitShowAllLevels: ['expert', 'advanced'],
};

export interface LegacyNavRequest {
  target: string;
  source: 'intent_nav' | 'deep_link' | 'keyboard' | 'onboarding';
}

export interface LegacyAccessResult {
  allowed: boolean;
  uiPatch: Record<string, boolean | string>;
  announce?: string;
}

// --- source: registry/modal-panel-definitions.ts ---
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

// --- source: registry/progression-milestones.ts ---
export interface UiProgressionMilestone {
  id: string;
  title: string;
  description: string;
  unlocksPanelIds: string[];
  rule: ProgressionUnlockRule;
  coachCopy: string;
}

/** Milestones bridge campaign/onboarding ids to panel unlock expectations. */
export const UI_PROGRESSION_MILESTONES: UiProgressionMilestone[] = [
  {
    id: 'first_market_visit',
    title: 'First market visit',
    description: 'Player opened the market at least once.',
    unlocksPanelIds: ['nav_market', 'modal_market'],
    rule: { minDay: 1 },
    coachCopy: 'Markets unlock after your first day of play.',
  },
  {
    id: 'first_contract',
    title: 'First regional contract',
    description: 'Completed or accepted first contract flow.',
    unlocksPanelIds: ['nav_contracts', 'modal_regional_contracts'],
    rule: { minDay: 3, minInterfaceLevel: 'guided' },
    coachCopy: 'Contracts appear once you understand regional standing.',
  },
  {
    id: 'capital_allocation_intro',
    title: 'Capital allocation lesson',
    description: 'Guided learning introduced capital allocation.',
    unlocksPanelIds: ['nav_investments', 'modal_investments'],
    rule: { requiredConceptIds: ['capital_allocation'], minDay: 4 },
    coachCopy: 'Investments unlock after the capital allocation lesson.',
  },
  {
    id: 'first_crisis',
    title: 'First crisis response',
    description: 'Player entered crisis management flow.',
    unlocksPanelIds: ['modal_crisis_management'],
    rule: { minDay: 5, requiredMilestoneIds: ['first_crisis'] },
    coachCopy: 'Crisis tools stay available once a crisis begins.',
  },
  {
    id: 'advanced_interface',
    title: 'Advanced interface',
    description: 'Player switched to Advanced layout or interface level.',
    unlocksPanelIds: ['widget_strategy_planner', 'widget_ai_command', 'nav_expeditions'],
    rule: { minInterfaceLevel: 'advanced', minDay: 6 },
    coachCopy: 'Advanced tools unlock in the Advanced interface profile.',
  },
  {
    id: 'expert_diagnostics',
    title: 'Expert diagnostics',
    description: 'Expert player accessing replay/determinism tooling.',
    unlocksPanelIds: ['nav_diagnostics', 'nav_replay', 'modal_determinism_audit', 'modal_what_if_timelines'],
    rule: { minInterfaceLevel: 'expert' },
    coachCopy: 'Diagnostics surfaces are grouped under Expert settings.',
  },
];

export const UI_MILESTONE_BY_ID: Record<string, UiProgressionMilestone> = Object.fromEntries(
  UI_PROGRESSION_MILESTONES.map(m => [m.id, m])
);

// --- source: registry/panel-definitions.ts ---
const core = (
  partial: Omit<EvolvingPanelDefinition, 'progressionTier' | 'unlock'>
): EvolvingPanelDefinition => ({
  ...partial,
  progressionTier: 0,
  unlock: {},
});

const tiered = (
  tier: ProgressionTier,
  unlock: EvolvingPanelDefinition['unlock'],
  partial: Omit<EvolvingPanelDefinition, 'progressionTier' | 'unlock'>
): EvolvingPanelDefinition => ({
  ...partial,
  progressionTier: tier,
  unlock,
});

/** Intent nav targets from V9.4 `IntentNavTarget` with progression metadata. */
export const NAV_TARGET_PANELS: EvolvingPanelDefinition[] = [
  core({
    id: 'nav_map',
    label: 'Map',
    description: 'Regional map, travel planning, and territory overview.',
    category: 'core',
    kind: 'nav_target',
    navTarget: 'map',
    legacyUiPatchKeys: ['showMap'],
    essential: true,
    railOrder: 10,
    tags: ['navigation', 'core'],
  }),
  core({
    id: 'nav_travel',
    label: 'Travel',
    description: 'Move between regions and manage routes.',
    category: 'core',
    kind: 'nav_target',
    navTarget: 'travel',
    legacyUiPatchKeys: ['showTravelModal', 'showMap'],
    essential: true,
    railOrder: 20,
  }),
  core({
    id: 'nav_challenges',
    label: 'Challenges',
    description: 'Regional challenges and standing actions.',
    category: 'regional',
    kind: 'nav_target',
    navTarget: 'challenges',
    legacyUiPatchKeys: ['showChallenges'],
    railOrder: 30,
  }),
  tiered(1, { minDay: 1 }, {
    id: 'nav_workshop',
    label: 'Workshop',
    description: 'Crafting, recipes, and production chains.',
    category: 'economy',
    kind: 'nav_target',
    navTarget: 'workshop',
    legacyUiPatchKeys: ['showWorkshop'],
    railOrder: 40,
    tags: ['crafting'],
  }),
  tiered(1, { minDay: 1 }, {
    id: 'nav_market',
    label: 'Market',
    description: 'Buy and sell goods on the market.',
    category: 'economy',
    kind: 'nav_target',
    navTarget: 'market',
    legacyUiPatchKeys: ['showMarket'],
    railOrder: 50,
  }),
  tiered(1, { minDay: 2 }, {
    id: 'nav_resource_market',
    label: 'Resource Exchange',
    description: 'Bulk resource trading and spot prices.',
    category: 'economy',
    kind: 'nav_target',
    navTarget: 'resource_market',
    legacyUiPatchKeys: ['showResourceMarket'],
    railOrder: 55,
  }),
  tiered(1, { minDay: 2 }, {
    id: 'nav_shop',
    label: 'Shop',
    description: 'Equipment and consumable purchases.',
    category: 'economy',
    kind: 'nav_target',
    navTarget: 'shop',
    legacyUiPatchKeys: ['showShop'],
    railOrder: 60,
  }),
  tiered(2, { minDay: 3, minInterfaceLevel: 'guided' }, {
    id: 'nav_contracts',
    label: 'Contracts',
    description: 'Regional contracts and obligations.',
    category: 'regional',
    kind: 'nav_target',
    navTarget: 'contracts',
    legacyUiPatchKeys: ['showRegionalContractsModal'],
    railOrder: 70,
  }),
  tiered(2, { minDay: 4, requiredConceptIds: ['capital_allocation'] }, {
    id: 'nav_investments',
    label: 'Investments',
    description: 'Portfolio, stocks, and long-horizon bets.',
    category: 'strategic',
    kind: 'nav_target',
    navTarget: 'investments',
    legacyUiPatchKeys: ['showInvestments'],
    railOrder: 80,
  }),
  tiered(2, { minDay: 5 }, {
    id: 'nav_loans',
    label: 'Loans & Credit',
    description: 'Advanced lending, collateral, and credit lines.',
    category: 'economy',
    kind: 'nav_target',
    navTarget: 'loans',
    legacyUiPatchKeys: ['showAdvancedLoans'],
    railOrder: 85,
    tags: ['finance'],
  }),
  tiered(2, { minDay: 6 }, {
    id: 'nav_infrastructure',
    label: 'Infrastructure',
    description: 'Build projects and regional infrastructure.',
    category: 'regional',
    kind: 'nav_target',
    navTarget: 'infrastructure',
    legacyUiPatchKeys: ['showInfrastructureProjectsModal'],
    railOrder: 90,
  }),
  tiered(3, { minDay: 8, minInterfaceLevel: 'advanced' }, {
    id: 'nav_expeditions',
    label: 'Expeditions',
    description: 'Relics, expeditions, and high-risk ventures.',
    category: 'strategic',
    kind: 'nav_target',
    navTarget: 'expeditions',
    legacyUiPatchKeys: ['showExpeditionsRelicsModal'],
    railOrder: 100,
  }),
  tiered(3, { minDay: 10 }, {
    id: 'nav_diplomacy',
    label: 'Diplomacy',
    description: 'Rival relationships and diplomatic actions.',
    category: 'social',
    kind: 'nav_target',
    navTarget: 'diplomacy',
    legacyUiPatchKeys: ['showAiRivalryModal'],
    railOrder: 110,
  }),
  tiered(3, { minDay: 12, minInterfaceLevel: 'advanced' }, {
    id: 'nav_sabotage',
    label: 'Covert Operations',
    description: 'Sabotage and asymmetric rival actions.',
    category: 'strategic',
    kind: 'nav_target',
    navTarget: 'sabotage',
    legacyUiPatchKeys: ['showSabotage'],
    railOrder: 115,
  }),
  tiered(2, { minDay: 3 }, {
    id: 'nav_progress',
    label: 'Progress',
    description: 'Objectives, milestones, and scenario progress.',
    category: 'core',
    kind: 'nav_target',
    navTarget: 'progress',
    legacyUiPatchKeys: ['showProgress'],
    railOrder: 35,
  }),
  tiered(2, { minDay: 4 }, {
    id: 'nav_ledger',
    label: 'Activity Ledger',
    description: 'Auditable log of actions and state changes.',
    category: 'diagnostics',
    kind: 'nav_target',
    navTarget: 'ledger',
    legacyUiPatchKeys: ['showGameActivityLedgerDashboard'],
    railOrder: 120,
  }),
  core({
    id: 'nav_help',
    label: 'Help',
    description: 'Mechanics directory and contextual help.',
    category: 'core',
    kind: 'nav_target',
    navTarget: 'help',
    legacyUiPatchKeys: ['showHelp'],
    essential: true,
    railOrder: 5,
  }),
  core({
    id: 'nav_settings',
    label: 'Settings',
    description: 'Game settings, accessibility, and interface presets.',
    category: 'core',
    kind: 'nav_target',
    navTarget: 'settings',
    legacyUiPatchKeys: ['showSettings'],
    essential: true,
    railOrder: 200,
  }),
  tiered(4, { minInterfaceLevel: 'expert' }, {
    id: 'nav_automation',
    label: 'Automation',
    description: 'Auto mode and adaptive match manager.',
    category: 'automation',
    kind: 'nav_target',
    navTarget: 'automation',
    legacyUiPatchKeys: ['showSettings', 'settingsActiveTab'],
    railOrder: 130,
  }),
  tiered(4, { minInterfaceLevel: 'expert' }, {
    id: 'nav_diagnostics',
    label: 'Diagnostics',
    description: 'Replay diagnostics and developer tooling.',
    category: 'diagnostics',
    kind: 'nav_target',
    navTarget: 'diagnostics',
    legacyUiPatchKeys: ['showSettings', 'showAutoModeDiagnosticsDrawer'],
    railOrder: 140,
  }),
  tiered(4, { minInterfaceLevel: 'advanced' }, {
    id: 'nav_replay',
    label: 'Replay',
    description: 'Replay viewer and match reconstruction.',
    category: 'diagnostics',
    kind: 'nav_target',
    navTarget: 'replay',
    legacyUiPatchKeys: ['showReplayViewer'],
    railOrder: 135,
  }),
  tiered(3, { minInterfaceLevel: 'advanced' }, {
    id: 'nav_governance',
    label: 'Governance',
    description: 'Oversight, voting, and team governance.',
    category: 'social',
    kind: 'nav_target',
    navTarget: 'governance',
    legacyUiPatchKeys: ['showSettings'],
    railOrder: 125,
  }),
  tiered(2, { minDay: 2 }, {
    id: 'nav_ask_game',
    label: 'Ask Game AI',
    description: 'Natural-language questions about visible state.',
    category: 'automation',
    kind: 'nav_target',
    navTarget: 'ask_game',
    legacyUiPatchKeys: ['showAskGameAi'],
    railOrder: 15,
  }),
];

/** Floating widgets aligned with V9.4 contextual hiding ids. */
export const FLOATING_WIDGET_PANELS: EvolvingPanelDefinition[] = [
  tiered(1, { minDay: 1 }, {
    id: 'widget_quick_actions',
    label: 'Quick Actions',
    description: 'Compact action launcher dock.',
    category: 'core',
    kind: 'floating_widget',
    widgetId: 'quick_actions',
    railOrder: 10,
  }),
  tiered(1, { minDay: 1 }, {
    id: 'widget_ask_game',
    label: 'Ask Game (Floating)',
    description: 'Floating entry to Ask Game AI.',
    category: 'automation',
    kind: 'floating_widget',
    widgetId: 'ask_game_floating_button',
    legacyUiPatchKeys: ['showAskGameAi'],
    railOrder: 20,
  }),
  tiered(2, { minDay: 3, minInterfaceLevel: 'guided' }, {
    id: 'widget_guardian',
    label: 'Guardian',
    description: 'Guardian AI safety controls.',
    category: 'automation',
    kind: 'floating_widget',
    widgetId: 'guardian_floating_button',
    railOrder: 30,
  }),
  tiered(3, { minDay: 6, minInterfaceLevel: 'advanced' }, {
    id: 'widget_strategy_planner',
    label: 'Strategy Planner',
    description: 'Multi-step strategy plan widget.',
    category: 'strategic',
    kind: 'floating_widget',
    widgetId: 'strategy_planner_widget',
    railOrder: 40,
  }),
  tiered(3, { minDay: 7, minInterfaceLevel: 'advanced' }, {
    id: 'widget_ai_command',
    label: 'AI Command Center',
    description: 'Command center widget for AI teams.',
    category: 'automation',
    kind: 'floating_widget',
    widgetId: 'ai_command_center_widget',
    railOrder: 50,
  }),
  tiered(5, { minInterfaceLevel: 'expert' }, {
    id: 'widget_dev_diagnostics',
    label: 'Developer Diagnostics',
    description: 'Dev-only diagnostics widget.',
    category: 'diagnostics',
    kind: 'floating_widget',
    widgetId: 'developer_diagnostics_widget',
    railOrder: 60,
  }),
];

export const SETTINGS_TAB_PANELS: EvolvingPanelDefinition[] = [
  core({
    id: 'settings_tab_interface',
    label: 'Interface',
    description: 'Layout presets, launcher, and evolving UI.',
    category: 'core',
    kind: 'settings_tab',
    essential: true,
    railOrder: 1,
  }),
  tiered(1, {}, {
    id: 'settings_tab_accessibility',
    label: 'Accessibility',
    description: 'Focus, motion, screen reader, and text scale.',
    category: 'core',
    kind: 'settings_tab',
    railOrder: 2,
  }),
  tiered(3, { minInterfaceLevel: 'advanced' }, {
    id: 'settings_tab_automation',
    label: 'Automation',
    description: 'Auto mode and co-pilot settings.',
    category: 'automation',
    kind: 'settings_tab',
    railOrder: 10,
  }),
  tiered(4, { minInterfaceLevel: 'expert' }, {
    id: 'settings_tab_replay_diag',
    label: 'Replay & Diagnostics',
    description: 'Replay tooling and regression hooks.',
    category: 'diagnostics',
    kind: 'settings_tab',
    railOrder: 20,
  }),
];

export const EVOLVING_UI_PANEL_REGISTRY: EvolvingPanelDefinition[] = [
  ...NAV_TARGET_PANELS,
  ...FLOATING_WIDGET_PANELS,
  ...SETTINGS_TAB_PANELS,
  ...MODAL_PANELS,
];

export const EVOLVING_UI_PANEL_BY_ID: Record<string, EvolvingPanelDefinition> = Object.fromEntries(
  EVOLVING_UI_PANEL_REGISTRY.map(p => [p.id, p])
);

export function listPanelsByCategory(category: EvolvingPanelDefinition['category']): EvolvingPanelDefinition[] {
  return EVOLVING_UI_PANEL_REGISTRY.filter(p => p.category === category);
}

export function listPanelsForNavTarget(navTarget: string): EvolvingPanelDefinition[] {
  return EVOLVING_UI_PANEL_REGISTRY.filter(p => p.navTarget === navTarget);
}

export function listPanelsForWidget(widgetId: string): EvolvingPanelDefinition[] {
  return EVOLVING_UI_PANEL_REGISTRY.filter(p => p.widgetId === widgetId);
}

// --- source: engine/progression-signals.ts ---
/** Minimal game settings shape for bridging without importing V9.4. */
export interface V94GameSettingsSlice {
  smartSettingsProfile?: {
    interfaceLevel?: InterfaceExperienceLevel;
    guidance?: string;
  };
  presetSettings?: { activePreset?: string };
  playerIntentOnboardingEnabled?: boolean;
  accessibilitySettings?: Record<string, unknown>;
  evolvingUi?: {
    showAllPanelsOverride?: boolean;
    rememberedPanelIds?: string[];
  };
}

export interface V94GameStateSlice {
  gameDay?: number;
  turnCount?: number;
  day?: number;
}

export interface V94GuidedLearningSlice {
  concepts?: Record<string, { status?: string } | string>;
}

export function extractProgressionSignals(
  gameState: V94GameStateSlice | null | undefined,
  gameSettings: V94GameSettingsSlice | null | undefined,
  guidedLearning?: V94GuidedLearningSlice | null
): ProgressionSignalSnapshot {
  const day = Number(gameState?.gameDay ?? gameState?.day ?? 1);
  const turn = Number(gameState?.turnCount ?? day);
  const level = gameSettings?.smartSettingsProfile?.interfaceLevel ?? 'guided';
  const conceptStatuses: Record<string, 'locked' | 'introduced' | 'mastered'> = {};
  const rawConcepts = guidedLearning?.concepts ?? {};
  for (const [key, val] of Object.entries(rawConcepts)) {
    const status = typeof val === 'string' ? val : val?.status;
    if (status === 'introduced' || status === 'mastered' || status === 'locked') {
      conceptStatuses[key] = status;
    }
  }
  return {
    gameDay: Number.isFinite(day) ? day : 1,
    turnCount: Number.isFinite(turn) ? turn : 1,
    interfaceLevel: level,
    layoutPreset: gameSettings?.presetSettings?.activePreset,
    guidedConceptStatuses: conceptStatuses,
    completedMilestoneIds: [],
    playerIntentOnboardingEnabled: gameSettings?.playerIntentOnboardingEnabled !== false,
  };
}

export function deriveInterfaceLevelFromLayoutPreset(preset: string | undefined): InterfaceExperienceLevel | null {
  switch (preset) {
    case 'Clean':
      return 'simple';
    case 'Assisted':
      return 'guided';
    case 'Advanced':
      return 'advanced';
    case 'Developer':
      return 'expert';
    default:
      return null;
  }
}

// --- source: engine/unlock-hint-formatter.ts ---
export function formatUnlockRequirementLabel(key: string): string {
  if (key.startsWith('day≥')) return `Reach ${key.replace('day≥', 'day ')}`;
  if (key.startsWith('turn≥')) return `Complete ${key.replace('turn≥', 'turn ')}`;
  if (key.startsWith('interface≥')) return `Use ${key.replace('interface≥', '')} interface`;
  if (key.startsWith('concept:')) return `Learn: ${key.replace('concept:', '').replace(/_/g, ' ')}`;
  if (key.startsWith('milestone:')) {
    const id = key.replace('milestone:', '');
    return UI_MILESTONE_BY_ID[id]?.title ?? id;
  }
  return key;
}

export function buildUnlockHintForPanel(
  panel: EvolvingPanelDefinition,
  signals: ProgressionSignalSnapshot
): string {
  const evalResult = evaluateUnlockRule(panel.unlock, signals);
  if (evalResult.ok) return 'Unlocked';
  if (evalResult.reasons.length === 0) return 'Keep playing to unlock';
  return evalResult.reasons.map(formatUnlockRequirementLabel).join(' · ');
}

export function buildCoachHeadline(panel: EvolvingPanelDefinition, signals: ProgressionSignalSnapshot): string {
  const hint = buildUnlockHintForPanel(panel, signals);
  if (hint === 'Unlocked') return `${panel.label} is available.`;
  return `${panel.label} unlocks when: ${hint}`;
}

// --- source: engine/phase-panel-policy.ts ---
const PHASE_SUPPRESS_CATEGORIES: Partial<Record<V94StandardizedGamePhase, string[]>> = {
  main_menu: ['economy', 'strategic', 'regional', 'automation'],
  setup: ['strategic', 'diagnostics'],
  save_load: ['economy', 'strategic', 'regional'],
  replay: ['economy', 'regional'],
  post_match: ['economy', 'automation'],
  ai_turn: ['automation'],
};

const PHASE_ESSENTIAL_MODAL_IDS = new Set([
  'modal_guardian_warning',
  'modal_save_migration',
  'modal_save_load',
]);

export function applyPhasePolicyToVisibility(
  phase: V94StandardizedGamePhase,
  panelId: string,
  panelCategory: string,
  baseState: PanelVisibilityState
): { state: PanelVisibilityState; reason: string } {
  if (PHASE_ESSENTIAL_MODAL_IDS.has(panelId)) {
    return { state: baseState === 'hidden' ? 'visible' : baseState, reason: 'phase_essential_modal' };
  }
  const suppressed = PHASE_SUPPRESS_CATEGORIES[phase];
  if (!suppressed || baseState === 'hidden') {
    return { state: baseState, reason: 'phase_no_change' };
  }
  if (suppressed.includes(panelCategory)) {
    if (baseState === 'visible') {
      return { state: 'preview', reason: `phase_${phase}_preview` };
    }
  }
  return { state: baseState, reason: 'phase_no_change' };
}

export function listPhasesThatSuppressCategory(category: string): V94StandardizedGamePhase[] {
  const out: V94StandardizedGamePhase[] = [];
  for (const [phase, cats] of Object.entries(PHASE_SUPPRESS_CATEGORIES)) {
    if (cats?.includes(category)) out.push(phase as V94StandardizedGamePhase);
  }
  return out;
}

// --- source: engine/resolve-panel-visibility.ts ---
function shouldBypassGating(
  policy: EvolvingUiAccessPolicy,
  signals: ProgressionSignalSnapshot,
  panelId: string
): boolean {
  if (policy.showAllPanelsOverride) return true;
  if (policy.implicitShowAllLevels.includes(signals.interfaceLevel)) return true;
  if (policy.rememberedPanelIds.includes(panelId)) return true;
  return false;
}

export function resolveEvolvingPanelVisibility(
  panelId: string,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config: EvolvingUiProgressionConfig = DEFAULT_EVOLVING_UI_PROGRESSION_CONFIG
): PanelVisibilityResult {
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return {
      panelId,
      state: 'visible',
      reason: 'unknown_panel_defaults_visible',
      progressionTier: 0,
      satisfiesUnlock: true,
    };
  }

  const unlockEval = evaluateUnlockRule(panel.unlock, signals);
  const maxTier = tierFromInterfaceLevel(signals.interfaceLevel);
  const tierOk = panel.progressionTier <= maxTier || panel.progressionTier === 0;

  if (policy.honorEssentialPanels && panel.essential) {
    return {
      panelId,
      state: 'visible',
      reason: 'essential_panel',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  if (config.respectShowAllOverride && shouldBypassGating(policy, signals, panelId)) {
    return {
      panelId,
      state: 'visible',
      reason: policy.showAllPanelsOverride ? 'show_all_override' : 'remembered_or_implicit_advanced',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  if (!config.enableProgressionGating) {
    return {
      panelId,
      state: 'visible',
      reason: 'progression_gating_disabled',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  const fullyUnlocked = unlockEval.ok && tierOk;
  let state: PanelVisibilityState = 'hidden';
  let reason = `locked:${unlockEval.reasons.join(',') || 'tier'}`;

  if (fullyUnlocked) {
    state = 'visible';
    reason = 'unlock_satisfied';
  } else if (config.showPreviewForLocked && (unlockEval.ok || panel.progressionTier <= maxTier + 1)) {
    state = 'preview';
    reason = unlockEval.ok ? 'preview_tier' : `preview_pending:${unlockEval.reasons.join(',')}`;
  }

  return {
    panelId,
    state,
    reason,
    progressionTier: panel.progressionTier,
    satisfiesUnlock: unlockEval.ok,
  };
}

export function resolveAllPanelVisibilities(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult[] {
  return Object.keys(EVOLVING_UI_PANEL_BY_ID).map(id =>
    resolveEvolvingPanelVisibility(id, signals, policy, config)
  );
}

export function sortPanelsForRail(
  panelIds: string[],
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): string[] {
  const withMeta = panelIds.map(id => {
    const panel = EVOLVING_UI_PANEL_BY_ID[id];
    const vis = resolveEvolvingPanelVisibility(id, signals, policy, config);
    return {
      id,
      order: panel?.railOrder ?? 999,
      tier: panel?.progressionTier ?? 0,
      state: vis.state,
    };
  });
  const rank = (s: PanelVisibilityState) => (s === 'visible' ? 0 : s === 'preview' ? 1 : 2);
  return withMeta
    .sort((a, b) => rank(a.state) - rank(b.state) || a.tier - b.tier || a.order - b.order || a.id.localeCompare(b.id))
    .map(x => x.id);
}

export function resolveEvolvingPanelVisibilityWithPhase(
  panelId: string,
  phase: V94StandardizedGamePhase,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult {
  const base = resolveEvolvingPanelVisibility(panelId, signals, policy, config);
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) return base;
  const phased = applyPhasePolicyToVisibility(phase, panelId, panel.category, base.state);
  if (phased.state === base.state && phased.reason === 'phase_no_change') return base;
  return {
    ...base,
    state: phased.state,
    reason: `${base.reason}|${phased.reason}`,
  };
}

// --- source: engine/legacy-access.ts ---
/** Mirrors V9.4 resolveIntentNavToUiPatch targets (standalone copy for module tests). */
export function resolveIntentNavToUiPatch(target: string): Record<string, boolean | string> {
  switch (target) {
    case 'workshop':
      return { showWorkshop: true };
    case 'market':
      return { showMarket: true };
    case 'resource_market':
      return { showResourceMarket: true };
    case 'map':
      return { showMap: true };
    case 'travel':
      return { showTravelModal: true, showMap: true };
    case 'contracts':
      return { showRegionalContractsModal: true };
    case 'shop':
      return { showShop: true };
    case 'investments':
      return { showInvestments: true };
    case 'expeditions':
      return { showExpeditionsRelicsModal: true };
    case 'infrastructure':
      return { showInfrastructureProjectsModal: true };
    case 'settings':
    case 'assistant_advanced':
      return { showSettings: true, settingsActiveTab: 'aiTeams' };
    case 'ask_game':
      return { showAskGameAi: true };
    case 'ledger':
      return { showGameActivityLedgerDashboard: true };
    case 'replay':
      return { showReplayViewer: true, showSettings: true, settingsActiveTab: 'replayDiag' };
    case 'diagnostics':
      return { showSettings: true, settingsActiveTab: 'replayDiag', showAutoModeDiagnosticsDrawer: true };
    case 'challenges':
      return { showChallenges: true };
    case 'progress':
      return { showProgress: true };
    case 'loans':
      return { showAdvancedLoans: true };
    case 'governance':
      return { showSettings: true, settingsActiveTab: 'oversight' };
    case 'sabotage':
      return { showSabotage: true };
    case 'help':
      return { showHelp: true };
    case 'automation':
      return { showSettings: true, settingsActiveTab: 'automation' };
    case 'diplomacy':
      return { showAiRivalryModal: true };
    default:
      return {};
  }
}

/**
 * Preserve existing UI access: navigation always returns a patch when canonical behavior does.
 * Progression gating must not block this path when preserveLegacyNavPatches is true.
 */
export function resolveLegacyUiAccess(
  request: LegacyNavRequest,
  policy: EvolvingUiAccessPolicy
): LegacyAccessResult {
  const uiPatch = resolveIntentNavToUiPatch(request.target);
  const hasPatch = Object.keys(uiPatch).length > 0;
  if (!hasPatch) {
    return { allowed: false, uiPatch: {} };
  }
  if (policy.preserveLegacyNavPatches) {
    const panels = listPanelsForNavTarget(request.target);
    const label = panels[0]?.label ?? request.target;
    return {
      allowed: true,
      uiPatch,
      announce: `Opening ${label}`,
    };
  }
  return { allowed: true, uiPatch };
}

export function rememberPanelOpen(panelId: string, policy: EvolvingUiAccessPolicy): EvolvingUiAccessPolicy {
  if (policy.rememberedPanelIds.includes(panelId)) return policy;
  return {
    ...policy,
    rememberedPanelIds: [...policy.rememberedPanelIds, panelId],
  };
}

// --- source: engine/merge-with-v94-contextual-hiding.ts ---
export interface ContextualHidingInput {
  widgetId: string;
  contextualShouldShow: boolean;
}

/**
 * Combines V9.4 contextual hiding with evolving UI progression.
 * Emergency widgets should pass contextualShouldShow=true from canonical engine first.
 */
export function mergeEvolvingUiWithContextualHiding(
  input: ContextualHidingInput,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): { show: boolean; reason: string } {
  if (!input.contextualShouldShow) {
    return { show: false, reason: 'contextual_hiding' };
  }
  const panels = listPanelsForWidget(input.widgetId);
  if (panels.length === 0) {
    return { show: true, reason: 'unregistered_widget' };
  }
  const vis = resolveEvolvingPanelVisibility(panels[0].id, signals, policy, config);
  if (vis.state === 'hidden') {
    return { show: false, reason: `evolving_ui:${vis.reason}` };
  }
  return { show: true, reason: vis.state === 'preview' ? 'evolving_ui_preview' : 'visible' };
}

// --- source: engine/progression-coach.ts ---
export interface NextUnlockRecommendation {
  panelId: string;
  label: string;
  hint: string;
  headline: string;
  progressionTier: number;
  priority: number;
}

export function listNextUnlockRecommendations(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  limit = 5
): NextUnlockRecommendation[] {
  const candidates: NextUnlockRecommendation[] = [];
  for (const panel of Object.values(EVOLVING_UI_PANEL_BY_ID)) {
    const vis = resolveEvolvingPanelVisibility(panel.id, signals, policy);
    if (vis.state === 'visible') continue;
    const unlock = evaluateUnlockRule(panel.unlock, signals);
    const missingRules = unlock.reasons.length;
    const priority = panel.progressionTier * 10 + missingRules;
    candidates.push({
      panelId: panel.id,
      label: panel.label,
      hint: buildUnlockHintForPanel(panel, signals),
      headline: buildCoachHeadline(panel, signals),
      progressionTier: panel.progressionTier,
      priority,
    });
  }
  return candidates.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label)).slice(0, limit);
}

export function listMilestonesApproaching(
  signals: ProgressionSignalSnapshot,
  limit = 3
): Array<{ milestoneId: string; title: string; coachCopy: string; panels: string[] }> {
  const approaching = UI_PROGRESSION_MILESTONES.filter(m => {
    const ev = evaluateUnlockRule(m.rule, signals);
    return !ev.ok && ev.reasons.length <= 2;
  });
  return approaching.slice(0, limit).map(m => ({
    milestoneId: m.id,
    title: m.title,
    coachCopy: m.coachCopy,
    panels: m.unlocksPanelIds,
  }));
}

export function computeProgressionCoverage(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): { visible: number; preview: number; hidden: number; total: number; coverageRatio: number } {
  let visible = 0;
  let preview = 0;
  let hidden = 0;
  const total = Object.keys(EVOLVING_UI_PANEL_BY_ID).length;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const st = resolveEvolvingPanelVisibility(id, signals, policy).state;
    if (st === 'visible') visible++;
    else if (st === 'preview') preview++;
    else hidden++;
  }
  return {
    visible,
    preview,
    hidden,
    total,
    coverageRatio: total > 0 ? visible / total : 0,
  };
}

export function pickCoachPanelForCategory(
  category: EvolvingPanelDefinition['category'],
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): NextUnlockRecommendation | null {
  const recs = listNextUnlockRecommendations(signals, policy, 50);
  return recs.find(r => EVOLVING_UI_PANEL_BY_ID[r.panelId]?.category === category) ?? null;
}

// --- source: engine/scale-wave-self-tests.ts ---
export function runAgent22ScaleWaveSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'sw_modal_surface_map',
    'modal surface travel maps to panel',
    listModalPanelForSurface('travel_modal')?.id === 'modal_travel'
  );

  check(
    'sw_milestone_catalog',
    'UI milestones registered',
    Object.keys(UI_MILESTONE_BY_ID).length >= 6
  );

  const signals = { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' as const };
  const hint = buildUnlockHintForPanel(EVOLVING_UI_PANEL_BY_ID.nav_investments, {
    ...signals,
    guidedConceptStatuses: {},
  });
  check('sw_unlock_hint', 'investments hint mentions capital', hint.toLowerCase().includes('capital') || hint.includes('day'));

  const phased = resolveEvolvingPanelVisibilityWithPhase(
    'nav_market',
    'main_menu',
    signals,
    DEFAULT_EVOLVING_UI_ACCESS_POLICY
  );
  check('sw_phase_main_menu', 'main menu downgrades market visibility', phased.state !== 'visible' || phased.reason.includes('phase'));

  const coverage = computeProgressionCoverage(
    { gameDay: 10, turnCount: 10, interfaceLevel: 'expert' },
    DEFAULT_EVOLVING_UI_ACCESS_POLICY
  );
  check('sw_expert_coverage', 'expert coverage majority visible', coverage.coverageRatio >= 0.5);

  const recs = listNextUnlockRecommendations(signals, DEFAULT_EVOLVING_UI_ACCESS_POLICY, 3);
  check('sw_coach_recs', 'coach returns recommendations early game', recs.length > 0);

  check(
    'sw_guardian_phase',
    'guardian warning modal stays visible in save_load phase policy',
    applyPhasePolicyToVisibility('save_load', 'modal_guardian_warning', 'automation', 'hidden').state === 'visible'
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: a11y/aria-builders.ts ---
const RING_CLASSES: Record<FocusRingStyle, string> = {
  emerald: 'focus-visible:ring-emerald-400',
  cyan: 'focus-visible:ring-cyan-400',
  amber: 'focus-visible:ring-amber-400',
  white: 'focus-visible:ring-white',
};

export function buildFocusRingClassName(options: FocusRingClassOptions): string {
  const base = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';
  const ring = RING_CLASSES[options.style] ?? RING_CLASSES.emerald;
  const contrast = options.highContrast ? ' focus-visible:ring-offset-4 focus-visible:ring-4' : '';
  return `${base} ${ring}${contrast}`;
}

export function buildProgressionPanelAria(input: {
  panelLabel: string;
  visibility: 'visible' | 'preview' | 'hidden';
  unlockHint?: string;
  disabled?: boolean;
}): Record<string, string | boolean | undefined> {
  const expanded = input.visibility === 'visible';
  const hidden = input.visibility === 'hidden';
  return {
    role: 'region',
    'aria-label': input.panelLabel,
    'aria-expanded': expanded,
    'aria-hidden': hidden || undefined,
    'aria-disabled': input.disabled || input.visibility === 'preview' || undefined,
    'aria-description': input.unlockHint,
  };
}

export function buildNavRailItemAria(input: {
  label: string;
  selected: boolean;
  preview: boolean;
  unlockHint?: string;
}): Record<string, string | boolean | undefined> {
  return {
    role: 'button',
    'aria-label': input.preview ? `${input.label} (preview — ${input.unlockHint ?? 'locked'})` : input.label,
    'aria-current': input.selected ? 'page' : undefined,
    'aria-disabled': input.preview || undefined,
  };
}

export function buildShowAllToggleAria(enabled: boolean): Record<string, string | boolean> {
  return {
    role: 'switch',
    'aria-checked': enabled,
    'aria-label': 'Show all interface panels regardless of progression',
  };
}

export function textScaleStyle(settings: AccessibilitySettingsSnapshot): Record<string, string> {
  const mult = settings.textScaleMultiplier;
  if (mult === 1) return {};
  return { fontSize: `${mult * 100}%` };
}

// --- source: a11y/focus-management.ts ---
export function deriveMotionPolicy(settings: AccessibilitySettingsSnapshot): MotionPolicy {
  const reduced = settings.reducedMotion;
  return {
    allowTransitions: !reduced,
    allowTransformAnimations: !reduced,
    allowParallax: !reduced,
  };
}

export function motionSafeClassName(policy: MotionPolicy, animatedClass: string, staticClass = ''): string {
  return policy.allowTransformAnimations ? animatedClass : staticClass;
}

export function shouldTrapFocusInModal(settings: AccessibilitySettingsSnapshot): boolean {
  return settings.trapFocusInModals !== false;
}

export function shouldRestoreFocusOnClose(settings: AccessibilitySettingsSnapshot): boolean {
  return settings.restoreFocusOnClose !== false;
}

export function focusableSelector(): string {
  return [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
}

export function getFocusableElements(container: { querySelectorAll(sel: string): Iterable<Element> }): Element[] {
  return Array.from(container.querySelectorAll(focusableSelector())).filter(el => {
    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex === '-1') return false;
    return true;
  });
}

/** Minimal focus trap step for tests (DOM optional). */
export function nextFocusIndex(current: number, length: number, backward: boolean, cycle: boolean): number {
  if (length <= 0) return -1;
  if (backward) {
    if (current <= 0) return cycle ? length - 1 : 0;
    return current - 1;
  }
  if (current >= length - 1) return cycle ? 0 : length - 1;
  return current + 1;
}

// --- source: a11y/live-region-controller.ts ---
export class LiveRegionController {
  private messages: LiveRegionMessage[] = [];
  private seq = 0;

  constructor(private verbosity: ScreenReaderAnnounceVerbosity = 'polite') {}

  setVerbosity(v: ScreenReaderAnnounceVerbosity): void {
    this.verbosity = v;
  }

  announce(text: string, politeness: 'polite' | 'assertive' = 'polite'): LiveRegionMessage | null {
    if (this.verbosity === 'off') return null;
    if (this.verbosity === 'minimal' && politeness !== 'assertive') return null;
    const msg: LiveRegionMessage = {
      id: `lr-${++this.seq}`,
      text,
      politeness,
      createdAt: Date.now(),
    };
    this.messages.push(msg);
    if (this.messages.length > 20) this.messages.shift();
    return msg;
  }

  flush(): LiveRegionMessage[] {
    const out = [...this.messages];
    this.messages = [];
    return out;
  }

  peekLatest(): LiveRegionMessage | undefined {
    return this.messages[this.messages.length - 1];
  }
}

export function createLiveRegionController(settings: AccessibilitySettingsSnapshot): LiveRegionController {
  const v = settings.screenReaderAnnouncements ? settings.announceVerbosity : 'off';
  return new LiveRegionController(v);
}

export function formatPanelUnlockAnnouncement(panelLabel: string, unlockHint: string): string {
  return `${panelLabel} unlocked. ${unlockHint}`;
}

// --- source: adapters/v94-settings-bridge.ts ---
export interface BridgedEvolvingUiState {
  signals: ReturnType<typeof extractProgressionSignals>;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
}

export function bridgeV94GameSettingsToEvolvingUi(
  gameState: Parameters<typeof extractProgressionSignals>[0],
  gameSettings: V94GameSettingsSlice | null | undefined,
  guidedLearning?: Parameters<typeof extractProgressionSignals>[2]
): BridgedEvolvingUiState {
  const signals = extractProgressionSignals(gameState, gameSettings, guidedLearning);
  const presetLevel = deriveInterfaceLevelFromLayoutPreset(signals.layoutPreset);
  if (presetLevel && presetLevel !== signals.interfaceLevel) {
    signals.interfaceLevel = mergeInterfaceLevel(signals.interfaceLevel, presetLevel);
  }
  const evolving = gameSettings?.evolvingUi;
  const policy: EvolvingUiAccessPolicy = {
    ...DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    showAllPanelsOverride: Boolean(evolving?.showAllPanelsOverride),
    rememberedPanelIds: Array.isArray(evolving?.rememberedPanelIds) ? [...evolving!.rememberedPanelIds!] : [],
  };
  const accessibility = sanitizeAccessibilityFromSettings(gameSettings?.accessibilitySettings);
  return { signals, policy, accessibility };
}

function mergeInterfaceLevel(a: InterfaceExperienceLevel, b: InterfaceExperienceLevel): InterfaceExperienceLevel {
  const order: InterfaceExperienceLevel[] = ['simple', 'guided', 'advanced', 'expert'];
  return order[Math.max(order.indexOf(a), order.indexOf(b))] ?? a;
}

function sanitizeAccessibilityFromSettings(raw: Record<string, unknown> | undefined): AccessibilitySettingsSnapshot {
  if (!raw) return { ...DEFAULT_ACCESSIBILITY_SNAPSHOT };
  return {
    ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
    highContrastFocusRings:
      typeof raw.highContrastFocusRings === 'boolean' ? raw.highContrastFocusRings : DEFAULT_ACCESSIBILITY_SNAPSHOT.highContrastFocusRings,
    reducedMotion:
      typeof raw.reducedMotion === 'boolean'
        ? raw.reducedMotion
        : typeof raw.reduceMotion === 'boolean'
          ? raw.reduceMotion
          : DEFAULT_ACCESSIBILITY_SNAPSHOT.reducedMotion,
    announceVerbosity:
      raw.announceVerbosity === 'off' ||
      raw.announceVerbosity === 'minimal' ||
      raw.announceVerbosity === 'polite' ||
      raw.announceVerbosity === 'assertive'
        ? raw.announceVerbosity
        : DEFAULT_ACCESSIBILITY_SNAPSHOT.announceVerbosity,
    textScaleMultiplier:
      typeof raw.textScaleMultiplier === 'number' && raw.textScaleMultiplier >= 0.8 && raw.textScaleMultiplier <= 1.5
        ? raw.textScaleMultiplier
        : DEFAULT_ACCESSIBILITY_SNAPSHOT.textScaleMultiplier,
  };
}

// --- source: adapters/v94-phase-bridge.ts ---
export type V94StandardizedGamePhase =
  | 'main_menu'
  | 'setup'
  | 'human_turn'
  | 'ai_turn'
  | 'approval_waiting'
  | 'paused'
  | 'save_load'
  | 'replay'
  | 'post_match';

/** Standalone phase resolver aligned with V9.4 resolveCurrentGamePhase (simplified). */
export function resolveV94GamePhase(input: {
  gameState?: { gameStarted?: boolean; gameMode?: string; isAiTurn?: boolean; isPaused?: boolean; isGameOver?: boolean; currentActorId?: string };
  uiState?: {
    showStartScreen?: boolean;
    showCampaignSelect?: boolean;
    showSaveLoadModal?: boolean;
    showReplayViewer?: boolean;
    isApprovalWaiting?: boolean;
    isPaused?: boolean;
    showEndGameModal?: boolean;
  };
  activeBlockingModal?: string | null;
}): V94StandardizedGamePhase {
  const { gameState, uiState } = input;
  const modal = input.activeBlockingModal ?? null;
  if (uiState?.showStartScreen || gameState?.gameMode === 'start_screen' || gameState?.gameMode === 'menu' || gameState?.gameStarted === false) {
    return uiState?.showCampaignSelect ? 'setup' : 'main_menu';
  }
  if (modal === 'save_load_modal' || uiState?.showSaveLoadModal) return 'save_load';
  if (modal === 'replay_viewer' || uiState?.showReplayViewer) return 'replay';
  if (modal === 'approval_dialog' || uiState?.isApprovalWaiting) return 'approval_waiting';
  if (uiState?.isPaused || gameState?.isPaused) return 'paused';
  if (gameState?.isGameOver || uiState?.showEndGameModal) return 'post_match';
  if (gameState?.isAiTurn || gameState?.currentActorId?.startsWith('ai_')) return 'ai_turn';
  return 'human_turn';
}

export function shouldShowEvolvingRailForPhase(phase: V94StandardizedGamePhase): boolean {
  return phase === 'human_turn' || phase === 'paused' || phase === 'approval_waiting';
}

// --- source: fixtures/stories/index.ts ---
export interface EvolvingUiStoryFixture {
  id: string;
  title: string;
  description: string;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  expectedVisibleNavTargets: string[];
  expectedLegacyNavAlwaysWorks: string[];
}

export const STORY_FRESH_PLAYER_SIMPLE: EvolvingUiStoryFixture = {
  id: 'fresh-player-simple',
  title: 'Fresh player — simple interface',
  description: 'Day 1 on Clean preset; core map/travel/help/settings visible; economy panels preview or hidden.',
  signals: {
    gameDay: 1,
    turnCount: 1,
    interfaceLevel: 'simple',
    layoutPreset: 'Clean',
    guidedConceptStatuses: {},
    completedMilestoneIds: [],
    playerIntentOnboardingEnabled: true,
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'travel', 'help', 'settings', 'challenges'],
  expectedLegacyNavAlwaysWorks: ['loans', 'investments', 'diplomacy'],
};

export const STORY_MID_GAME_GUIDED: EvolvingUiStoryFixture = {
  id: 'mid-game-guided',
  title: 'Mid game — guided progression',
  description: 'Day 6 guided player with capital_allocation introduced; contracts and investments unlock in rail.',
  signals: {
    gameDay: 6,
    turnCount: 6,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
    guidedConceptStatuses: { capital_allocation: 'introduced' },
    completedMilestoneIds: ['first_contract'],
    playerIntentOnboardingEnabled: true,
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, rememberedPanelIds: ['nav_market'] },
  expectedVisibleNavTargets: ['map', 'travel', 'workshop', 'market', 'contracts', 'progress'],
  expectedLegacyNavAlwaysWorks: ['sabotage', 'expeditions'],
};

export const STORY_EXPERT_SHOW_ALL: EvolvingUiStoryFixture = {
  id: 'expert-show-all',
  title: 'Expert — implicit show all',
  description: 'Expert interface level shows full rail without override toggle.',
  signals: {
    gameDay: 3,
    turnCount: 3,
    interfaceLevel: 'expert',
    layoutPreset: 'Developer',
    guidedConceptStatuses: {},
    completedMilestoneIds: [],
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'automation', 'diagnostics', 'replay', 'loans'],
  expectedLegacyNavAlwaysWorks: ['diagnostics'],
};

export const STORY_A11Y_HIGH_CONTRAST: EvolvingUiStoryFixture = {
  id: 'accessibility-high-contrast',
  title: 'Accessibility — high contrast focus',
  description: 'Policy unchanged; documents paired accessibility snapshot for UI snapshots.',
  signals: {
    gameDay: 4,
    turnCount: 4,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
  },
  policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
  expectedVisibleNavTargets: ['map', 'help', 'settings'],
  expectedLegacyNavAlwaysWorks: ['help'],
};

/** Scale wave: late guided player approaching expert tooling. */
export const STORY_SCALE_WAVE_LATE_GUIDED: EvolvingUiStoryFixture = {
  id: 'scale-wave-late-guided',
  title: 'Late guided — modal + coach depth',
  description: 'Day 9 guided with crisis milestone; infrastructure and fog intel in play.',
  signals: {
    gameDay: 9,
    turnCount: 9,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
    guidedConceptStatuses: { capital_allocation: 'mastered' },
    completedMilestoneIds: ['first_crisis', 'first_contract'],
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'infrastructure', 'investments', 'contracts'],
  expectedLegacyNavAlwaysWorks: ['expeditions', 'diplomacy'],
};

export const ALL_STORY_FIXTURES: EvolvingUiStoryFixture[] = [
  STORY_FRESH_PLAYER_SIMPLE,
  STORY_MID_GAME_GUIDED,
  STORY_EXPERT_SHOW_ALL,
  STORY_A11Y_HIGH_CONTRAST,
  STORY_SCALE_WAVE_LATE_GUIDED,
];

// --- source: react/ProgressionPanelShell.tsx ---
export interface ProgressionPanelShellProps {
  panelLabel: string;
  visibility: PanelVisibilityState;
  unlockHint?: string;
  accessibility: AccessibilitySettingsSnapshot;
  children?: React.ReactNode;
  onActivate?: () => void;
}

export function ProgressionPanelShell({
  panelLabel,
  visibility,
  unlockHint,
  accessibility,
  children,
  onActivate,
}: ProgressionPanelShellProps): React.ReactElement {
  const aria = buildProgressionPanelAria({
    panelLabel,
    visibility,
    unlockHint,
    disabled: visibility === 'preview',
  });
  const style = textScaleStyle(accessibility);
  if (visibility === 'hidden') {
    return (
      <div {...aria} style={style} data-evolving-ui-state="hidden" data-testid="progression-panel-hidden" />
    );
  }
  return (
    <section {...aria} style={style} data-evolving-ui-state={visibility} data-testid="progression-panel-shell">
      {visibility === 'preview' && (
        <button type="button" className="text-xs opacity-80 underline" onClick={onActivate} data-testid="progression-panel-preview-activate">
          Preview: {panelLabel} — {unlockHint ?? 'Complete requirements to unlock'}
        </button>
      )}
      {visibility === 'visible' && children}
    </section>
  );
}

// --- source: react/EvolvingNavRail.tsx ---
export interface EvolvingNavRailProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  selectedNavTarget?: string;
  onNavigate: (navTarget: string, panelId: string) => void;
}

export function EvolvingNavRail({
  signals,
  policy,
  accessibility,
  selectedNavTarget,
  onNavigate,
}: EvolvingNavRailProps): React.ReactElement {
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  const ordered = useMemo(() => {
    const ids = NAV_TARGET_PANELS.map(p => p.id);
    return sortPanelsForRail(ids, signals, policy);
  }, [signals, policy]);

  return (
    <nav aria-label="Primary game navigation" data-testid="evolving-nav-rail" className="flex flex-col gap-1">
      {ordered.map(id => {
        const panel = NAV_TARGET_PANELS.find(p => p.id === id);
        if (!panel?.navTarget) return null;
        const vis = resolveEvolvingPanelVisibility(id, signals, policy);
        if (vis.state === 'hidden') return null;
        const preview = vis.state === 'preview';
        const aria = buildNavRailItemAria({
          label: panel.label,
          selected: selectedNavTarget === panel.navTarget,
          preview,
          unlockHint: vis.reason,
        });
        return (
          <button
            key={id}
            type="button"
            {...aria}
            className={`text-left px-2 py-1 rounded ${focusClass} ${preview ? 'opacity-60 italic' : ''}`}
            onClick={() => onNavigate(panel.navTarget!, id)}
            data-testid={`evolving-nav-${panel.navTarget}`}
          >
            {panel.label}
          </button>
        );
      })}
    </nav>
  );
}

// --- source: react/AccessibilityAnnouncer.tsx ---
export interface AccessibilityAnnouncerProps {
  settings: AccessibilitySettingsSnapshot;
  message?: string | null;
  politeness?: 'polite' | 'assertive';
}

export function AccessibilityAnnouncer({
  settings,
  message,
  politeness = 'polite',
}: AccessibilityAnnouncerProps): React.ReactElement | null {
  const [liveText, setLiveText] = useState('');
  const controller = createLiveRegionController(settings);

  useEffect(() => {
    if (!message) return;
    const msg = controller.announce(message, politeness);
    if (msg) setLiveText(msg.text);
  }, [message, politeness, settings]);

  if (!settings.screenReaderAnnouncements || settings.announceVerbosity === 'off') {
    return null;
  }

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      data-testid="accessibility-announcer"
    >
      {liveText}
    </div>
  );
}

// --- source: react/ShowAllPanelsToggle.tsx ---
export interface ShowAllPanelsToggleProps {
  enabled: boolean;
  accessibility: AccessibilitySettingsSnapshot;
  onChange: (enabled: boolean) => void;
}

export function ShowAllPanelsToggle({ enabled, accessibility, onChange }: ShowAllPanelsToggleProps): React.ReactElement {
  const aria = buildShowAllToggleAria(enabled);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  return (
    <button
      type="button"
      {...aria}
      className={`px-2 py-1 rounded border ${focusClass}`}
      onClick={() => onChange(!enabled)}
      data-testid="show-all-panels-toggle"
    >
      {enabled ? 'Showing all panels' : 'Progressive panels'}
    </button>
  );
}

// --- source: react/PanelUnlockCoach.tsx ---
export interface PanelUnlockCoachProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onSelectPanel?: (panelId: string) => void;
}

export function PanelUnlockCoach({ signals, policy, onSelectPanel }: PanelUnlockCoachProps): React.ReactElement {
  const recs = listNextUnlockRecommendations(signals, policy, 3);
  const milestones = listMilestonesApproaching(signals, 2);
  if (recs.length === 0 && milestones.length === 0) {
    return (
      <div data-testid="panel-unlock-coach" className="text-xs opacity-80">
        All tracked panels unlocked for your current progression.
      </div>
    );
  }
  return (
    <div data-testid="panel-unlock-coach" className="text-xs space-y-1" role="complementary" aria-label="Upcoming interface unlocks">
      {recs.map(r => (
        <button
          key={r.panelId}
          type="button"
          className="block text-left underline"
          onClick={() => onSelectPanel?.(r.panelId)}
          data-testid={`coach-rec-${r.panelId}`}
        >
          {r.headline}
        </button>
      ))}
      {milestones.map(m => (
        <div key={m.milestoneId} data-testid={`coach-milestone-${m.milestoneId}`}>
          {m.coachCopy}
        </div>
      ))}
    </div>
  );
}

// --- source: react/EvolvingUiProgressLab.tsx ---
export interface EvolvingUiProgressLabProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onRunSelfTests?: () => void;
  selfTestSummary?: string;
}

export function EvolvingUiProgressLab({
  signals,
  policy,
  onRunSelfTests,
  selfTestSummary,
}: EvolvingUiProgressLabProps): React.ReactElement {
  const coverage = computeProgressionCoverage(signals, policy);
  const recs = listNextUnlockRecommendations(signals, policy, 5);
  const vis = resolveAllPanelVisibilities(signals, policy);
  const previewCount = vis.filter(v => v.state === 'preview').length;

  return (
    <div
      data-testid="evolving-ui-progress-lab"
      style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }}
      role="region"
      aria-label="Evolving UI progression lab"
    >
      <strong style={{ color: '#22d3ee' }}>LAB — Agent 22 Evolving UI</strong>
      <div>
        Coverage: {(coverage.coverageRatio * 100).toFixed(0)}% visible ({coverage.visible}/{coverage.total}) · preview{' '}
        {previewCount} · hidden {coverage.hidden}
      </div>
      <div style={{ marginTop: 8 }}>
        {recs.map(r => (
          <div key={r.panelId}>
            {r.label}: {r.hint}
          </div>
        ))}
      </div>
      {onRunSelfTests && (
        <button type="button" onClick={onRunSelfTests} style={{ marginTop: 8 }} data-testid="evolving-ui-run-self-tests">
          Run Agent 22 Self-Tests
        </button>
      )}
      {selfTestSummary && <div style={{ marginTop: 4 }}>{selfTestSummary}</div>}
    </div>
  );
}

export const AGENT_22_MODULE_ID = 'operation-10m/agent-22-ui';
export const AGENT_22_MODULE_VERSION = '1.1.0';

export function runOp10mAgent22EvolvingUiSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'agent22_essential_map',
    'essential map panel visible day 1 simple',
    resolveEvolvingPanelVisibility(
      'nav_map',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    ).state === 'visible'
  );

  check(
    'agent22_legacy_loans',
    'legacy nav loans always patches',
    resolveLegacyUiAccess({ target: 'loans', source: 'intent_nav' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY).allowed &&
      Boolean(resolveLegacyUiAccess({ target: 'loans', source: 'intent_nav' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY).uiPatch.showAdvancedLoans)
  );

  check(
    'agent22_registry_unique',
    'panel registry ids unique',
    Object.keys(EVOLVING_UI_PANEL_BY_ID).length === EVOLVING_UI_PANEL_REGISTRY.length
  );

  for (const story of ALL_STORY_FIXTURES) {
    for (const target of story.expectedLegacyNavAlwaysWorks) {
      const access = resolveLegacyUiAccess({ target, source: 'deep_link' }, story.policy);
      check(
        `agent22_story_${story.id}_legacy_${target}`,
        `${story.id} legacy ${target}`,
        access.allowed && Object.keys(access.uiPatch).length > 0
      );
    }
  }

  const scale = runAgent22ScaleWaveSelfTests();
  for (const r of scale.results) {
    check(`agent22_scale_${r.id}`, r.name, r.passed, r.detail);
  }

  const failed = results.filter(r => !r.passed).length;
  return {
    passed: results.length - failed,
    failed,
    total: results.length,
    allPassed: failed === 0,
    results,
  };
}
// OP10M_MODULE_END agent-22-ui
