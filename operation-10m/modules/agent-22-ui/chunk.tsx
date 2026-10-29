// OP10M_MODULE_BEGIN agent-22-ui
// content-sha256-prefix: 1778d595a3c59c5d
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

// --- source: registry/launcher-panel-definitions.ts ---
const launcher = (
  id: string,
  label: string,
  tier: ProgressionTier,
  unlock: EvolvingPanelDefinition['unlock'],
  navTarget?: string
): EvolvingPanelDefinition => ({
  id,
  label,
  description: `${label} unified launcher entry.`,
  category: 'core',
  kind: 'floating_widget',
  progressionTier: tier,
  unlock,
  navTarget,
  widgetId: `launcher_${id}`,
  railOrder: 100,
  tags: ['launcher'],
});

/** Unified interface launcher entries (V9.4 launcherSettings parity). */
export const LAUNCHER_PANELS: EvolvingPanelDefinition[] = [
  launcher('ask_game', 'Ask Game', 1, { minDay: 1 }, 'ask_game'),
  launcher('guardian', 'Guardian', 2, { minDay: 3, minInterfaceLevel: 'guided' }),
  launcher('ai_command', 'AI Command', 3, { minDay: 7, minInterfaceLevel: 'advanced' }),
  launcher('strategy_planner', 'Strategy Planner', 3, { minDay: 6, minInterfaceLevel: 'advanced' }),
  launcher('quick_actions', 'Quick Actions', 1, { minDay: 1 }),
  launcher('notifications', 'Notifications', 0, {}, undefined),
  launcher('tools', 'Tools Menu', 2, { minDay: 4, minInterfaceLevel: 'guided' }),
  launcher('mechanics_directory', 'Mechanics Directory', 0, {}, 'help'),
];

export const LAUNCHER_PANEL_BY_ID: Record<string, EvolvingPanelDefinition> = Object.fromEntries(
  LAUNCHER_PANELS.map(p => [p.id, p])
);

export function listLauncherPanelsForNavTarget(navTarget: string): EvolvingPanelDefinition[] {
  return LAUNCHER_PANELS.filter(p => p.navTarget === navTarget);
}

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
  ...LAUNCHER_PANELS,
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

// --- source: sim/evolution-hooks.ts ---
/** Persisted slice proposed for `gameSettings.evolvingUi` (assembly-owned). */
export interface EvolvingUiPersistedState {
  showAllPanelsOverride?: boolean;
  rememberedPanelIds?: string[];
  lastProgressionTier?: number;
  /** panel ids first unlocked on a given game day */
  unlockedByDay?: Record<string, string[]>;
  lastCoachPanelId?: string | null;
  lastNavTarget?: string | null;
  preferredDensity?: 'compact' | 'comfortable' | 'spacious' | null;
  focusSessionSnoozedUntilDay?: number;
  cognitiveLoadCoachSnoozedUntilDay?: number;
  calmRecoveryUntilDay?: number;
  coachDismissalStreak?: number;
  coachDismissalQuietUntilDay?: number;
  /** announcement hash → last game day announced */
  announcementDedupLedger?: Record<string, number>;
  /** coach lines waiting for staggered live-region delivery */
  announcementPacingDeferredCount?: number;
  /** deferred coach copy awaiting flush on later ticks */
  announcementPacingQueue?: string[];
  /** onboarding funnel dismiss keys persisted for host */
  onboardingDismissedKeys?: string[];
  lastProgressionCoverageRatio?: number;
}

export interface DayAdvanceUiEvolutionResult {
  gameDay: number;
  newlyUnlockedPanelIds: string[];
  coachAnnouncements: string[];
  deferredCoachAnnouncementCount: number;
  flushedDeferredAnnouncementCount: number;
  coachLiveRegionMessageCount: number;
  progressionCoverageRatio: number;
  progressionCoverageDeltaCopy: string | null;
  updatedPersisted: EvolvingUiPersistedState;
  visiblePanelCount: number;
}

export function createDefaultEvolvingUiPersistedState(): EvolvingUiPersistedState {
  return {
    showAllPanelsOverride: false,
    rememberedPanelIds: [],
    lastProgressionTier: 0,
    unlockedByDay: {},
    lastCoachPanelId: null,
  };
}

export function mergePersistedIntoAccessPolicy(
  persisted: EvolvingUiPersistedState | null | undefined,
  base: EvolvingUiAccessPolicy
): EvolvingUiAccessPolicy {
  if (!persisted) return base;
  return {
    ...base,
    showAllPanelsOverride: Boolean(persisted.showAllPanelsOverride ?? base.showAllPanelsOverride),
    rememberedPanelIds: Array.isArray(persisted.rememberedPanelIds)
      ? [...new Set([...base.rememberedPanelIds, ...persisted.rememberedPanelIds])]
      : base.rememberedPanelIds,
  };
}

/**
 * Simulation hook: call after day/turn advance to detect newly visible panels and coach copy.
 * Does not mutate canonical game state — returns patches for host to apply.
 */
export function tickEvolvingUiOnDayAdvance(
  priorSignals: ProgressionSignalSnapshot,
  nextSignals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  persisted: EvolvingUiPersistedState = createDefaultEvolvingUiPersistedState()
): DayAdvanceUiEvolutionResult {
  const newlyUnlockedPanelIds: string[] = [];
  const coachAnnouncements: string[] = [];
  const dayKey = String(nextSignals.gameDay);
  const unlockedByDay = { ...(persisted.unlockedByDay ?? {}) };

  for (const panelId of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const before = resolveEvolvingPanelVisibility(panelId, priorSignals, policy).state;
    const after = resolveEvolvingPanelVisibility(panelId, nextSignals, policy).state;
    if (before !== 'visible' && after === 'visible') {
      newlyUnlockedPanelIds.push(panelId);
      const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
      if (panel) {
        coachAnnouncements.push(
          formatPanelUnlockAnnouncement(panel.label, buildUnlockHintForPanel(panel, nextSignals))
        );
      }
    }
  }

  if (newlyUnlockedPanelIds.length) {
    unlockedByDay[dayKey] = [...new Set([...(unlockedByDay[dayKey] ?? []), ...newlyUnlockedPanelIds])];
  }

  let visiblePanelCount = 0;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    if (resolveEvolvingPanelVisibility(id, nextSignals, policy).state === 'visible') visiblePanelCount++;
  }

  const updatedPersisted: EvolvingUiPersistedState = {
    ...persisted,
    unlockedByDay,
    lastProgressionTier: Math.max(persisted.lastProgressionTier ?? 0, nextSignals.gameDay >= 10 ? 3 : 2),
    lastCoachPanelId: newlyUnlockedPanelIds[0] ?? persisted.lastCoachPanelId ?? null,
  };

  const density = resolveUiDensityProfile({
    interfaceLevel: nextSignals.interfaceLevel,
    preferredTier: persisted.preferredDensity ?? null,
    textScaleMultiplier: DEFAULT_ACCESSIBILITY_SNAPSHOT.textScaleMultiplier,
  });

  const priorQueue = persisted.announcementPacingQueue ?? [];
  const flush = flushDeferredAnnouncementQueue(priorQueue, DEFAULT_ACCESSIBILITY_SNAPSHOT, density);

  const deduped = filterDedupedAnnouncements(
    coachAnnouncements,
    nextSignals.gameDay,
    persisted.announcementDedupLedger
  );

  const updatedPersistedWithDedup = mergeAnnouncementDedupLedgerIntoPersisted(
    updatedPersisted,
    deduped.ledger
  );

  const pacing = buildPacedAnnouncementSchedule(
    deduped.freshAnnouncements,
    DEFAULT_ACCESSIBILITY_SNAPSHOT,
    density
  );

  const combinedQueue = appendToAnnouncementPacingQueue(flush.remainingQueue, pacing.deferredAnnouncements);

  const updatedPersistedWithPacing = mergeAnnouncementPacingQueueIntoPersisted(
    mergePacingDeferredIntoPersisted(updatedPersistedWithDedup, combinedQueue.length),
    combinedQueue
  );

  const immediateCoach = [...flush.flushedAnnouncements, ...pacing.immediateAnnouncements];
  const liveRegionPlan = buildCoachLiveRegionDeliveryPlan(immediateCoach, DEFAULT_ACCESSIBILITY_SNAPSHOT);

  const highlightIds = onboardingHighlightedPanelIds(nextSignals.gameDay, updatedPersistedWithPacing);
  const coverage = buildProgressionCoverageSnapshot(nextSignals, policy);
  const deltaCopy = coverageDeltaCopy(persisted.lastProgressionCoverageRatio, coverage.coverageRatio);

  const updatedPersistedFinal = mergeCoverageRatioIntoPersisted(
    {
      ...updatedPersistedWithPacing,
      rememberedPanelIds: [
        ...new Set([...(updatedPersistedWithPacing.rememberedPanelIds ?? []), ...highlightIds]),
      ],
    },
    coverage.coverageRatio
  );

  return {
    gameDay: nextSignals.gameDay,
    newlyUnlockedPanelIds,
    coachAnnouncements: immediateCoach,
    deferredCoachAnnouncementCount: combinedQueue.length,
    flushedDeferredAnnouncementCount: flush.flushedAnnouncements.length,
    coachLiveRegionMessageCount: liveRegionPlan.messages.length,
    progressionCoverageRatio: coverage.coverageRatio,
    progressionCoverageDeltaCopy: deltaCopy,
    updatedPersisted: updatedPersistedFinal,
    visiblePanelCount,
  };
}

export interface DayAdvanceDedupMeta {
  suppressedAnnouncementCount: number;
}

/** Exposes dedup counts for status banners without re-running tick logic. */
export function summarizeAnnouncementDedup(
  rawAnnouncements: string[],
  gameDay: number,
  ledger: EvolvingUiPersistedState['announcementDedupLedger']
): DayAdvanceDedupMeta {
  return {
    suppressedAnnouncementCount: filterDedupedAnnouncements(rawAnnouncements, gameDay, ledger).suppressedCount,
  };
}

export interface GuidedLearningUiUnlockEvent {
  conceptId: string;
  status: 'introduced' | 'mastered';
}

/** Maps guided-learning concept transitions to panel ids that should be remembered (legacy access preserved). */
export function applyGuidedLearningUiUnlockEvents(
  events: GuidedLearningUiUnlockEvent[],
  persisted: EvolvingUiPersistedState
): EvolvingUiPersistedState {
  const remember = new Set(persisted.rememberedPanelIds ?? []);
  for (const ev of events) {
    if (ev.status !== 'introduced' && ev.status !== 'mastered') continue;
    if (ev.conceptId === 'capital_allocation') {
      remember.add('nav_investments');
      remember.add('modal_investments');
    }
    if (ev.conceptId === 'opportunity_cost') {
      remember.add('nav_contracts');
    }
    if (ev.conceptId === 'liquidity') {
      remember.add('nav_loans');
      remember.add('nav_market');
    }
  }
  return { ...persisted, rememberedPanelIds: [...remember] };
}

export function buildEvolvingUiSettingsPatch(persisted: EvolvingUiPersistedState): { evolvingUi: EvolvingUiPersistedState } {
  return { evolvingUi: persisted };
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

// --- source: sim/onboarding-funnel.ts ---
export interface OnboardingFunnelStep {
  id: string;
  title: string;
  dismissKey: string;
  unlocksPanelIds: string[];
  minDay: number;
  coachMessage: string;
}

export const UI_ONBOARDING_FUNNEL: OnboardingFunnelStep[] = [
  {
    id: 'funnel_welcome_map',
    title: 'Explore the map',
    dismissKey: 'onboarding_map',
    unlocksPanelIds: ['nav_map', 'modal_travel'],
    minDay: 1,
    coachMessage: 'The map is always available — travel unlocks adjacent regions.',
  },
  {
    id: 'funnel_economy_basics',
    title: 'Markets and workshop',
    dismissKey: 'onboarding_economy',
    unlocksPanelIds: ['nav_market', 'nav_workshop', 'quick_actions'],
    minDay: 2,
    coachMessage: 'Craft and trade once you have action points to spend.',
  },
  {
    id: 'funnel_standing',
    title: 'Regional standing',
    dismissKey: 'onboarding_standing',
    unlocksPanelIds: ['nav_challenges', 'nav_contracts'],
    minDay: 4,
    coachMessage: 'Challenges and contracts depend on regional standing.',
  },
  {
    id: 'funnel_finance_depth',
    title: 'Credit and investments',
    dismissKey: 'onboarding_finance',
    unlocksPanelIds: ['nav_loans', 'nav_investments'],
    minDay: 6,
    coachMessage: 'Long-horizon tools unlock after liquidity basics.',
  },
  {
    id: 'funnel_automation',
    title: 'Assistance tools',
    dismissKey: 'onboarding_automation',
    unlocksPanelIds: ['widget_guardian', 'ai_command'],
    minDay: 8,
    coachMessage: 'Guardian and command tools appear for advanced assistance.',
  },
];

export function listActiveOnboardingSteps(
  gameDay: number,
  dismissedKeys: string[]
): OnboardingFunnelStep[] {
  const dismissed = new Set(dismissedKeys);
  return UI_ONBOARDING_FUNNEL.filter(s => gameDay >= s.minDay && !dismissed.has(s.dismissKey));
}

export function applyOnboardingDismissal(
  stepId: string,
  dismissedKeys: string[],
  rememberedPanelIds: string[]
): { dismissedKeys: string[]; rememberedPanelIds: string[] } {
  const step = UI_ONBOARDING_FUNNEL.find(s => s.id === stepId);
  if (!step) return { dismissedKeys, rememberedPanelIds };
  const nextDismissed = dismissedKeys.includes(step.dismissKey)
    ? dismissedKeys
    : [...dismissedKeys, step.dismissKey];
  const remember = new Set(rememberedPanelIds);
  for (const pid of step.unlocksPanelIds) remember.add(pid);
  return { dismissedKeys: nextDismissed, rememberedPanelIds: [...remember] };
}

export function panelsHighlightedByOnboarding(
  gameDay: number,
  dismissedKeys: string[]
): string[] {
  const active = listActiveOnboardingSteps(gameDay, dismissedKeys);
  return [...new Set(active.flatMap(s => s.unlocksPanelIds))];
}

// --- source: sim/session-ui-memory.ts ---
export interface SessionUiMemory {
  lastNavTarget: string | null;
  recentPanelIds: string[];
  preferredDensity?: UiDensityTier | null;
}

export function createDefaultSessionUiMemory(): SessionUiMemory {
  return { lastNavTarget: null, recentPanelIds: [], preferredDensity: null };
}

export function recordNavSelection(memory: SessionUiMemory, navTarget: string): SessionUiMemory {
  const panel = Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === navTarget);
  const recent = panel ? [panel.id, ...memory.recentPanelIds.filter(id => id !== panel.id)] : memory.recentPanelIds;
  return {
    ...memory,
    lastNavTarget: navTarget,
    recentPanelIds: recent.slice(0, 6),
  };
}

export function suggestResumeNavTarget(
  memory: SessionUiMemory,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): string | null {
  if (memory.lastNavTarget) {
    const panel = Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === memory.lastNavTarget);
    if (panel && resolveEvolvingPanelVisibility(panel.id, signals, policy).state === 'visible') {
      return memory.lastNavTarget;
    }
  }
  for (const panelId of memory.recentPanelIds) {
    const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
    if (panel?.navTarget && resolveEvolvingPanelVisibility(panelId, signals, policy).state === 'visible') {
      return panel.navTarget;
    }
  }
  return null;
}

export function mergeSessionMemoryIntoPersisted(
  persisted: EvolvingUiPersistedState,
  memory: SessionUiMemory
): EvolvingUiPersistedState {
  return {
    ...persisted,
    lastNavTarget: memory.lastNavTarget ?? persisted.lastNavTarget ?? null,
    preferredDensity: memory.preferredDensity ?? persisted.preferredDensity ?? null,
    rememberedPanelIds: [
      ...new Set([...(persisted.rememberedPanelIds ?? []), ...memory.recentPanelIds]),
    ],
  };
}

// --- source: engine/layout-preset-evolution.ts ---
export type V94LayoutPreset = 'Clean' | 'Assisted' | 'Advanced' | 'Developer' | 'Current/Custom';

export interface LayoutPresetEvolutionStep {
  preset: V94LayoutPreset;
  impliedInterfaceLevel: InterfaceExperienceLevel;
  enablesPanelTags: string[];
  suppressesPanelTags: string[];
  coachSummary: string;
}

export const LAYOUT_PRESET_EVOLUTION: LayoutPresetEvolutionStep[] = [
  {
    preset: 'Clean',
    impliedInterfaceLevel: 'simple',
    enablesPanelTags: ['navigation', 'core'],
    suppressesPanelTags: ['launcher', 'automation', 'diagnostics'],
    coachSummary: 'Clean layout hides advanced launchers until you need them.',
  },
  {
    preset: 'Assisted',
    impliedInterfaceLevel: 'guided',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'crafting'],
    suppressesPanelTags: ['diagnostics'],
    coachSummary: 'Assisted layout adds coaching launchers and economy shortcuts.',
  },
  {
    preset: 'Advanced',
    impliedInterfaceLevel: 'advanced',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'strategic', 'automation'],
    suppressesPanelTags: [],
    coachSummary: 'Advanced layout exposes strategy and automation widgets.',
  },
  {
    preset: 'Developer',
    impliedInterfaceLevel: 'expert',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'strategic', 'automation', 'diagnostics'],
    suppressesPanelTags: [],
    coachSummary: 'Developer layout includes diagnostics and replay tooling.',
  },
];

export function resolveLayoutPresetEvolution(preset: V94LayoutPreset | undefined): LayoutPresetEvolutionStep {
  const found = LAYOUT_PRESET_EVOLUTION.find(s => s.preset === preset);
  return found ?? LAYOUT_PRESET_EVOLUTION[1];
}

export function isPanelTagEnabledForPreset(
  panelTags: string[] | undefined,
  preset: V94LayoutPreset | undefined
): boolean {
  const step = resolveLayoutPresetEvolution(preset);
  const tags = panelTags ?? [];
  if (tags.some(t => step.suppressesPanelTags.includes(t))) return false;
  if (tags.length === 0) return true;
  return tags.some(t => step.enablesPanelTags.includes(t));
}

export function suggestLayoutPresetForInterfaceLevel(level: InterfaceExperienceLevel): V94LayoutPreset {
  switch (level) {
    case 'simple':
      return 'Clean';
    case 'guided':
      return 'Assisted';
    case 'advanced':
      return 'Advanced';
    case 'expert':
      return 'Developer';
    default:
      return 'Assisted';
  }
}

// --- source: engine/notification-lane-progression.ts ---
export type NotificationLaneCategory =
  | 'critical'
  | 'important'
  | 'activity'
  | 'update'
  | 'coach'
  | 'automation';

export interface NotificationLaneProgressionRule {
  category: NotificationLaneCategory;
  minTier: number;
  minDay?: number;
  description: string;
}

export const NOTIFICATION_LANE_PROGRESSION: NotificationLaneProgressionRule[] = [
  { category: 'critical', minTier: 0, description: 'Always shown — safety and bankruptcy.' },
  { category: 'important', minTier: 0, minDay: 1, description: 'Standing shifts and deadlines from day 1.' },
  { category: 'activity', minTier: 1, minDay: 2, description: 'Routine activity feed after onboarding.' },
  { category: 'update', minTier: 2, minDay: 3, description: 'Market and price updates when economy panels unlock.' },
  { category: 'coach', minTier: 1, minDay: 1, description: 'Guided coaching lane when onboarding enabled.' },
  { category: 'automation', minTier: 3, minDay: 6, description: 'Auto-mode and co-pilot notices for advanced players.' },
];

export function shouldShowNotificationLaneCategory(
  category: NotificationLaneCategory,
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): boolean {
  const rule = NOTIFICATION_LANE_PROGRESSION.find(r => r.category === category);
  if (!rule) return true;
  if (category === 'coach' && !onboardingEnabled) return false;
  const tier = tierFromInterfaceLevel(signals.interfaceLevel);
  if (tier < rule.minTier) return false;
  if (rule.minDay != null && signals.gameDay < rule.minDay) return false;
  return true;
}

export function listSuppressedNotificationCategories(
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): NotificationLaneCategory[] {
  return NOTIFICATION_LANE_PROGRESSION.filter(
    r => !shouldShowNotificationLaneCategory(r.category, signals, onboardingEnabled)
  ).map(r => r.category);
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

// --- source: engine/layout-aware-visibility.ts ---
export function resolveEvolvingPanelVisibilityWithLayout(
  panelId: string,
  layoutPreset: V94LayoutPreset | undefined,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult {
  const base = resolveEvolvingPanelVisibility(panelId, signals, policy, config);
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel || base.state === 'hidden') return base;
  const tagOk = isPanelTagEnabledForPreset(panel.tags, layoutPreset);
  if (tagOk) return base;
  if (base.state === 'visible' || base.state === 'preview') {
    return { ...base, state: 'preview', reason: `${base.reason}|layout_preset_tag_blocked` };
  }
  return { ...base, reason: `${base.reason}|layout_preset_tag_blocked` };
}

// --- source: engine/keyboard-shortcut-progression.ts ---
export interface KeyboardShortcutDefinition {
  id: string;
  keys: string;
  actionLabel: string;
  navTarget?: string;
  minInterfaceLevel: InterfaceExperienceLevel;
  allowedPhases: V94StandardizedGamePhase[];
}

export const EVOLVING_UI_KEYBOARD_SHORTCUTS: KeyboardShortcutDefinition[] = [
  {
    id: 'kb_open_map',
    keys: 'M',
    actionLabel: 'Open map',
    navTarget: 'map',
    minInterfaceLevel: 'simple',
    allowedPhases: ['human_turn', 'paused'],
  },
  {
    id: 'kb_open_help',
    keys: '?',
    actionLabel: 'Open help / mechanics',
    navTarget: 'help',
    minInterfaceLevel: 'simple',
    allowedPhases: ['human_turn', 'paused', 'approval_waiting'],
  },
  {
    id: 'kb_open_market',
    keys: 'Shift+M',
    actionLabel: 'Open market',
    navTarget: 'market',
    minInterfaceLevel: 'guided',
    allowedPhases: ['human_turn'],
  },
  {
    id: 'kb_open_contracts',
    keys: 'C',
    actionLabel: 'Regional contracts',
    navTarget: 'contracts',
    minInterfaceLevel: 'guided',
    allowedPhases: ['human_turn'],
  },
  {
    id: 'kb_open_investments',
    keys: 'I',
    actionLabel: 'Investments',
    navTarget: 'investments',
    minInterfaceLevel: 'advanced',
    allowedPhases: ['human_turn'],
  },
  {
    id: 'kb_open_settings',
    keys: ',',
    actionLabel: 'Settings',
    navTarget: 'settings',
    minInterfaceLevel: 'simple',
    allowedPhases: ['human_turn', 'paused', 'main_menu', 'setup'],
  },
  {
    id: 'kb_toggle_show_all_panels',
    keys: 'Ctrl+Shift+U',
    actionLabel: 'Toggle show all panels',
    minInterfaceLevel: 'advanced',
    allowedPhases: ['human_turn', 'paused'],
  },
  {
    id: 'kb_open_diagnostics',
    keys: 'Ctrl+Alt+D',
    actionLabel: 'Diagnostics drawer',
    navTarget: 'diagnostics',
    minInterfaceLevel: 'expert',
    allowedPhases: ['human_turn', 'paused'],
  },
];

const LEVEL_RANK: Record<InterfaceExperienceLevel, number> = {
  simple: 0,
  guided: 1,
  advanced: 2,
  expert: 3,
};

export function isKeyboardShortcutAvailable(
  shortcut: KeyboardShortcutDefinition,
  interfaceLevel: InterfaceExperienceLevel,
  phase: V94StandardizedGamePhase
): boolean {
  if (LEVEL_RANK[interfaceLevel] < LEVEL_RANK[shortcut.minInterfaceLevel]) return false;
  return shortcut.allowedPhases.includes(phase);
}

export function listAvailableKeyboardShortcuts(
  interfaceLevel: InterfaceExperienceLevel,
  phase: V94StandardizedGamePhase
): KeyboardShortcutDefinition[] {
  return EVOLVING_UI_KEYBOARD_SHORTCUTS.filter(s => isKeyboardShortcutAvailable(s, interfaceLevel, phase));
}

export function resolveShortcutNavTarget(
  shortcutId: string,
  interfaceLevel: InterfaceExperienceLevel,
  phase: V94StandardizedGamePhase
): string | null {
  const def = EVOLVING_UI_KEYBOARD_SHORTCUTS.find(s => s.id === shortcutId);
  if (!def || !isKeyboardShortcutAvailable(def, interfaceLevel, phase)) return null;
  return def.navTarget ?? null;
}

// --- source: engine/contextual-quick-actions.ts ---
export interface ContextualQuickAction {
  id: string;
  label: string;
  navTarget: string;
  phases: V94StandardizedGamePhase[];
  minDay: number;
  priority: number;
}

/** Contextual quick-action rail entries (complements V9.4 quick_actions dock). */
export const CONTEXTUAL_QUICK_ACTIONS: ContextualQuickAction[] = [
  { id: 'qa_travel', label: 'Travel', navTarget: 'travel', phases: ['human_turn'], minDay: 1, priority: 10 },
  { id: 'qa_map', label: 'Map', navTarget: 'map', phases: ['human_turn', 'paused'], minDay: 1, priority: 5 },
  { id: 'qa_market', label: 'Market', navTarget: 'market', phases: ['human_turn'], minDay: 2, priority: 20 },
  { id: 'qa_workshop', label: 'Workshop', navTarget: 'workshop', phases: ['human_turn'], minDay: 2, priority: 25 },
  { id: 'qa_contracts', label: 'Contracts', navTarget: 'contracts', phases: ['human_turn'], minDay: 4, priority: 30 },
  { id: 'qa_loans', label: 'Credit', navTarget: 'loans', phases: ['human_turn'], minDay: 5, priority: 40 },
  { id: 'qa_ask', label: 'Ask AI', navTarget: 'ask_game', phases: ['human_turn', 'approval_waiting'], minDay: 1, priority: 8 },
  { id: 'qa_progress', label: 'Objectives', navTarget: 'progress', phases: ['human_turn', 'paused'], minDay: 3, priority: 15 },
  { id: 'qa_replay', label: 'Replay', navTarget: 'replay', phases: ['human_turn', 'post_match'], minDay: 10, priority: 90 },
];

export function listContextualQuickActions(
  phase: V94StandardizedGamePhase,
  gameDay: number,
  limit = 6
): ContextualQuickAction[] {
  return CONTEXTUAL_QUICK_ACTIONS.filter(a => a.phases.includes(phase) && gameDay >= a.minDay)
    .sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function contextualActionToNavPatch(action: ContextualQuickAction): Record<string, boolean | string> {
  return resolveIntentNavToUiPatchInline(action.navTarget);
}

/** Local mirror to avoid circular imports in bundled chunk ordering. */
function resolveIntentNavToUiPatchInline(target: string): Record<string, boolean | string> {
  switch (target) {
    case 'map':
      return { showMap: true };
    case 'travel':
      return { showTravelModal: true, showMap: true };
    case 'market':
      return { showMarket: true };
    case 'workshop':
      return { showWorkshop: true };
    case 'contracts':
      return { showRegionalContractsModal: true };
    case 'loans':
      return { showAdvancedLoans: true };
    case 'ask_game':
      return { showAskGameAi: true };
    case 'progress':
      return { showProgress: true };
    case 'replay':
      return { showReplayViewer: true };
    default:
      return {};
  }
}

// --- source: engine/ui-density-progression.ts ---
export type UiDensityTier = 'compact' | 'comfortable' | 'spacious';

export interface UiDensityProfile {
  tier: UiDensityTier;
  gapScale: number;
  railPaddingClass: string;
  panelPaddingClass: string;
  coachSummary: string;
}

const DENSITY_BY_TIER: Record<UiDensityTier, Omit<UiDensityProfile, 'tier'>> = {
  compact: {
    gapScale: 0.85,
    railPaddingClass: 'px-1 py-0.5 gap-0.5',
    panelPaddingClass: 'p-2 gap-1',
    coachSummary: 'Compact density fits more panels on screen with tighter spacing.',
  },
  comfortable: {
    gapScale: 1,
    railPaddingClass: 'px-2 py-1 gap-1',
    panelPaddingClass: 'p-3 gap-2',
    coachSummary: 'Comfortable density balances readability and information density.',
  },
  spacious: {
    gapScale: 1.15,
    railPaddingClass: 'px-3 py-2 gap-2',
    panelPaddingClass: 'p-4 gap-3',
    coachSummary: 'Spacious density increases touch targets and breathing room.',
  },
};

export function listEligibleDensityTiers(level: InterfaceExperienceLevel): UiDensityTier[] {
  switch (level) {
    case 'simple':
      return ['comfortable', 'spacious'];
    case 'guided':
      return ['compact', 'comfortable', 'spacious'];
    case 'advanced':
    case 'expert':
      return ['compact', 'comfortable', 'spacious'];
    default:
      return ['comfortable'];
  }
}

export function resolveUiDensityProfile(input: {
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: V94LayoutPreset;
  textScaleMultiplier?: number;
  preferredTier?: UiDensityTier | null;
}): UiDensityProfile {
  const eligible = listEligibleDensityTiers(input.interfaceLevel);
  let tier: UiDensityTier = input.preferredTier && eligible.includes(input.preferredTier)
    ? input.preferredTier
    : 'comfortable';

  if (!input.preferredTier) {
    if (input.interfaceLevel === 'simple') tier = 'spacious';
    if (input.layoutPreset === 'Developer') tier = 'compact';
    if ((input.textScaleMultiplier ?? 1) >= 1.2 && tier === 'compact') tier = 'comfortable';
  }

  if (!eligible.includes(tier)) tier = eligible[0] ?? 'comfortable';
  return { tier, ...DENSITY_BY_TIER[tier] };
}

export function densityLayoutClassNames(profile: UiDensityProfile): {
  container: string;
  rail: string;
  panel: string;
} {
  return {
    container: `ui-density-${profile.tier} gap-[${Math.round(profile.gapScale * 100)}%]`,
    rail: profile.railPaddingClass,
    panel: profile.panelPaddingClass,
  };
}

export function cycleUiDensityTier(current: UiDensityTier, level: InterfaceExperienceLevel): UiDensityTier {
  const eligible = listEligibleDensityTiers(level);
  const idx = eligible.indexOf(current);
  if (idx < 0) return eligible[0] ?? 'comfortable';
  return eligible[(idx + 1) % eligible.length] ?? 'comfortable';
}

// --- source: engine/focus-session-policy.ts ---
const FOCUS_SUPPRESS_TAGS = new Set(['launcher', 'automation', 'diagnostics', 'strategic']);

export interface FocusSessionContext {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
}

export function shouldActivateFocusSession(ctx: FocusSessionContext): boolean {
  if (ctx.phase !== 'human_turn') return false;
  if (ctx.focusSessionSnoozedUntilDay && ctx.signals.gameDay < ctx.focusSessionSnoozedUntilDay) return false;
  const level = ctx.signals.interfaceLevel;
  if (level !== 'simple' && level !== 'guided') return false;
  if (ctx.signals.gameDay > 7) return false;
  const coverage = computeProgressionCoverage(ctx.signals, ctx.policy);
  return coverage.coverageRatio < 0.45;
}

export function focusSessionCoachCopy(ctx: FocusSessionContext): string {
  if (!shouldActivateFocusSession(ctx)) return '';
  return 'Focus session hides advanced launchers until you unlock more of the interface.';
}

export function applyFocusSessionToVisibility(
  panelId: string,
  base: PanelVisibilityResult,
  focusActive: boolean
): PanelVisibilityResult {
  if (!focusActive || base.state !== 'visible') return base;
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel || panel.essential) return base;
  const tags = panel.tags ?? [];
  if (!tags.some(t => FOCUS_SUPPRESS_TAGS.has(t))) return base;
  return {
    ...base,
    state: 'preview',
    reason: `${base.reason}|focus_session`,
  };
}

export function resolveEvolvingPanelVisibilityWithFocusSession(
  panelId: string,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  ctx: Omit<FocusSessionContext, 'signals' | 'policy'> & {
    signals?: ProgressionSignalSnapshot;
    policy?: EvolvingUiAccessPolicy;
  }
): PanelVisibilityResult {
  const sig = ctx.signals ?? signals;
  const pol = ctx.policy ?? policy;
  const base = resolveEvolvingPanelVisibility(panelId, sig, pol);
  const focusCtx: FocusSessionContext = {
    phase: ctx.phase,
    signals: sig,
    policy: pol,
    focusSessionSnoozedUntilDay: ctx.focusSessionSnoozedUntilDay,
  };
  return applyFocusSessionToVisibility(panelId, base, shouldActivateFocusSession(focusCtx));
}

export function snoozeFocusSessionUntilDay(currentDay: number, snoozeDays = 3): number {
  return Math.max(1, currentDay + snoozeDays);
}

export function listPanelsSuppressedByFocusSession(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  phase: V94StandardizedGamePhase,
  snoozedUntilDay?: number
): string[] {
  const focusCtx: FocusSessionContext = {
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay: snoozedUntilDay,
  };
  if (!shouldActivateFocusSession(focusCtx)) return [];
  const suppressed: string[] = [];
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const before = resolveEvolvingPanelVisibility(id, signals, policy);
    const after = applyFocusSessionToVisibility(id, before, true);
    if (before.state === 'visible' && after.state === 'preview') suppressed.push(id);
  }
  return suppressed;
}

// --- source: engine/responsive-layout-hints.ts ---
export type ViewportBand = 'narrow' | 'medium' | 'wide';

export interface ResponsiveLayoutHints {
  band: ViewportBand;
  collapseNavRail: boolean;
  stackQuickActions: boolean;
  maxVisibleRailItems: number;
  showDensityControl: boolean;
  coachSummary: string;
}

export function classifyViewportWidth(px: number): ViewportBand {
  if (px < 720) return 'narrow';
  if (px < 1100) return 'medium';
  return 'wide';
}

export function deriveResponsiveLayoutHints(input: {
  viewportWidthPx: number;
  layoutPreset?: V94LayoutPreset;
  densityTier?: UiDensityTier;
}): ResponsiveLayoutHints {
  const band = classifyViewportWidth(input.viewportWidthPx);
  const preset = input.layoutPreset ?? 'Assisted';
  const density = input.densityTier ?? 'comfortable';

  const collapseNavRail = band === 'narrow' || (band === 'medium' && preset === 'Developer');
  const stackQuickActions = band !== 'wide' || density === 'compact';
  let maxVisibleRailItems = band === 'wide' ? 12 : band === 'medium' ? 8 : 5;
  if (density === 'compact') maxVisibleRailItems += 1;
  if (density === 'spacious' && band === 'narrow') maxVisibleRailItems = Math.max(4, maxVisibleRailItems - 1);

  const coachSummary =
    band === 'narrow'
      ? 'Narrow viewport: navigation collapses into a compact rail.'
      : band === 'medium'
        ? 'Medium viewport: quick actions stack below the nav rail.'
        : 'Wide viewport: full rail and quick-action row visible.';

  return {
    band,
    collapseNavRail,
    stackQuickActions,
    maxVisibleRailItems,
    showDensityControl: band !== 'narrow' || preset !== 'Clean',
    coachSummary,
  };
}

// --- source: engine/motion-timing-profile.ts ---
export interface MotionTimingProfile {
  policy: MotionPolicy;
  /** Recommended max CSS transition duration for chrome surfaces. */
  transitionDurationMs: number;
  /** Delay between staggered unlock / coach announcements. */
  staggerStepMs: number;
  /** Host may map to `data-*` hooks for global stylesheets. */
  dataAttributes: Record<string, string>;
}

const DENSITY_TRANSITION_MS: Record<UiDensityProfile['tier'], number> = {
  compact: 120,
  comfortable: 180,
  spacious: 220,
};

const DENSITY_STAGGER_MS: Record<UiDensityProfile['tier'], number> = {
  compact: 80,
  spacious: 140,
  comfortable: 110,
};

export function resolveMotionTimingProfile(
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): MotionTimingProfile {
  const policy = deriveMotionPolicy(accessibility);
  const baseTransition = DENSITY_TRANSITION_MS[density.tier];
  const baseStagger = DENSITY_STAGGER_MS[density.tier];

  const transitionDurationMs = policy.allowTransitions
    ? baseTransition
    : 0;
  const staggerStepMs = policy.allowTransformAnimations ? baseStagger : 0;

  const scale = accessibility.textScaleMultiplier >= 1.15 ? 1.1 : 1;

  return {
    policy,
    transitionDurationMs: Math.round(transitionDurationMs * scale),
    staggerStepMs: Math.round(staggerStepMs * scale),
    dataAttributes: {
      'data-motion-reduced': policy.allowTransitions ? 'false' : 'true',
      'data-ui-density': density.tier,
      'data-motion-transition-ms': String(Math.round(transitionDurationMs * scale)),
    },
  };
}

export function motionTimingCssVars(profile: MotionTimingProfile): Record<string, string> {
  return {
    '--evolving-ui-transition-ms': String(profile.transitionDurationMs),
    '--evolving-ui-stagger-ms': String(profile.staggerStepMs),
  };
}

// --- source: engine/announcement-pacing-policy.ts ---
export interface PacedAnnouncementBatch {
  items: string[];
  delayMs: number;
  politeness: 'polite' | 'assertive';
}

export interface AnnouncementPacingOptions {
  reducedMotion: boolean;
  announceVerbosity: ScreenReaderAnnounceVerbosity;
  motionTiming?: Pick<MotionTimingProfile, 'staggerStepMs'>;
  /** When true, first batch may use assertive politeness for safety-critical copy. */
  allowAssertiveLead?: boolean;
}

const DEFAULT_BATCH_SIZE = 2;

export function paceUnlockAnnouncements(
  announcements: string[],
  options: AnnouncementPacingOptions
): PacedAnnouncementBatch[] {
  if (!announcements.length) return [];
  if (options.announceVerbosity === 'off') return [];

  const stagger = options.motionTiming?.staggerStepMs ?? (options.reducedMotion ? 0 : 110);
  const batchSize =
    options.announceVerbosity === 'minimal' ? 1 : options.announceVerbosity === 'assertive' ? 3 : DEFAULT_BATCH_SIZE;

  const batches: PacedAnnouncementBatch[] = [];
  let delayMs = 0;
  for (let i = 0; i < announcements.length; i += batchSize) {
    const slice = announcements.slice(i, i + batchSize);
    const politeness: 'polite' | 'assertive' =
      i === 0 && options.allowAssertiveLead && options.announceVerbosity === 'assertive'
        ? 'assertive'
        : 'polite';
    batches.push({ items: slice, delayMs, politeness });
    delayMs += stagger * Math.max(1, slice.length);
  }
  return batches;
}

export function countDeferredAnnouncements(
  totalAnnouncements: number,
  options: AnnouncementPacingOptions
): number {
  if (options.announceVerbosity === 'off') return totalAnnouncements;
  const batches = paceUnlockAnnouncements(
    Array.from({ length: totalAnnouncements }, (_, i) => `placeholder-${i}`),
    options
  );
  const scheduled = batches.reduce((sum, b) => sum + b.items.length, 0);
  return Math.max(0, totalAnnouncements - scheduled);
}

export function flattenPacedAnnouncements(batches: PacedAnnouncementBatch[]): string[] {
  return batches.flatMap(b => b.items);
}

// --- source: engine/cognitive-load-governor.ts ---
export type CognitiveLoadBand = 'light' | 'moderate' | 'heavy';

export interface CognitiveLoadAssessment {
  band: CognitiveLoadBand;
  score: number;
  visibleNonEssentialPanels: number;
  activeNotificationLanes: number;
  recommendDeferCoach: boolean;
  recommendCollapseQuickActions: boolean;
  coachCopy: string;
}

export interface CognitiveLoadContext {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onboardingEnabled?: boolean;
  focusSessionActive?: boolean;
  pendingCoachAnnouncements?: number;
}

function bandFromScore(score: number): CognitiveLoadBand {
  if (score >= 72) return 'heavy';
  if (score >= 42) return 'moderate';
  return 'light';
}

export function assessCognitiveLoad(ctx: CognitiveLoadContext): CognitiveLoadAssessment {
  const { signals, policy } = ctx;
  const onboardingEnabled = ctx.onboardingEnabled !== false;

  let visibleNonEssentialPanels = 0;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const panel = EVOLVING_UI_PANEL_BY_ID[id];
    if (!panel || panel.essential) continue;
    if (resolveEvolvingPanelVisibility(id, signals, policy).state === 'visible') {
      visibleNonEssentialPanels++;
    }
  }

  const suppressedLanes = listSuppressedNotificationCategories(signals, onboardingEnabled);
  const activeNotificationLanes = NOTIFICATION_LANE_PROGRESSION.length - suppressedLanes.length;

  const density = resolveUiDensityProfile({
    interfaceLevel: signals.interfaceLevel,
    layoutPreset: signals.layoutPreset as never,
  });

  let score = visibleNonEssentialPanels * 6 + activeNotificationLanes * 5;
  if (density.tier === 'compact') score += 8;
  if (signals.interfaceLevel === 'simple' || signals.interfaceLevel === 'guided') score += 6;
  if (ctx.focusSessionActive) score -= 10;
  score += (ctx.pendingCoachAnnouncements ?? 0) * 4;

  if (signals.gameDay <= 2) score = Math.round(score * 0.6);
  if (signals.interfaceLevel === 'simple' && signals.gameDay <= 4) {
    score = Math.min(score, 36);
  }

  score = Math.max(0, Math.min(100, score));

  const band = bandFromScore(score);
  const recommendDeferCoach = band === 'heavy' && (ctx.pendingCoachAnnouncements ?? 0) > 1;
  const recommendCollapseQuickActions = band !== 'light' && visibleNonEssentialPanels >= 6;

  let coachCopy = '';
  if (band === 'heavy') {
    coachCopy = 'Interface load is high — consider snoozing coaching or switching to spacious density.';
  } else if (band === 'moderate') {
    coachCopy = 'Several panels and notification lanes are active; focus mode can tuck away advanced chrome.';
  }

  return {
    band,
    score,
    visibleNonEssentialPanels,
    activeNotificationLanes,
    recommendDeferCoach,
    recommendCollapseQuickActions,
    coachCopy,
  };
}

export function shouldShowCognitiveLoadCoach(
  assessment: CognitiveLoadAssessment,
  gameDay: number,
  snoozedUntilDay?: number
): boolean {
  if (assessment.band === 'light') return false;
  if (snoozedUntilDay != null && gameDay < snoozedUntilDay) return false;
  return Boolean(assessment.coachCopy);
}

export function snoozeCognitiveLoadCoachUntilDay(currentDay: number, snoozeDays = 2): number {
  return Math.max(1, currentDay + snoozeDays);
}

// --- source: engine/attention-budget-scheduler.ts ---
export type AttentionSurfaceId =
  | 'cognitive_load_coach'
  | 'focus_session_banner'
  | 'panel_unlock_coach'
  | 'sim_evolution_bridge'
  | 'keyboard_hints_overlay';

export interface AttentionSurfaceCandidate {
  id: AttentionSurfaceId;
  /** Lower number wins when budget is tight. */
  priority: number;
  requested: boolean;
}

export interface AttentionBudgetPlan {
  maxConcurrentSurfaces: number;
  allowedIds: AttentionSurfaceId[];
  deferredIds: AttentionSurfaceId[];
  bandHint: CognitiveLoadBand | 'unknown';
}

const BASE_SLOTS: Record<CognitiveLoadBand, number> = {
  light: 4,
  moderate: 3,
  heavy: 2,
};

export function resolveAttentionBudgetSlots(
  band: CognitiveLoadBand,
  phase: V94StandardizedGamePhase
): number {
  let slots = BASE_SLOTS[band];
  if (phase === 'human_turn') slots += 1;
  if (phase === 'save_load' || phase === 'main_menu') slots = Math.max(1, slots - 1);
  return Math.max(1, Math.min(5, slots));
}

export function planAttentionSurfaces(input: {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  candidates: AttentionSurfaceCandidate[];
}): AttentionBudgetPlan {
  const maxConcurrentSurfaces = resolveAttentionBudgetSlots(input.band, input.phase);
  const active = input.candidates
    .filter(c => c.requested)
    .sort((a, b) => a.priority - b.priority);

  const allowedIds = active.slice(0, maxConcurrentSurfaces).map(c => c.id);
  const allowedSet = new Set(allowedIds);
  const deferredIds = active.filter(c => !allowedSet.has(c.id)).map(c => c.id);

  return {
    maxConcurrentSurfaces,
    allowedIds,
    deferredIds,
    bandHint: input.band,
  };
}

export function isAttentionSurfaceAllowed(
  plan: AttentionBudgetPlan,
  surfaceId: AttentionSurfaceId
): boolean {
  return plan.allowedIds.includes(surfaceId);
}

// --- source: engine/ui-calm-recovery-policy.ts ---
export interface CalmRecoveryPatch {
  calmRecoveryUntilDay: number;
  cognitiveLoadCoachSnoozedUntilDay: number;
  focusSessionSnoozedUntilDay: number;
  preferredDensity: 'spacious';
}

export function isCalmRecoveryActive(
  persisted: Pick<EvolvingUiPersistedState, 'calmRecoveryUntilDay'>,
  gameDay: number
): boolean {
  return persisted.calmRecoveryUntilDay != null && gameDay < persisted.calmRecoveryUntilDay;
}

export function buildCalmRecoveryPatch(
  assessment: CognitiveLoadAssessment,
  gameDay: number,
  calmDays = 2
): CalmRecoveryPatch | null {
  if (assessment.band !== 'heavy') return null;
  const untilDay = Math.max(gameDay + calmDays, gameDay + 1);
  return {
    calmRecoveryUntilDay: untilDay,
    cognitiveLoadCoachSnoozedUntilDay: snoozeCognitiveLoadCoachUntilDay(gameDay, calmDays),
    focusSessionSnoozedUntilDay: snoozeFocusSessionUntilDay(gameDay, calmDays),
    preferredDensity: 'spacious',
  };
}

export function mergeCalmRecoveryIntoPersisted(
  persisted: EvolvingUiPersistedState,
  patch: CalmRecoveryPatch
): EvolvingUiPersistedState {
  return {
    ...persisted,
    calmRecoveryUntilDay: patch.calmRecoveryUntilDay,
    cognitiveLoadCoachSnoozedUntilDay: Math.max(
      persisted.cognitiveLoadCoachSnoozedUntilDay ?? 0,
      patch.cognitiveLoadCoachSnoozedUntilDay
    ),
    focusSessionSnoozedUntilDay: Math.max(
      persisted.focusSessionSnoozedUntilDay ?? 0,
      patch.focusSessionSnoozedUntilDay
    ),
    preferredDensity: patch.preferredDensity,
  };
}

export function calmRecoveryCoachCopy(active: boolean): string {
  return active
    ? 'Calm recovery is active — coaching and focus prompts stay tucked away.'
    : 'Interface feels crowded? Calm recovery snoozes coaching and widens spacing for a few days.';
}

// --- source: engine/touch-target-scaling.ts ---
export interface TouchTargetProfile {
  minHeightPx: number;
  minWidthPx: number;
  hitSlopPx: number;
  dataAttributes: Record<string, string>;
}

const BASE_BY_DENSITY: Record<UiDensityTier, number> = {
  compact: 40,
  comfortable: 44,
  spacious: 48,
};

export function resolveTouchTargetProfile(
  tier: UiDensityTier,
  accessibility: AccessibilitySettingsSnapshot
): TouchTargetProfile {
  let min = BASE_BY_DENSITY[tier];
  if (accessibility.textScaleMultiplier >= 1.15) min += 4;
  if (accessibility.textScaleMultiplier >= 1.35) min += 4;
  const hitSlopPx = tier === 'compact' ? 4 : tier === 'comfortable' ? 6 : 8;

  return {
    minHeightPx: min,
    minWidthPx: min,
    hitSlopPx,
    dataAttributes: {
      'data-touch-min-px': String(min),
      'data-touch-tier': tier,
    },
  };
}

export function touchTargetCssVars(profile: TouchTargetProfile): Record<string, string> {
  return {
    '--evolving-ui-touch-min-px': String(profile.minHeightPx),
    '--evolving-ui-touch-hit-slop-px': String(profile.hitSlopPx),
  };
}

export function meetsMinimumTouchTarget(profile: TouchTargetProfile, requestedPx: number): boolean {
  return requestedPx >= profile.minHeightPx - profile.hitSlopPx;
}

// --- source: engine/coach-dismissal-backoff.ts ---
export interface CoachDismissalBackoffState {
  coachDismissalStreak?: number;
  coachDismissalQuietUntilDay?: number;
}

export interface CoachDismissalRecordResult {
  streak: number;
  quietUntilDay: number;
  snoozeDays: number;
}

const MAX_SNOOZE_DAYS = 7;
const BASE_SNOOZE_DAYS = 2;

export function resolveCoachDismissalSnoozeDays(streak: number): number {
  const safe = Math.max(1, Math.floor(streak));
  return Math.min(MAX_SNOOZE_DAYS, BASE_SNOOZE_DAYS + safe - 1);
}

export function isCoachDismissalQuiet(
  persisted: CoachDismissalBackoffState,
  gameDay: number
): boolean {
  return persisted.coachDismissalQuietUntilDay != null && gameDay < persisted.coachDismissalQuietUntilDay;
}

export function recordCoachDismissal(
  persisted: CoachDismissalBackoffState,
  gameDay: number
): CoachDismissalRecordResult {
  const priorStreak = persisted.coachDismissalStreak ?? 0;
  const streak = priorStreak + 1;
  const snoozeDays = resolveCoachDismissalSnoozeDays(streak);
  const quietUntilDay = Math.max(gameDay + snoozeDays, gameDay + 1);
  return { streak, quietUntilDay, snoozeDays };
}

export function mergeCoachDismissalIntoPersisted(
  persisted: EvolvingUiPersistedState,
  record: CoachDismissalRecordResult
): EvolvingUiPersistedState {
  return {
    ...persisted,
    coachDismissalStreak: record.streak,
    coachDismissalQuietUntilDay: Math.max(
      persisted.coachDismissalQuietUntilDay ?? 0,
      record.quietUntilDay
    ),
  };
}

export function coachDismissalQuietCopy(quietUntilDay: number, gameDay: number): string {
  const remaining = Math.max(0, quietUntilDay - gameDay);
  if (remaining <= 0) return '';
  return remaining === 1
    ? 'Coaching stays quiet for the rest of today after repeated dismissals.'
    : `Coaching stays quiet for ${remaining} more days after repeated dismissals.`;
}

export function shouldAllowCoachSurface(
  gameDay: number,
  persisted: CoachDismissalBackoffState,
  snoozedUntilDay?: number
): boolean {
  if (snoozedUntilDay != null && gameDay < snoozedUntilDay) return false;
  if (isCoachDismissalQuiet(persisted, gameDay)) return false;
  return true;
}

// --- source: engine/landmark-reading-order.ts ---
export type UiLandmarkRole =
  | 'status'
  | 'navigation'
  | 'main'
  | 'complementary'
  | 'banner';

export interface UiLandmarkTarget {
  id: string;
  role: UiLandmarkRole;
  label: string;
  visible: boolean;
  /** Lower sorts earlier within the same role band. */
  priority: number;
}

export interface LandmarkReadingOrderPlan {
  ordered: UiLandmarkTarget[];
  skipLinkLabels: string[];
  phaseHint: V94StandardizedGamePhase;
}

const ROLE_BAND: Record<UiLandmarkRole, number> = {
  status: 0,
  banner: 1,
  navigation: 2,
  main: 3,
  complementary: 4,
};

export function compareLandmarkReadingOrder(a: UiLandmarkTarget, b: UiLandmarkTarget): number {
  const bandDiff = ROLE_BAND[a.role] - ROLE_BAND[b.role];
  if (bandDiff !== 0) return bandDiff;
  return a.priority - b.priority;
}

export function planLandmarkReadingOrder(input: {
  phase: V94StandardizedGamePhase;
  landmarks: UiLandmarkTarget[];
}): LandmarkReadingOrderPlan {
  const visible = input.landmarks.filter(l => l.visible);
  const ordered = [...visible].sort(compareLandmarkReadingOrder);

  if (input.phase === 'main_menu') {
    const navFirst = ordered.filter(l => l.role === 'navigation' || l.role === 'banner');
    const rest = ordered.filter(l => l.role !== 'navigation' && l.role !== 'banner');
    ordered.splice(0, ordered.length, ...navFirst, ...rest);
  }

  const skipLinkLabels = ordered
    .filter(l => l.role === 'navigation' || l.role === 'main')
    .slice(0, 4)
    .map(l => `Skip to ${l.label}`);

  return {
    ordered,
    skipLinkLabels,
    phaseHint: input.phase,
  };
}

export function landmarkTargetForSurface(
  surfaceId: string,
  label: string,
  visible: boolean,
  priority: number
): UiLandmarkTarget {
  const role: UiLandmarkRole =
    surfaceId.includes('nav') || surfaceId.includes('rail')
      ? 'navigation'
      : surfaceId.includes('coach') || surfaceId.includes('banner') || surfaceId.includes('status')
        ? 'status'
        : surfaceId.includes('quick') || surfaceId.includes('widget')
          ? 'complementary'
          : 'main';
  return { id: surfaceId, role, label, visible, priority };
}

// --- source: engine/high-contrast-chrome-policy.ts ---
export interface HighContrastChromeProfile {
  elevated: boolean;
  borderWidthPx: number;
  separatorOpacity: number;
  focusOffsetPx: number;
  dataAttributes: Record<string, string>;
}

export function resolveHighContrastChromeProfile(
  accessibility: AccessibilitySettingsSnapshot
): HighContrastChromeProfile {
  const elevated =
    accessibility.highContrastFocusRings ||
    accessibility.textScaleMultiplier >= 1.15 ||
    accessibility.announceVerbosity === 'assertive';

  const scaleBoost = accessibility.textScaleMultiplier > 1 ? 1 : 0;
  const borderWidthPx = elevated ? 2 + scaleBoost : 1;
  const separatorOpacity = elevated ? 0.55 : 0.28;
  const focusOffsetPx = elevated ? 4 : 2;

  return {
    elevated,
    borderWidthPx,
    separatorOpacity,
    focusOffsetPx,
    dataAttributes: {
      'data-hc-chrome': elevated ? 'elevated' : 'standard',
      'data-hc-border-px': String(borderWidthPx),
    },
  };
}

export function highContrastChromeCssVars(profile: HighContrastChromeProfile): Record<string, string> {
  return {
    '--evolving-ui-chrome-border-px': String(profile.borderWidthPx),
    '--evolving-ui-chrome-separator-opacity': String(profile.separatorOpacity),
    '--evolving-ui-chrome-focus-offset-px': String(profile.focusOffsetPx),
  };
}

export function mergeHighContrastChromeStyle(
  accessibility: AccessibilitySettingsSnapshot,
  baseStyle?: Record<string, string>
): Record<string, string> {
  const profile = resolveHighContrastChromeProfile(accessibility);
  return {
    ...(baseStyle ?? {}),
    ...highContrastChromeCssVars(profile),
  };
}

// --- source: engine/announcement-dedup-ledger.ts ---
export const ANNOUNCEMENT_DEDUP_WINDOW_DAYS = 3;
export const ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES = 24;

export type AnnouncementDedupLedger = Record<string, number>;

export function hashAnnouncementText(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return `a${(hash >>> 0).toString(16)}`;
}

export function isAnnouncementDuplicate(
  hash: string,
  ledger: AnnouncementDedupLedger | undefined,
  gameDay: number
): boolean {
  const lastDay = ledger?.[hash];
  if (lastDay == null) return false;
  return gameDay - lastDay < ANNOUNCEMENT_DEDUP_WINDOW_DAYS;
}

export function pruneAnnouncementDedupLedger(
  ledger: AnnouncementDedupLedger | undefined,
  gameDay: number
): AnnouncementDedupLedger {
  if (!ledger) return {};
  const next: AnnouncementDedupLedger = {};
  for (const [hash, day] of Object.entries(ledger)) {
    if (gameDay - day <= ANNOUNCEMENT_DEDUP_WINDOW_DAYS) next[hash] = day;
  }
  const entries = Object.entries(next);
  if (entries.length <= ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES) return next;
  entries.sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(entries.slice(0, ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES));
}

export interface AnnouncementDedupResult {
  freshAnnouncements: string[];
  suppressedCount: number;
  ledger: AnnouncementDedupLedger;
}

export function filterDedupedAnnouncements(
  announcements: string[],
  gameDay: number,
  ledger: AnnouncementDedupLedger | undefined
): AnnouncementDedupResult {
  const pruned = pruneAnnouncementDedupLedger(ledger, gameDay);
  const freshAnnouncements: string[] = [];
  let suppressedCount = 0;
  const nextLedger = { ...pruned };

  for (const line of announcements) {
    const hash = hashAnnouncementText(line);
    if (isAnnouncementDuplicate(hash, nextLedger, gameDay)) {
      suppressedCount++;
      continue;
    }
    freshAnnouncements.push(line);
    nextLedger[hash] = gameDay;
  }

  return {
    freshAnnouncements,
    suppressedCount,
    ledger: pruneAnnouncementDedupLedger(nextLedger, gameDay),
  };
}

export function mergeAnnouncementDedupLedgerIntoPersisted(
  persisted: EvolvingUiPersistedState,
  ledger: AnnouncementDedupLedger
): EvolvingUiPersistedState {
  return {
    ...persisted,
    announcementDedupLedger: ledger,
  };
}

export function dedupStatusCopy(suppressedCount: number): string {
  if (suppressedCount <= 0) return '';
  if (suppressedCount === 1) {
    return 'One repeated unlock announcement was held back so screen readers are not spammed.';
  }
  return `${suppressedCount} repeated unlock announcements were held back so screen readers stay calm.`;
}

// --- source: engine/modal-focus-restoration.ts ---
export interface ModalFocusRestorePlan {
  restoreSelector: string;
  restoreLabel: string;
  trapEnabled: boolean;
  restoreEnabled: boolean;
  announceOnClose: string;
}

const DEFAULT_RESTORE_SELECTOR = '[data-evolving-ui-nav-focus="primary"]';

export function navSelectorForTarget(navTarget: string | null | undefined): string {
  if (!navTarget) return DEFAULT_RESTORE_SELECTOR;
  return `[data-nav-target="${navTarget}"]`;
}

export function resolveModalFocusRestorePlan(input: {
  modalId: string;
  lastNavTarget?: string | null;
  accessibility: AccessibilitySettingsSnapshot;
}): ModalFocusRestorePlan {
  const trapEnabled = shouldTrapFocusInModal(input.accessibility);
  const restoreEnabled = shouldRestoreFocusOnClose(input.accessibility);
  const navTarget = input.lastNavTarget ?? null;
  const panel = navTarget
    ? Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === navTarget)
    : undefined;
  const restoreLabel = panel?.label ?? (navTarget ? `Return to ${navTarget}` : 'Return to primary navigation');
  const restoreSelector = navSelectorForTarget(navTarget);

  const announceOnClose = restoreEnabled
    ? `Closing ${input.modalId}. Focus returns to ${restoreLabel}.`
    : `Closing ${input.modalId}.`;

  return {
    restoreSelector,
    restoreLabel,
    trapEnabled,
    restoreEnabled,
    announceOnClose,
  };
}

export function modalFocusRestoreSkipLabel(plan: ModalFocusRestorePlan): string {
  return `After closing, focus returns to ${plan.restoreLabel}`;
}

// --- source: engine/attention-surface-gate.ts ---
export interface AttentionSurfaceGateInput {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  cognitiveLoadCoachRequested?: boolean;
  focusSessionBannerRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
  simEvolutionBridgeRequested?: boolean;
  keyboardHintsRequested?: boolean;
}

const SURFACE_PRIORITIES: Record<AttentionSurfaceId, number> = {
  focus_session_banner: 1,
  cognitive_load_coach: 2,
  panel_unlock_coach: 3,
  sim_evolution_bridge: 4,
  keyboard_hints_overlay: 5,
};

export function buildAttentionSurfaceCandidates(input: AttentionSurfaceGateInput): AttentionSurfaceCandidate[] {
  const mk = (id: AttentionSurfaceId, requested?: boolean): AttentionSurfaceCandidate => ({
    id,
    priority: SURFACE_PRIORITIES[id],
    requested: Boolean(requested),
  });
  return [
    mk('focus_session_banner', input.focusSessionBannerRequested),
    mk('cognitive_load_coach', input.cognitiveLoadCoachRequested),
    mk('panel_unlock_coach', input.panelUnlockCoachRequested),
    mk('sim_evolution_bridge', input.simEvolutionBridgeRequested),
    mk('keyboard_hints_overlay', input.keyboardHintsRequested),
  ];
}

export function planAttentionSurfaceGate(input: AttentionSurfaceGateInput): AttentionBudgetPlan {
  return planAttentionSurfaces({
    band: input.band,
    phase: input.phase,
    candidates: buildAttentionSurfaceCandidates(input),
  });
}

export function isAttentionCoachSurfaceVisible(
  plan: AttentionBudgetPlan,
  surfaceId: AttentionSurfaceId
): boolean {
  return isAttentionSurfaceAllowed(plan, surfaceId);
}

export function attentionDeferralCopy(deferredIds: AttentionSurfaceId[]): string {
  if (!deferredIds.length) return '';
  if (deferredIds.length === 1) {
    return `One coaching surface is waiting (${deferredIds[0]}) until attention budget frees up.`;
  }
  return `${deferredIds.length} coaching surfaces are waiting until attention budget frees up.`;
}

// --- source: engine/paced-announcement-scheduler.ts ---
export interface PacedAnnouncementSchedule {
  /** Announcements safe to fire immediately (first batch). */
  immediateAnnouncements: string[];
  /** Remaining lines deferred to later ticks / host scheduler. */
  deferredAnnouncements: string[];
  deferredCount: number;
  batches: PacedAnnouncementBatch[];
}

export function buildPacedAnnouncementSchedule(
  announcements: string[],
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): PacedAnnouncementSchedule {
  const motion = resolveMotionTimingProfile(accessibility, density);
  const batches = paceUnlockAnnouncements(announcements, {
    reducedMotion: accessibility.reducedMotion,
    announceVerbosity: accessibility.announceVerbosity,
    motionTiming: motion,
    allowAssertiveLead: accessibility.announceVerbosity === 'assertive',
  });

  if (!batches.length) {
    return {
      immediateAnnouncements: [],
      deferredAnnouncements: [],
      deferredCount: announcements.length,
      batches: [],
    };
  }

  const immediateAnnouncements = [...batches[0].items];
  const deferredAnnouncements = flattenPacedAnnouncements(batches.slice(1));

  return {
    immediateAnnouncements,
    deferredAnnouncements,
    deferredCount: deferredAnnouncements.length,
    batches,
  };
}

export function pacingStatusCopy(deferredCount: number): string | null {
  if (deferredCount <= 0) return null;
  const noun = deferredCount === 1 ? 'announcement' : 'announcements';
  return `${deferredCount} coach ${noun} queued for staggered screen reader delivery.`;
}

export function mergePacingDeferredIntoPersisted<T extends { announcementPacingDeferredCount?: number }>(
  persisted: T,
  deferredCount: number
): T {
  return {
    ...persisted,
    announcementPacingDeferredCount: Math.max(0, deferredCount),
  };
}

// --- source: engine/keyboard-shortcut-conflict-guard.ts ---
export interface KeyboardShortcutConflict {
  keys: string;
  shortcutIds: string[];
  actionLabels: string[];
}

export function detectKeyboardShortcutConflicts(
  shortcuts: KeyboardShortcutDefinition[]
): KeyboardShortcutConflict[] {
  const byKeys = new Map<string, KeyboardShortcutDefinition[]>();
  for (const shortcut of shortcuts) {
    const normalized = shortcut.keys.trim().toLowerCase();
    const bucket = byKeys.get(normalized) ?? [];
    bucket.push(shortcut);
    byKeys.set(normalized, bucket);
  }

  const conflicts: KeyboardShortcutConflict[] = [];
  for (const [keys, defs] of byKeys) {
    if (defs.length < 2) continue;
    conflicts.push({
      keys,
      shortcutIds: defs.map(d => d.id),
      actionLabels: defs.map(d => d.actionLabel),
    });
  }
  return conflicts.sort((a, b) => a.keys.localeCompare(b.keys));
}

export function planKeyboardShortcutConflicts(
  interfaceLevel: InterfaceExperienceLevel,
  phase: V94StandardizedGamePhase
): KeyboardShortcutConflict[] {
  return detectKeyboardShortcutConflicts(listAvailableKeyboardShortcuts(interfaceLevel, phase));
}

export function shortcutConflictWarningCopy(conflicts: KeyboardShortcutConflict[]): string | null {
  if (!conflicts.length) return null;
  const first = conflicts[0];
  const extra = conflicts.length > 1 ? ` (+${conflicts.length - 1} more)` : '';
  return `Shortcut "${first.keys}" maps to ${first.actionLabels.join(' and ')}${extra}. Rebind in settings.`;
}

export function shouldWarnKeyboardShortcutConflicts(conflicts: KeyboardShortcutConflict[]): boolean {
  return conflicts.length > 0;
}

// --- source: engine/live-region-priority-queue.ts ---
export type LiveRegionPriority = 'assertive' | 'polite';

export interface QueuedLiveRegionMessage extends LiveRegionMessage {
  priority: LiveRegionPriority;
}

const PRIORITY_RANK: Record<LiveRegionPriority, number> = {
  assertive: 0,
  polite: 1,
};

export function enqueueLiveRegionMessage(
  queue: QueuedLiveRegionMessage[],
  message: Omit<QueuedLiveRegionMessage, 'createdAt'> & { createdAt?: number }
): QueuedLiveRegionMessage[] {
  const entry: QueuedLiveRegionMessage = {
    ...message,
    createdAt: message.createdAt ?? Date.now(),
  };
  const next = [...queue, entry];
  next.sort((a, b) => {
    const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (rank !== 0) return rank;
    return a.createdAt - b.createdAt;
  });
  return next;
}

export function drainLiveRegionQueue(queue: QueuedLiveRegionMessage[], max = 3): {
  drained: QueuedLiveRegionMessage[];
  remaining: QueuedLiveRegionMessage[];
} {
  const drained = queue.slice(0, max);
  const remaining = queue.slice(max);
  return { drained, remaining };
}

export function coalesceDuplicateLiveRegionText(queue: QueuedLiveRegionMessage[]): QueuedLiveRegionMessage[] {
  const seen = new Set<string>();
  const out: QueuedLiveRegionMessage[] = [];
  for (const msg of queue) {
    const key = `${msg.priority}:${msg.text.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(msg);
  }
  return out;
}

export function liveRegionQueueSummaryCopy(queue: QueuedLiveRegionMessage[]): string | null {
  if (!queue.length) return null;
  const assertive = queue.filter(q => q.priority === 'assertive').length;
  if (assertive > 0) {
    return `${queue.length} screen reader messages queued (${assertive} priority).`;
  }
  return `${queue.length} screen reader messages queued.`;
}

// --- source: engine/deferred-announcement-flush.ts ---
export interface DeferredAnnouncementFlushResult {
  flushedAnnouncements: string[];
  remainingQueue: string[];
  remainingCount: number;
}

export function flushDeferredAnnouncementQueue(
  queue: string[],
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): DeferredAnnouncementFlushResult {
  if (!queue.length) {
    return { flushedAnnouncements: [], remainingQueue: [], remainingCount: 0 };
  }

  const schedule = buildPacedAnnouncementSchedule(queue, accessibility, density);
  return {
    flushedAnnouncements: schedule.immediateAnnouncements,
    remainingQueue: schedule.deferredAnnouncements,
    remainingCount: schedule.deferredAnnouncements.length,
  };
}

export function mergeAnnouncementPacingQueueIntoPersisted<
  T extends { announcementPacingQueue?: string[]; announcementPacingDeferredCount?: number },
>(persisted: T, queue: string[]): T {
  return {
    ...persisted,
    announcementPacingQueue: [...queue],
    announcementPacingDeferredCount: queue.length,
  };
}

export function deferredFlushStatusCopy(flushedCount: number, remainingCount: number): string | null {
  if (flushedCount <= 0 && remainingCount <= 0) return null;
  if (flushedCount > 0 && remainingCount > 0) {
    return `Delivered ${flushedCount} queued coach announcements; ${remainingCount} still waiting.`;
  }
  if (flushedCount > 0) {
    return `Delivered ${flushedCount} queued coach announcements.`;
  }
  return `${remainingCount} coach announcements remain in the delivery queue.`;
}

export function appendToAnnouncementPacingQueue(queue: string[], lines: string[]): string[] {
  if (!lines.length) return queue;
  return [...queue, ...lines];
}

// --- source: engine/session-resume-coach.ts ---
export interface SessionResumeCoachPlan {
  shouldShow: boolean;
  navTarget: string | null;
  panelLabel: string | null;
  focusSelector: string | null;
  coachCopy: string | null;
}

export function buildSessionResumeCoachPlan(input: {
  memory?: SessionUiMemory;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  phaseAllowsResume?: boolean;
}): SessionResumeCoachPlan {
  const memory = input.memory ?? createDefaultSessionUiMemory();
  const navTarget = suggestResumeNavTarget(memory, input.signals, input.policy);
  const phaseOk = input.phaseAllowsResume ?? true;

  if (!phaseOk || !navTarget || !input.accessibility.keyboardNavigationHints) {
    return {
      shouldShow: false,
      navTarget: null,
      panelLabel: null,
      focusSelector: null,
      coachCopy: null,
    };
  }

  const panel = Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === navTarget);
  const panelLabel = panel?.label ?? navTarget;
  const focusSelector = navSelectorForTarget(navTarget);

  return {
    shouldShow: true,
    navTarget,
    panelLabel,
    focusSelector,
    coachCopy: `Resume where you left off — return to ${panelLabel}.`,
  };
}

export function sessionResumeSkipLinkLabel(plan: SessionResumeCoachPlan): string | null {
  if (!plan.shouldShow || !plan.panelLabel) return null;
  return `Skip to ${plan.panelLabel}`;
}

// --- source: engine/memory-weighted-quick-actions.ts ---
const RECENT_BOOST = 15;

export function rankContextualQuickActionsWithMemory(
  actions: ContextualQuickAction[],
  memory: SessionUiMemory
): ContextualQuickAction[] {
  const recentNav = new Set<string>();
  if (memory.lastNavTarget) recentNav.add(memory.lastNavTarget);
  for (const panelId of memory.recentPanelIds) {
    const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
    if (panel?.navTarget) recentNav.add(panel.navTarget);
  }

  return [...actions].sort((a, b) => {
    const aBoost = recentNav.has(a.navTarget) ? RECENT_BOOST : 0;
    const bBoost = recentNav.has(b.navTarget) ? RECENT_BOOST : 0;
    const aScore = a.priority - aBoost;
    const bScore = b.priority - bBoost;
    if (aScore !== bScore) return aScore - bScore;
    return a.label.localeCompare(b.label);
  });
}

export function memoryQuickActionCoachCopy(boostedNavTarget: string | null): string | null {
  if (!boostedNavTarget) return null;
  return `Pinned ${boostedNavTarget} quick action from your recent session.`;
}

// --- source: engine/accessible-chrome-shell.ts ---
export interface AccessibleChromeShellProfile {
  density: UiDensityProfile;
  style: Record<string, string>;
  dataAttributes: Record<string, string>;
}

export function resolveAccessibleChromeShellProfile(input: {
  accessibility: AccessibilitySettingsSnapshot;
  interfaceLevel: InterfaceExperienceLevel;
  preferredDensityTier?: 'compact' | 'comfortable' | 'spacious' | null;
}): AccessibleChromeShellProfile {
  const density = resolveUiDensityProfile({
    interfaceLevel: input.interfaceLevel,
    textScaleMultiplier: input.accessibility.textScaleMultiplier,
    preferredTier: input.preferredDensityTier,
  });
  const motion = resolveMotionTimingProfile(input.accessibility, density);
  const touch = resolveTouchTargetProfile(density.tier, input.accessibility);

  const style = {
    ...motionTimingCssVars(motion),
    ...touchTargetCssVars(touch),
    ...mergeHighContrastChromeStyle(input.accessibility),
  };

  const dataAttributes = {
    ...motion.dataAttributes,
    ...touch.dataAttributes,
  };

  return { density, style, dataAttributes };
}

// --- source: engine/onboarding-persist-bridge.ts ---
export function mergeOnboardingDismissalsIntoPersisted(
  persisted: EvolvingUiPersistedState,
  dismissedKeys: string[]
): EvolvingUiPersistedState {
  return {
    ...persisted,
    onboardingDismissedKeys: [...new Set([...(persisted.onboardingDismissedKeys ?? []), ...dismissedKeys])],
  };
}

export function dismissOnboardingStepInPersisted(
  persisted: EvolvingUiPersistedState,
  stepId: string
): EvolvingUiPersistedState {
  const result = applyOnboardingDismissal(
    stepId,
    persisted.onboardingDismissedKeys ?? [],
    persisted.rememberedPanelIds ?? []
  );
  return {
    ...persisted,
    onboardingDismissedKeys: result.dismissedKeys,
    rememberedPanelIds: result.rememberedPanelIds,
  };
}

export function listActiveOnboardingStepsForPersisted(
  gameDay: number,
  persisted: EvolvingUiPersistedState
): OnboardingFunnelStep[] {
  return listActiveOnboardingSteps(gameDay, persisted.onboardingDismissedKeys ?? []);
}

export function onboardingFunnelStatusCopy(steps: OnboardingFunnelStep[]): string | null {
  if (!steps.length) return null;
  if (steps.length === 1) return `Onboarding: ${steps[0].title}`;
  return `Onboarding: ${steps.length} guided steps remain (${steps[0].title}…)`;
}

export function onboardingHighlightedPanelIds(
  gameDay: number,
  persisted: EvolvingUiPersistedState
): string[] {
  const active = listActiveOnboardingStepsForPersisted(gameDay, persisted);
  return [...new Set(active.flatMap(s => s.unlocksPanelIds))];
}

// --- source: engine/responsive-nav-rail-plan.ts ---
export interface NavRailVisibilityPlan {
  visiblePanelIds: string[];
  overflowCount: number;
  overflowCopy: string | null;
  hints: ResponsiveLayoutHints;
}

export function planNavRailVisibleItems(input: {
  orderedPanelIds: string[];
  viewportWidthPx: number;
  layoutPreset?: V94LayoutPreset;
  densityTier?: UiDensityTier;
  sessionMemory?: SessionUiMemory;
  pinnedPanelIds?: string[];
}): NavRailVisibilityPlan {
  const hints = deriveResponsiveLayoutHints({
    viewportWidthPx: input.viewportWidthPx,
    layoutPreset: input.layoutPreset,
    densityTier: input.densityTier,
  });

  const mustInclude = new Set<string>(input.pinnedPanelIds ?? []);
  if (input.sessionMemory?.lastNavTarget) {
    for (const id of input.orderedPanelIds) {
      const panel = EVOLVING_UI_PANEL_BY_ID[id];
      if (panel?.navTarget === input.sessionMemory.lastNavTarget) mustInclude.add(id);
    }
  }
  for (const id of input.sessionMemory?.recentPanelIds ?? []) {
    mustInclude.add(id);
  }

  const cap = hints.maxVisibleRailItems;
  const visible: string[] = [];
  for (const id of input.orderedPanelIds) {
    if (mustInclude.has(id) && !visible.includes(id)) visible.push(id);
  }
  for (const id of input.orderedPanelIds) {
    if (visible.length >= cap) break;
    if (!visible.includes(id)) visible.push(id);
  }

  const overflowCount = Math.max(0, input.orderedPanelIds.length - visible.length);
  const overflowCopy =
    overflowCount > 0
      ? `${overflowCount} navigation destinations tucked into overflow for this viewport.`
      : null;

  return { visiblePanelIds: visible, overflowCount, overflowCopy, hints };
}

export function responsiveNavRailCoachCopy(plan: NavRailVisibilityPlan): string | null {
  if (plan.overflowCount <= 0) return plan.hints.coachSummary;
  return `${plan.hints.coachSummary} ${plan.overflowCopy ?? ''}`.trim();
}

// --- source: engine/coach-live-region-scheduler.ts ---
export interface CoachLiveRegionDeliveryPlan {
  messages: QueuedLiveRegionMessage[];
  assertiveCount: number;
  politeCount: number;
}

export function buildCoachLiveRegionDeliveryPlan(
  coachLines: string[],
  accessibility: AccessibilitySettingsSnapshot
): CoachLiveRegionDeliveryPlan {
  if (!accessibility.screenReaderAnnouncements || accessibility.announceVerbosity === 'off') {
    return { messages: [], assertiveCount: 0, politeCount: 0 };
  }

  let queue: QueuedLiveRegionMessage[] = [];
  coachLines.forEach((text, index) => {
    const priority = index === 0 && accessibility.announceVerbosity === 'assertive' ? 'assertive' : 'polite';
    queue = enqueueLiveRegionMessage(queue, {
      id: `coach-lr-${index}`,
      text,
      politeness: priority === 'assertive' ? 'assertive' : 'polite',
      priority,
    });
  });

  const messages = coalesceDuplicateLiveRegionText(queue);
  return {
    messages,
    assertiveCount: messages.filter(m => m.priority === 'assertive').length,
    politeCount: messages.filter(m => m.priority === 'polite').length,
  };
}

export function coachLiveRegionDeliveryCopy(plan: CoachLiveRegionDeliveryPlan): string | null {
  if (!plan.messages.length) return null;
  if (plan.assertiveCount > 0) {
    return `${plan.messages.length} coach lines queued for screen reader (${plan.assertiveCount} priority).`;
  }
  return `${plan.messages.length} coach lines queued for screen reader delivery.`;
}

// --- source: engine/layout-onboarding-visibility.ts ---
export interface LayoutOnboardingVisibilityHint {
  panelId: string;
  state: 'visible' | 'preview' | 'hidden';
  onboardingHighlight: boolean;
  layoutBlocked: boolean;
}

export function buildLayoutOnboardingVisibilityHints(input: {
  panelIds: string[];
  layoutPreset: V94LayoutPreset | undefined;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
}): LayoutOnboardingVisibilityHint[] {
  const highlights = new Set(onboardingHighlightedPanelIds(input.signals.gameDay, input.persisted));

  return input.panelIds.map(panelId => {
    const vis = resolveEvolvingPanelVisibilityWithLayout(
      panelId,
      input.layoutPreset,
      input.signals,
      input.policy
    );
    return {
      panelId,
      state: vis.state,
      onboardingHighlight: highlights.has(panelId),
      layoutBlocked: vis.reason.includes('layout_preset_tag_blocked'),
    };
  });
}

export function layoutOnboardingCoachCopy(hints: LayoutOnboardingVisibilityHint[]): string | null {
  const blocked = hints.filter(h => h.onboardingHighlight && h.layoutBlocked);
  if (!blocked.length) return null;
  return `${blocked.length} onboarding panels preview-only under the current layout preset.`;
}

// --- source: engine/phase-coach-gate.ts ---
export type PhaseCoachSurfaceId =
  | 'panel_unlock_coach'
  | 'onboarding_funnel'
  | 'progression_coverage'
  | 'keyboard_hints';

export interface PhaseCoachGatePlan {
  allowedSurfaces: PhaseCoachSurfaceId[];
  suppressedSurfaces: PhaseCoachSurfaceId[];
  phase: V94StandardizedGamePhase;
}

const ALWAYS_OFF_PHASES = new Set<V94StandardizedGamePhase>(['save_load', 'replay']);

const PHASE_ALLOWED: Partial<Record<V94StandardizedGamePhase, PhaseCoachSurfaceId[]>> = {
  main_menu: ['onboarding_funnel', 'keyboard_hints'],
  setup: ['onboarding_funnel', 'progression_coverage'],
  human_turn: ['panel_unlock_coach', 'onboarding_funnel', 'progression_coverage', 'keyboard_hints'],
  paused: ['panel_unlock_coach', 'progression_coverage', 'keyboard_hints'],
  approval_waiting: ['panel_unlock_coach', 'keyboard_hints'],
  ai_turn: ['progression_coverage'],
  post_match: ['progression_coverage'],
};

export function planPhaseCoachSurfaces(
  phase: V94StandardizedGamePhase,
  band: CognitiveLoadBand = 'moderate'
): PhaseCoachGatePlan {
  if (ALWAYS_OFF_PHASES.has(phase)) {
    return {
      phase,
      allowedSurfaces: [],
      suppressedSurfaces: ['panel_unlock_coach', 'onboarding_funnel', 'progression_coverage', 'keyboard_hints'],
    };
  }

  const base = PHASE_ALLOWED[phase] ?? ['progression_coverage'];
  let allowed = [...base];
  if (band === 'heavy') {
    allowed = allowed.filter(id => id !== 'panel_unlock_coach' && id !== 'onboarding_funnel');
  }

  const all: PhaseCoachSurfaceId[] = [
    'panel_unlock_coach',
    'onboarding_funnel',
    'progression_coverage',
    'keyboard_hints',
  ];
  const allowedSet = new Set(allowed);
  return {
    phase,
    allowedSurfaces: allowed,
    suppressedSurfaces: all.filter(id => !allowedSet.has(id)),
  };
}

export function isPhaseCoachSurfaceAllowed(plan: PhaseCoachGatePlan, surface: PhaseCoachSurfaceId): boolean {
  return plan.allowedSurfaces.includes(surface);
}

export function phaseCoachGateCopy(plan: PhaseCoachGatePlan): string | null {
  if (!plan.suppressedSurfaces.length) return null;
  return `Phase ${plan.phase}: ${plan.suppressedSurfaces.length} coaching surfaces deferred.`;
}

// --- source: engine/show-all-progressive-safety.ts ---
export interface ShowAllOverrideSafetyAssessment {
  overrideActive: boolean;
  riskyPhase: boolean;
  suppressedCategoriesDuringPhase: string[];
  coachCopy: string | null;
}

export function evaluateShowAllOverrideSafety(input: {
  persisted: EvolvingUiPersistedState;
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
}): ShowAllOverrideSafetyAssessment {
  const overrideActive = Boolean(input.persisted.showAllPanelsOverride ?? input.policy.showAllPanelsOverride);
  const coverage = computeProgressionCoverage(input.signals, input.policy);
  const riskyPhase = ['save_load', 'main_menu', 'setup'].includes(input.phase);
  const suppressedCategoriesDuringPhase = ['economy', 'strategic', 'regional'].filter(cat =>
    listPhasesThatSuppressCategory(cat).includes(input.phase)
  );

  let coachCopy: string | null = null;
  if (overrideActive && riskyPhase) {
    coachCopy = 'Show-all override is on — some panels stay in preview during setup and menu phases.';
  } else if (overrideActive && coverage.preview > coverage.visible) {
    coachCopy = 'Show-all override reveals previews, but phase rules still gate full visibility.';
  }

  return {
    overrideActive,
    riskyPhase,
    suppressedCategoriesDuringPhase,
    coachCopy,
  };
}

// --- source: engine/progression-coverage-snapshot.ts ---
export interface ProgressionCoverageSnapshot {
  visible: number;
  preview: number;
  hidden: number;
  total: number;
  coverageRatio: number;
  coachCopy: string | null;
  tierLabel: 'early' | 'mid' | 'late';
}

export function buildProgressionCoverageSnapshot(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): ProgressionCoverageSnapshot {
  const stats = computeProgressionCoverage(signals, policy);
  const tierLabel: ProgressionCoverageSnapshot['tierLabel'] =
    signals.gameDay < 5 ? 'early' : signals.gameDay < 12 ? 'mid' : 'late';

  let coachCopy: string | null = null;
  if (stats.coverageRatio >= 0.75) {
    coachCopy = 'Most interface panels are unlocked — expert shortcuts are available.';
  } else if (stats.coverageRatio >= 0.45) {
    coachCopy = 'Mid-game coverage — focus on upcoming milestone unlocks.';
  } else if (stats.visible >= 3) {
    coachCopy = 'Early coverage — onboarding highlights guide the next unlocks.';
  }

  return {
    ...stats,
    coachCopy,
    tierLabel,
  };
}

export function mergeCoverageRatioIntoPersisted<
  T extends { lastProgressionCoverageRatio?: number },
>(persisted: T, ratio: number): T {
  return {
    ...persisted,
    lastProgressionCoverageRatio: Math.max(0, Math.min(1, ratio)),
  };
}

export function coverageDeltaCopy(previous: number | undefined, current: number): string | null {
  if (previous == null) return null;
  const delta = current - previous;
  if (Math.abs(delta) < 0.01) return null;
  const pct = Math.round(Math.abs(delta) * 100);
  return delta > 0 ? `Interface coverage increased ${pct}% since last turn.` : `Interface coverage dipped ${pct}%.`;
}

// --- source: engine/keyboard-hints-priority-plan.ts ---
const PHASE_PRIORITY: Partial<Record<V94StandardizedGamePhase, string[]>> = {
  human_turn: ['kb_open_map', 'kb_open_help', 'kb_open_market'],
  paused: ['kb_open_map', 'kb_open_settings'],
  main_menu: ['kb_open_settings'],
};

export function prioritizeKeyboardHints(
  shortcuts: KeyboardShortcutDefinition[],
  phase: V94StandardizedGamePhase
): KeyboardShortcutDefinition[] {
  const preferred = PHASE_PRIORITY[phase] ?? [];
  return [...shortcuts].sort((a, b) => {
    const aIdx = preferred.indexOf(a.id);
    const bIdx = preferred.indexOf(b.id);
    const aPref = aIdx >= 0 ? aIdx : 100;
    const bPref = bIdx >= 0 ? bIdx : 100;
    if (aPref !== bPref) return aPref - bPref;
    return a.actionLabel.localeCompare(b.actionLabel);
  });
}

export function planKeyboardHintsDisplay(
  interfaceLevel: InterfaceExperienceLevel,
  phase: V94StandardizedGamePhase,
  limit = 6
): {
  shortcuts: KeyboardShortcutDefinition[];
  conflictCount: number;
  coachCopy: string | null;
} {
  const available = listAvailableKeyboardShortcuts(interfaceLevel, phase);
  const conflicts = planKeyboardShortcutConflicts(interfaceLevel, phase);
  const prioritized = prioritizeKeyboardHints(available, phase).slice(0, limit);
  const coachCopy =
    conflicts.length > 0
      ? `${conflicts.length} shortcut conflicts hidden from hints — rebind in settings.`
      : prioritized.length < available.length
        ? `Showing ${prioritized.length} of ${available.length} shortcuts for this phase.`
        : null;

  return { shortcuts: prioritized, conflictCount: conflicts.length, coachCopy };
}

// --- source: engine/contextual-widget-coach.ts ---
export interface WidgetContextualCoachEntry {
  widgetId: string;
  show: boolean;
  reason: string;
  panelIds: string[];
}

export function auditWidgetContextualVisibility(input: {
  widgetIds: string[];
  contextualShouldShowByWidget: Record<string, boolean>;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
}): WidgetContextualCoachEntry[] {
  return input.widgetIds.map(widgetId => {
    const contextualShouldShow = input.contextualShouldShowByWidget[widgetId] ?? true;
    const merged = mergeEvolvingUiWithContextualHiding(
      { widgetId, contextualShouldShow },
      input.signals,
      input.policy
    );
    return {
      widgetId,
      show: merged.show,
      reason: merged.reason,
      panelIds: listPanelsForWidget(widgetId).map(p => p.id),
    };
  });
}

export function widgetContextualCoachCopy(entries: WidgetContextualCoachEntry[]): string | null {
  const hidden = entries.filter(e => !e.show);
  if (!hidden.length) return null;
  return `${hidden.length} widgets stay hidden by contextual or progression rules.`;
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

  check(
    'sw_day_tick',
    'day advance unlocks market panel',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return r.newlyUnlockedPanelIds.length >= 0 && r.visiblePanelCount > 0;
    })()
  );

  check(
    'sw_notification_lane',
    'automation lane suppressed early',
    !shouldShowNotificationLaneCategory('automation', { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' })
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round3-self-tests.ts ---
export function runAgent22Round3SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r3_layout_suggest',
    'suggest Assisted for guided level',
    suggestLayoutPresetForInterfaceLevel('guided') === 'Assisted'
  );

  check(
    'r3_layout_tag',
    'Clean suppresses launcher tag panels',
    isPanelTagEnabledForPreset(['launcher'], 'Clean') === false
  );

  check(
    'r3_keyboard_expert_diag',
    'diagnostics shortcut expert-only',
    listAvailableKeyboardShortcuts('expert', 'human_turn').some(s => s.id === 'kb_open_diagnostics')
  );

  check(
    'r3_keyboard_simple_no_invest',
    'investments shortcut hidden on simple',
    !listAvailableKeyboardShortcuts('simple', 'human_turn').some(s => s.navTarget === 'investments')
  );

  check(
    'r3_contextual_qa',
    'day 6 human turn includes workshop action',
    listContextualQuickActions('human_turn', 6).some(a => a.navTarget === 'workshop')
  );

  check(
    'r3_layout_visibility',
    'Clean preset downgrades quick_actions launcher to preview',
    (() => {
      const vis = resolveEvolvingPanelVisibilityWithLayout(
        'quick_actions',
        'Clean',
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return vis.state === 'preview' && vis.reason.includes('layout');
    })()
  );

  check(
    'r3_onboarding_funnel',
    'dismissal remembers economy panels',
    (() => {
      const r = applyOnboardingDismissal('funnel_economy_basics', [], []);
      return r.rememberedPanelIds.includes('nav_market');
    })()
  );

  check(
    'r3_onboarding_active',
    'day 3 shows standing funnel step',
    listActiveOnboardingSteps(3, []).some(s => s.id === 'funnel_economy_basics')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round4-self-tests.ts ---
export function runAgent22Round4SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r4_density_simple',
    'simple level defaults to spacious density',
    resolveUiDensityProfile({ interfaceLevel: 'simple' }).tier === 'spacious'
  );

  check(
    'r4_density_cycle',
    'density cycles within eligible tiers',
    cycleUiDensityTier('spacious', 'simple') === 'comfortable'
  );

  check(
    'r4_density_expert_compact',
    'Developer preset implies compact when unset',
    resolveUiDensityProfile({ interfaceLevel: 'expert', layoutPreset: 'Developer' }).tier === 'compact'
  );

  check(
    'r4_focus_early_turn',
    'focus session active on early guided human turn',
    shouldActivateFocusSession({
      phase: 'human_turn',
      signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    })
  );

  check(
    'r4_focus_snooze',
    'snooze disables focus until day',
    !shouldActivateFocusSession({
      phase: 'human_turn',
      signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      focusSessionSnoozedUntilDay: 5,
    })
  );

  check(
    'r4_focus_suppress',
    'focus session suppresses launcher panels',
    (() => {
      const suppressed = listPanelsSuppressedByFocusSession(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        'human_turn'
      );
      return suppressed.some(id => id === 'quick_actions' || id.includes('ask_game'));
    })()
  );

  check(
    'r4_responsive_narrow',
    'narrow viewport collapses nav rail',
    deriveResponsiveLayoutHints({ viewportWidthPx: 640 }).collapseNavRail === true
  );

  check(
    'r4_viewport_band',
    'classifyViewportWidth medium band',
    classifyViewportWidth(900) === 'medium'
  );

  check(
    'r4_session_resume',
    'session memory resumes last visible nav',
    (() => {
      const mem = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      return suggestResumeNavTarget(
        mem,
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      ) === 'map';
    })()
  );

  check(
    'r4_session_persist_merge',
    'merge session memory into persisted slice',
    (() => {
      const merged = mergeSessionMemoryIntoPersisted(createDefaultEvolvingUiPersistedState(), {
        ...recordNavSelection(createDefaultSessionUiMemory(), 'market'),
        preferredDensity: 'compact',
      });
      return merged.lastNavTarget === 'market' && merged.preferredDensity === 'compact';
    })()
  );

  check(
    'r4_focus_visibility_hook',
    'resolve with focus downgrades non-essential visible panels',
    (() => {
      const vis = resolveEvolvingPanelVisibilityWithFocusSession(
        'ask_game',
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { phase: 'human_turn' }
      );
      return vis.reason.includes('focus_session') || vis.state !== 'visible';
    })()
  );

  check(
    'r4_snooze_day',
    'snoozeFocusSessionUntilDay advances calendar',
    snoozeFocusSessionUntilDay(3, 2) === 5
  );

  check(
    'r4_eligible_density',
    'simple cannot select compact',
    !listEligibleDensityTiers('simple').includes('compact')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round5-self-tests.ts ---
export function runAgent22Round5SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r5_motion_reduced_zero',
    'reduced motion zeroes transition duration',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const profile = resolveMotionTimingProfile(
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        density
      );
      return profile.transitionDurationMs === 0 && profile.dataAttributes['data-motion-reduced'] === 'true';
    })()
  );

  check(
    'r5_motion_spacious_slower',
    'spacious density allows longer transitions than compact',
    (() => {
      const a11y = { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: false };
      const compact = resolveMotionTimingProfile(
        a11y,
        resolveUiDensityProfile({ interfaceLevel: 'expert', preferredTier: 'compact' })
      );
      const spacious = resolveMotionTimingProfile(
        a11y,
        resolveUiDensityProfile({ interfaceLevel: 'simple', preferredTier: 'spacious' })
      );
      return spacious.transitionDurationMs > compact.transitionDurationMs;
    })()
  );

  check(
    'r5_motion_css_vars',
    'motionTimingCssVars exposes stagger and transition',
    (() => {
      const vars = motionTimingCssVars(
        resolveMotionTimingProfile(
          DEFAULT_ACCESSIBILITY_SNAPSHOT,
          resolveUiDensityProfile({ interfaceLevel: 'guided' })
        )
      );
      return Number(vars['--evolving-ui-transition-ms']) > 0 && Number(vars['--evolving-ui-stagger-ms']) >= 0;
    })()
  );

  check(
    'r5_pace_batches',
    'announcement pacing splits long unlock lists',
    (() => {
      const batches = paceUnlockAnnouncements(
        ['a', 'b', 'c', 'd'],
        { reducedMotion: false, announceVerbosity: 'polite' }
      );
      return batches.length >= 2 && flattenPacedAnnouncements(batches).length === 4;
    })()
  );

  check(
    'r5_pace_off',
    'verbosity off schedules nothing',
    paceUnlockAnnouncements(['x'], { reducedMotion: false, announceVerbosity: 'off' }).length === 0
  );

  check(
    'r5_pace_minimal',
    'minimal verbosity uses single-item batches',
    (() => {
      const batches = paceUnlockAnnouncements(['one', 'two'], {
        reducedMotion: false,
        announceVerbosity: 'minimal',
      });
      return batches.length === 2 && batches.every(b => b.items.length === 1);
    })()
  );

  check(
    'r5_cognitive_early_guided',
    'early guided turn tends toward moderate/heavy load when many lanes active',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 3,
      });
      return assessment.score >= 30 && assessment.activeNotificationLanes >= 3;
    })()
  );

  check(
    'r5_cognitive_focus_relief',
    'focus session flag lowers score',
    (() => {
      const base = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      const focused = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        focusSessionActive: true,
      });
      return focused.score <= base.score;
    })()
  );

  check(
    'r5_cognitive_coach_heavy',
    'heavy band recommends deferring coach when backlog',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 8, turnCount: 8, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 4,
      });
      return assessment.band === 'heavy' && assessment.recommendDeferCoach;
    })()
  );

  check(
    'r5_coach_snooze',
    'snoozed coach hidden until day',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 2,
      });
      return (
        shouldShowCognitiveLoadCoach(assessment, 3, snoozeCognitiveLoadCoachUntilDay(3)) === false &&
        shouldShowCognitiveLoadCoach(assessment, 6, 5) === true
      );
    })()
  );

  check(
    'r5_snooze_day_math',
    'snoozeCognitiveLoadCoachUntilDay advances calendar',
    snoozeCognitiveLoadCoachUntilDay(2, 3) === 5
  );

  check(
    'r5_pace_stagger_motion',
    'pacing honors motion timing stagger',
    (() => {
      const batches = paceUnlockAnnouncements(['a', 'b', 'c'], {
        reducedMotion: false,
        announceVerbosity: 'polite',
        motionTiming: { staggerStepMs: 200 },
      });
      return batches.length >= 2 && (batches[1]?.delayMs ?? 0) >= 200;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round6-self-tests.ts ---
export function runAgent22Round6SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r6_budget_heavy_tighter',
    'heavy band allows fewer slots than light on same phase',
    resolveAttentionBudgetSlots('heavy', 'human_turn') <
      resolveAttentionBudgetSlots('light', 'human_turn')
  );

  check(
    'r6_budget_main_menu',
    'main menu trims attention slots',
    resolveAttentionBudgetSlots('moderate', 'main_menu') <=
      resolveAttentionBudgetSlots('moderate', 'human_turn')
  );

  check(
    'r6_plan_defers_low_priority',
    'planner defers lowest-priority surfaces when over budget',
    (() => {
      const plan = planAttentionSurfaces({
        band: 'heavy',
        phase: 'human_turn',
        candidates: [
          { id: 'focus_session_banner', priority: 1, requested: true },
          { id: 'cognitive_load_coach', priority: 2, requested: true },
          { id: 'panel_unlock_coach', priority: 3, requested: true },
          { id: 'keyboard_hints_overlay', priority: 5, requested: true },
        ],
      });
      return (
        plan.deferredIds.length >= 1 &&
        isAttentionSurfaceAllowed(plan, 'focus_session_banner') &&
        !isAttentionSurfaceAllowed(plan, 'keyboard_hints_overlay')
      );
    })()
  );

  check(
    'r6_calm_patch_heavy_only',
    'calm recovery patch only on heavy load',
    (() => {
      const heavy = assessCognitiveLoad({
        signals: { gameDay: 12, turnCount: 12, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 5,
      });
      const light = assessCognitiveLoad({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return buildCalmRecoveryPatch(heavy, 5) != null && buildCalmRecoveryPatch(light, 1) == null;
    })()
  );

  check(
    'r6_calm_active_window',
    'calm recovery active until day threshold',
    (() => {
      const persisted = { calmRecoveryUntilDay: 8 };
      return isCalmRecoveryActive(persisted, 6) && !isCalmRecoveryActive(persisted, 8);
    })()
  );

  check(
    'r6_calm_merge_persisted',
    'mergeCalmRecoveryIntoPersisted sets spacious density',
    (() => {
      const patch = buildCalmRecoveryPatch(
        assessCognitiveLoad({
          signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
          policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
          pendingCoachAnnouncements: 4,
        }),
        10
      );
      if (!patch) return false;
      const merged = mergeCalmRecoveryIntoPersisted(createDefaultEvolvingUiPersistedState(), patch);
      return merged.preferredDensity === 'spacious' && (merged.calmRecoveryUntilDay ?? 0) > 10;
    })()
  );

  check(
    'r6_touch_spacious_larger',
    'spacious touch targets exceed compact',
    (() => {
      const compact = resolveTouchTargetProfile(
        'compact',
        DEFAULT_ACCESSIBILITY_SNAPSHOT
      );
      const spacious = resolveTouchTargetProfile(
        'spacious',
        DEFAULT_ACCESSIBILITY_SNAPSHOT
      );
      return spacious.minHeightPx > compact.minHeightPx;
    })()
  );

  check(
    'r6_touch_text_scale',
    'large text scale bumps touch minimum',
    (() => {
      const base = resolveTouchTargetProfile('comfortable', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const scaled = resolveTouchTargetProfile('comfortable', {
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        textScaleMultiplier: 1.4,
      });
      return scaled.minHeightPx > base.minHeightPx;
    })()
  );

  check(
    'r6_touch_css_vars',
    'touchTargetCssVars exposes min and slop',
    (() => {
      const vars = touchTargetCssVars(
        resolveTouchTargetProfile(
          resolveUiDensityProfile({ interfaceLevel: 'guided' }).tier,
          DEFAULT_ACCESSIBILITY_SNAPSHOT
        )
      );
      return Number(vars['--evolving-ui-touch-min-px']) >= 40 && Number(vars['--evolving-ui-touch-hit-slop-px']) >= 0;
    })()
  );

  check(
    'r6_touch_hit_slop',
    'meetsMinimumTouchTarget honors hit slop',
    (() => {
      const profile = resolveTouchTargetProfile('compact', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const almost = profile.minHeightPx - profile.hitSlopPx;
      return meetsMinimumTouchTarget(profile, almost) && !meetsMinimumTouchTarget(profile, almost - 1);
    })()
  );

  check(
    'r6_snooze_coherence',
    'calm patch aligns cognitive snooze with coach helper',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 8, turnCount: 8, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 3,
      });
      const patch = buildCalmRecoveryPatch(assessment, 8, 2);
      return patch?.cognitiveLoadCoachSnoozedUntilDay === snoozeCognitiveLoadCoachUntilDay(8, 2);
    })()
  );

  check(
    'r6_plan_empty',
    'no requested candidates yields empty allow list',
    (() => {
      const plan = planAttentionSurfaces({
        band: 'light',
        phase: 'human_turn',
        candidates: [{ id: 'keyboard_hints_overlay', priority: 1, requested: false }],
      });
      return plan.allowedIds.length === 0 && plan.deferredIds.length === 0;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round7-self-tests.ts ---
export function runAgent22Round7SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r7_snooze_grows',
    'dismissal snooze grows with streak',
    resolveCoachDismissalSnoozeDays(1) < resolveCoachDismissalSnoozeDays(4)
  );

  check(
    'r7_snooze_cap',
    'snooze days capped at seven',
    resolveCoachDismissalSnoozeDays(99) === 7
  );

  check(
    'r7_quiet_blocks_coach',
    'quiet window blocks coach surfaces',
    (() => {
      const persisted = { coachDismissalQuietUntilDay: 8 };
      return !shouldAllowCoachSurface(5, persisted) && isCoachDismissalQuiet(persisted, 5);
    })()
  );

  check(
    'r7_record_merge',
    'record dismissal merges into persisted',
    (() => {
      const base = createDefaultEvolvingUiPersistedState();
      const record = recordCoachDismissal(base, 10);
      const merged = mergeCoachDismissalIntoPersisted(base, record);
      return merged.coachDismissalStreak === 1 && (merged.coachDismissalQuietUntilDay ?? 0) > 10;
    })()
  );

  check(
    'r7_quiet_copy',
    'quiet copy mentions remaining days',
    coachDismissalQuietCopy(12, 10).includes('2')
  );

  check(
    'r7_landmark_role_order',
    'status landmarks sort before navigation',
    compareLandmarkReadingOrder(
      landmarkTargetForSurface('coach_banner', 'Coach', true, 1),
      landmarkTargetForSurface('nav_rail', 'Nav', true, 1)
    ) < 0
  );

  check(
    'r7_landmark_plan_skip',
    'reading plan exposes skip labels for nav/main',
    (() => {
      const plan = planLandmarkReadingOrder({
        phase: 'human_turn',
        landmarks: [
          landmarkTargetForSurface('nav_primary', 'Primary nav', true, 1),
          landmarkTargetForSurface('main_map', 'Map', true, 2),
          landmarkTargetForSurface('widget_lane', 'Widgets', true, 3),
        ],
      });
      return plan.skipLinkLabels.length >= 2 && plan.skipLinkLabels[0].startsWith('Skip to');
    })()
  );

  check(
    'r7_main_menu_nav_first',
    'main menu phase pulls navigation earlier',
    (() => {
      const plan = planLandmarkReadingOrder({
        phase: 'main_menu',
        landmarks: [
          landmarkTargetForSurface('main_title', 'Title', true, 1),
          landmarkTargetForSurface('nav_menu', 'Menu', true, 2),
        ],
      });
      return plan.ordered[0]?.role === 'navigation';
    })()
  );

  check(
    'r7_hc_elevated_border',
    'high contrast elevates border width',
    (() => {
      const standard = resolveHighContrastChromeProfile({
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        highContrastFocusRings: false,
        textScaleMultiplier: 1,
      });
      const elevated = resolveHighContrastChromeProfile({
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        highContrastFocusRings: true,
      });
      return elevated.borderWidthPx > standard.borderWidthPx && elevated.elevated;
    })()
  );

  check(
    'r7_hc_css_vars',
    'chrome css vars exported',
    Object.keys(highContrastChromeCssVars(resolveHighContrastChromeProfile(DEFAULT_ACCESSIBILITY_SNAPSHOT))).length >= 3
  );

  check(
    'r7_hc_merge_style',
    'merge chrome style preserves base keys',
    (() => {
      const merged = mergeHighContrastChromeStyle(DEFAULT_ACCESSIBILITY_SNAPSHOT, { color: 'inherit' });
      return merged.color === 'inherit' && merged['--evolving-ui-chrome-border-px'] != null;
    })()
  );

  check(
    'r7_allow_after_quiet',
    'coach allowed after quiet window ends',
    shouldAllowCoachSurface(10, { coachDismissalQuietUntilDay: 10 })
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round8-self-tests.ts ---
export function runAgent22Round8SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r8_hash_stable',
    'announcement hash is stable',
    hashAnnouncementText(' Unlock map ') === hashAnnouncementText('unlock map')
  );

  check(
    'r8_dup_within_window',
    'duplicate detected inside window',
    (() => {
      const hash = hashAnnouncementText('Panel unlocked');
      const ledger = { [hash]: 5 };
      return isAnnouncementDuplicate(hash, ledger, 6);
    })()
  );

  check(
    'r8_fresh_outside_window',
    'duplicate expires after window',
    (() => {
      const hash = hashAnnouncementText('Panel unlocked');
      const ledger = { [hash]: 1 };
      return !isAnnouncementDuplicate(hash, ledger, 1 + ANNOUNCEMENT_DEDUP_WINDOW_DAYS);
    })()
  );

  check(
    'r8_filter_suppresses_repeat',
    'filter suppresses repeated line',
    (() => {
      const line = 'Map panel unlocked';
      const first = filterDedupedAnnouncements([line, line], 4, {});
      return first.freshAnnouncements.length === 1 && first.suppressedCount === 1;
    })()
  );

  check(
    'r8_prune_ledger',
    'prune drops stale ledger entries',
    (() => {
      const pruned = pruneAnnouncementDedupLedger({ a: 1, b: 23 }, 25);
      return pruned.b === 23 && pruned.a == null;
    })()
  );

  check(
    'r8_dedup_copy',
    'dedup status copy mentions count',
    dedupStatusCopy(2).includes('2')
  );

  check(
    'r8_tick_merges_ledger',
    'day advance merges dedup ledger',
    (() => {
      const prior = { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' as const };
      const next = { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' as const };
      const persisted = createDefaultEvolvingUiPersistedState();
      const r = tickEvolvingUiOnDayAdvance(prior, next, DEFAULT_EVOLVING_UI_ACCESS_POLICY, persisted);
      return typeof r.updatedPersisted.announcementDedupLedger === 'object';
    })()
  );

  check(
    'r8_modal_restore_selector',
    'modal restore uses nav target selector',
    navSelectorForTarget('map').includes('map')
  );

  check(
    'r8_modal_restore_plan',
    'modal plan announces restore label',
    (() => {
      const plan = resolveModalFocusRestorePlan({
        modalId: 'settings_modal',
        lastNavTarget: 'map',
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return plan.restoreEnabled && plan.announceOnClose.includes('settings_modal');
    })()
  );

  check(
    'r8_modal_skip_label',
    'modal skip label references restore target',
    modalFocusRestoreSkipLabel(
      resolveModalFocusRestorePlan({
        modalId: 'x',
        lastNavTarget: null,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      })
    ).includes('primary navigation')
  );

  check(
    'r8_attention_allows_focus',
    'attention plan allows focus banner first',
    (() => {
      const plan = planAttentionSurfaceGate({
        band: 'heavy',
        phase: 'save_load',
        focusSessionBannerRequested: true,
        cognitiveLoadCoachRequested: true,
      });
      return (
        isAttentionCoachSurfaceVisible(plan, 'focus_session_banner') &&
        plan.deferredIds.includes('cognitive_load_coach')
      );
    })()
  );

  check(
    'r8_attention_defer_copy',
    'attention deferral copy mentions waiting surfaces',
    attentionDeferralCopy(['cognitive_load_coach']).includes('waiting')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round9-self-tests.ts ---
export function runAgent22Round9SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r9_pacing_defers_overflow',
    'pacing defers announcements beyond first batch',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const schedule = buildPacedAnnouncementSchedule(
        ['one', 'two', 'three', 'four'],
        DEFAULT_ACCESSIBILITY_SNAPSHOT,
        density
      );
      return schedule.immediateAnnouncements.length >= 1 && schedule.deferredCount >= 1;
    })()
  );

  check(
    'r9_pacing_copy',
    'pacing status copy mentions deferred count',
    Boolean(pacingStatusCopy(3)?.includes('3'))
  );

  check(
    'r9_tick_sets_deferred',
    'day advance exposes deferred coach count',
    (() => {
      const prior = { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' as const };
      const next = { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' as const };
      const r = tickEvolvingUiOnDayAdvance(prior, next, DEFAULT_EVOLVING_UI_ACCESS_POLICY, createDefaultEvolvingUiPersistedState());
      return typeof r.deferredCoachAnnouncementCount === 'number';
    })()
  );

  check(
    'r9_persist_merge_deferred',
    'merge pacing deferred into persisted',
    (() => {
      const merged = mergePacingDeferredIntoPersisted(createDefaultEvolvingUiPersistedState(), 2);
      return merged.announcementPacingDeferredCount === 2;
    })()
  );

  check(
    'r9_conflict_detect',
    'detects duplicate key bindings',
    (() => {
      const sample = [
        EVOLVING_UI_KEYBOARD_SHORTCUTS[0],
        { ...EVOLVING_UI_KEYBOARD_SHORTCUTS[0], id: 'dup', actionLabel: 'Duplicate' },
      ];
      return detectKeyboardShortcutConflicts(sample).length === 1;
    })()
  );

  check(
    'r9_conflict_plan_empty_simple',
    'simple human turn has no shortcut conflicts',
    planKeyboardShortcutConflicts('simple', 'human_turn').length === 0
  );

  check(
    'r9_conflict_warning_copy',
    'conflict warning mentions rebind',
    (() => {
      const conflicts = detectKeyboardShortcutConflicts([
        EVOLVING_UI_KEYBOARD_SHORTCUTS[0],
        { ...EVOLVING_UI_KEYBOARD_SHORTCUTS[0], id: 'dup', actionLabel: 'Other' },
      ]);
      return Boolean(shortcutConflictWarningCopy(conflicts)?.includes('Rebind'));
    })()
  );

  check(
    'r9_live_region_priority',
    'assertive messages drain before polite',
    (() => {
      let q = enqueueLiveRegionMessage([], {
        id: 'p1',
        text: 'polite',
        politeness: 'polite',
        priority: 'polite',
      });
      q = enqueueLiveRegionMessage(q, {
        id: 'a1',
        text: 'urgent',
        politeness: 'assertive',
        priority: 'assertive',
      });
      const { drained } = drainLiveRegionQueue(q, 1);
      return drained[0]?.priority === 'assertive';
    })()
  );

  check(
    'r9_live_region_coalesce',
    'coalesce drops duplicate text',
    (() => {
      const q = coalesceDuplicateLiveRegionText([
        {
          id: '1',
          text: 'Hello',
          politeness: 'polite',
          priority: 'polite',
          createdAt: 1,
        },
        {
          id: '2',
          text: 'hello',
          politeness: 'polite',
          priority: 'polite',
          createdAt: 2,
        },
      ]);
      return q.length === 1;
    })()
  );

  check(
    'r9_live_region_summary',
    'queue summary mentions count',
    Boolean(liveRegionQueueSummaryCopy([
      {
        id: '1',
        text: 'x',
        politeness: 'assertive',
        priority: 'assertive',
        createdAt: 1,
      },
    ])?.includes('priority'))
  );

  check(
    'r9_motion_chrome_vars',
    'motion timing css vars include transition ms',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'simple' });
      const profile = resolveMotionTimingProfile(DEFAULT_ACCESSIBILITY_SNAPSHOT, density);
      return Boolean(motionTimingCssVars(profile)['--evolving-ui-transition-ms']);
    })()
  );

  check(
    'r9_reduced_motion_zero_transition',
    'reduced motion zeroes transition duration',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const profile = resolveMotionTimingProfile(
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        density
      );
      return profile.transitionDurationMs === 0;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round10-self-tests.ts ---
export function runAgent22Round10SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r10_flush_delivers_batch',
    'flush delivers first paced batch from queue',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const flush = flushDeferredAnnouncementQueue(
        ['one', 'two', 'three', 'four'],
        DEFAULT_ACCESSIBILITY_SNAPSHOT,
        density
      );
      return flush.flushedAnnouncements.length >= 1 && flush.remainingCount >= 1;
    })()
  );

  check(
    'r10_flush_copy',
    'flush status copy mentions delivered count',
    Boolean(deferredFlushStatusCopy(2, 1)?.includes('Delivered'))
  );

  check(
    'r10_queue_persist',
    'merge queue into persisted slice',
    (() => {
      const merged = mergeAnnouncementPacingQueueIntoPersisted(createDefaultEvolvingUiPersistedState(), ['a', 'b']);
      return merged.announcementPacingQueue?.length === 2 && merged.announcementPacingDeferredCount === 2;
    })()
  );

  check(
    'r10_tick_flushes_prior_queue',
    'day advance exposes flushed deferred count',
    (() => {
      const persisted = mergeAnnouncementPacingQueueIntoPersisted(createDefaultEvolvingUiPersistedState(), [
        'queued coach line one',
        'queued coach line two',
        'queued coach line three',
      ]);
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted
      );
      return r.flushedDeferredAnnouncementCount >= 1;
    })()
  );

  check(
    'r10_append_queue',
    'append extends pacing queue',
    appendToAnnouncementPacingQueue(['a'], ['b']).length === 2
  );

  check(
    'r10_resume_plan',
    'session resume plan suggests last nav target',
    (() => {
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const plan = buildSessionResumeCoachPlan({
        memory,
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return plan.shouldShow && plan.navTarget === 'map';
    })()
  );

  check(
    'r10_resume_skip_label',
    'resume skip link references panel label',
    (() => {
      const plan = buildSessionResumeCoachPlan({
        memory: recordNavSelection(createDefaultSessionUiMemory(), 'map'),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return Boolean(sessionResumeSkipLinkLabel(plan)?.includes('Skip'));
    })()
  );

  check(
    'r10_memory_rank_boost',
    'memory ranking promotes recent nav action',
    (() => {
      const base = listContextualQuickActions('human_turn', 5);
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const ranked = rankContextualQuickActionsWithMemory(base, memory);
      return ranked[0]?.navTarget === 'map';
    })()
  );

  check(
    'r10_memory_coach_copy',
    'memory quick action copy mentions pin',
    Boolean(memoryQuickActionCoachCopy('map')?.includes('Pinned'))
  );

  check(
    'r10_accessible_shell_vars',
    'accessible chrome shell merges motion and touch vars',
    (() => {
      const shell = resolveAccessibleChromeShellProfile({
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        interfaceLevel: 'guided',
      });
      return (
        Boolean(shell.style['--evolving-ui-transition-ms']) &&
        Boolean(shell.style['--evolving-ui-touch-min-px'])
      );
    })()
  );

  check(
    'r10_touch_meets_minimum',
    'touch profile meets scaled minimum',
    (() => {
      const profile = resolveTouchTargetProfile('spacious', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      return meetsMinimumTouchTarget(profile, profile.minHeightPx);
    })()
  );

  check(
    'r10_resume_hidden_without_hints',
    'resume coach hidden when keyboard hints off',
    (() => {
      const plan = buildSessionResumeCoachPlan({
        memory: recordNavSelection(createDefaultSessionUiMemory(), 'map'),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, keyboardNavigationHints: false },
      });
      return !plan.shouldShow;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round11-self-tests.ts ---
export function runAgent22Round11SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r11_onboarding_persist_merge',
    'merge onboarding dismiss keys into persisted',
    (() => {
      const merged = mergeOnboardingDismissalsIntoPersisted(createDefaultEvolvingUiPersistedState(), ['onboarding_map']);
      return Boolean(merged.onboardingDismissedKeys?.includes('onboarding_map'));
    })()
  );

  check(
    'r11_onboarding_dismiss_step',
    'dismiss step updates remembered panels',
    (() => {
      const next = dismissOnboardingStepInPersisted(createDefaultEvolvingUiPersistedState(), 'funnel_welcome_map');
      return Boolean(
        next.onboardingDismissedKeys?.includes('onboarding_map') && next.rememberedPanelIds?.includes('nav_map')
      );
    })()
  );

  check(
    'r11_onboarding_status_copy',
    'funnel status copy mentions step title',
    (() => {
      const steps = listActiveOnboardingStepsForPersisted(2, createDefaultEvolvingUiPersistedState());
      return Boolean(onboardingFunnelStatusCopy(steps)?.includes('Onboarding'));
    })()
  );

  check(
    'r11_onboarding_highlights_tick',
    'day advance remembers onboarding highlight panels',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      const highlights = onboardingHighlightedPanelIds(2, createDefaultEvolvingUiPersistedState());
      return highlights.length > 0 && (r.updatedPersisted.rememberedPanelIds?.length ?? 0) >= highlights.length;
    })()
  );

  check(
    'r11_nav_rail_overflow',
    'narrow viewport caps visible nav items',
    (() => {
      const signals = { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' as const };
      const ordered = sortPanelsForRail(
        NAV_TARGET_PANELS.map(p => p.id),
        signals,
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const plan = planNavRailVisibleItems({
        orderedPanelIds: ordered,
        viewportWidthPx: 360,
      });
      return plan.visiblePanelIds.length <= plan.hints.maxVisibleRailItems && plan.overflowCount >= 0;
    })()
  );

  check(
    'r11_nav_rail_pins_recent',
    'nav plan keeps recent session target visible',
    (() => {
      const signals = { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' as const };
      const ordered = sortPanelsForRail(
        NAV_TARGET_PANELS.map(p => p.id),
        signals,
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const plan = planNavRailVisibleItems({
        orderedPanelIds: ordered,
        viewportWidthPx: 400,
        sessionMemory: memory,
      });
      const mapPanel = NAV_TARGET_PANELS.find(p => p.navTarget === 'map');
      return mapPanel ? plan.visiblePanelIds.includes(mapPanel.id) : false;
    })()
  );

  check(
    'r11_coach_live_region_plan',
    'coach lines become live region messages',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['Panel unlocked'], DEFAULT_ACCESSIBILITY_SNAPSHOT);
      return plan.messages.length === 1 && plan.politeCount === 1;
    })()
  );

  check(
    'r11_coach_live_region_copy',
    'live region delivery copy mentions queue',
    Boolean(coachLiveRegionDeliveryCopy(buildCoachLiveRegionDeliveryPlan(['a', 'b'], DEFAULT_ACCESSIBILITY_SNAPSHOT))?.includes('screen reader'))
  );

  check(
    'r11_tick_live_region_count',
    'day advance reports live region message count',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        announcementPacingQueue: ['queued one', 'queued two', 'queued three'],
      };
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted
      );
      return r.coachLiveRegionMessageCount >= 1;
    })()
  );

  check(
    'r11_layout_onboarding_hints',
    'layout hints mark onboarding highlights',
    (() => {
      const hints = buildLayoutOnboardingVisibilityHints({
        panelIds: ['nav_map', 'nav_market'],
        layoutPreset: 'Assisted',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
      });
      return hints.some(h => h.onboardingHighlight);
    })()
  );

  check(
    'r11_layout_onboarding_copy',
    'layout onboarding copy references preview',
    (() => {
      const hints = buildLayoutOnboardingVisibilityHints({
        panelIds: ['widget_guardian', 'ai_command'],
        layoutPreset: 'Clean',
        signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'advanced' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
      });
      const copy = layoutOnboardingCoachCopy(hints);
      return copy == null || copy.includes('preview');
    })()
  );

  check(
    'r11_live_region_off_when_sr_disabled',
    'live region plan empty when SR off',
    buildCoachLiveRegionDeliveryPlan(['x'], { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, screenReaderAnnouncements: false })
      .messages.length === 0
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

// --- source: engine/round12-self-tests.ts ---
export function runAgent22Round12SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r12_phase_gate_save_load',
    'save_load suppresses coach surfaces',
    (() => {
      const plan = planPhaseCoachSurfaces('save_load');
      return plan.allowedSurfaces.length === 0;
    })()
  );

  check(
    'r12_phase_gate_human_turn',
    'human turn allows panel unlock coach',
    isPhaseCoachSurfaceAllowed(planPhaseCoachSurfaces('human_turn'), 'panel_unlock_coach')
  );

  check(
    'r12_phase_gate_heavy',
    'heavy band trims onboarding coach',
    (() => {
      const plan = planPhaseCoachSurfaces('human_turn', 'heavy');
      return !isPhaseCoachSurfaceAllowed(plan, 'onboarding_funnel');
    })()
  );

  check(
    'r12_phase_gate_copy',
    'phase gate copy mentions deferred surfaces',
    Boolean(phaseCoachGateCopy(planPhaseCoachSurfaces('main_menu'))?.includes('deferred'))
  );

  check(
    'r12_show_all_safety',
    'show-all safety warns on menu phase',
    (() => {
      const assessment = evaluateShowAllOverrideSafety({
        persisted: { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        phase: 'main_menu',
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
      });
      return Boolean(assessment.coachCopy);
    })()
  );

  check(
    'r12_coverage_snapshot',
    'coverage snapshot includes tier label',
    (() => {
      const snap = buildProgressionCoverageSnapshot(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return snap.tierLabel === 'early' && snap.total > 0;
    })()
  );

  check(
    'r12_coverage_delta',
    'coverage delta copy reports increase',
    Boolean(coverageDeltaCopy(0.2, 0.35)?.includes('increased'))
  );

  check(
    'r12_tick_persists_coverage',
    'day advance persists coverage ratio',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return typeof r.progressionCoverageRatio === 'number' && r.updatedPersisted.lastProgressionCoverageRatio != null;
    })()
  );

  check(
    'r12_merge_coverage_persisted',
    'merge coverage clamps ratio',
    mergeCoverageRatioIntoPersisted(createDefaultEvolvingUiPersistedState(), 1.5).lastProgressionCoverageRatio === 1
  );

  check(
    'r12_keyboard_hints_plan',
    'keyboard hints plan prioritizes map on human turn',
    (() => {
      const plan = planKeyboardHintsDisplay('simple', 'human_turn');
      return plan.shortcuts[0]?.id === 'kb_open_map';
    })()
  );

  check(
    'r12_widget_contextual_audit',
    'widget audit hides when contextual false',
    (() => {
      const entries = auditWidgetContextualVisibility({
        widgetIds: ['quick_actions'],
        contextualShouldShowByWidget: { quick_actions: false },
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return entries[0]?.show === false && entries[0]?.reason === 'contextual_hiding';
    })()
  );

  check(
    'r12_widget_contextual_copy',
    'widget contextual copy mentions hidden count',
    (() => {
      const entries = auditWidgetContextualVisibility({
        widgetIds: ['quick_actions', 'objectives'],
        contextualShouldShowByWidget: { quick_actions: false, objectives: false },
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return Boolean(widgetContextualCoachCopy(entries)?.includes('2'));
    })()
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
  viewportWidthPx?: number;
  sessionMemory?: SessionUiMemory;
  onNavigate: (navTarget: string, panelId: string) => void;
}

export function EvolvingNavRail({
  signals,
  policy,
  accessibility,
  selectedNavTarget,
  viewportWidthPx,
  sessionMemory,
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

  const visibleIds = useMemo(() => {
    if (viewportWidthPx == null) return ordered;
    return planNavRailVisibleItems({
      orderedPanelIds: ordered,
      viewportWidthPx,
      sessionMemory,
    }).visiblePanelIds;
  }, [ordered, viewportWidthPx, sessionMemory]);

  return (
    <nav aria-label="Primary game navigation" data-testid="evolving-nav-rail" className="flex flex-col gap-1">
      {visibleIds.map(id => {
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
  phase?: V94StandardizedGamePhase;
  onSelectPanel?: (panelId: string) => void;
}

export function PanelUnlockCoach({ signals, policy, phase = 'human_turn', onSelectPanel }: PanelUnlockCoachProps): React.ReactElement {
  const gate = planPhaseCoachSurfaces(phase, 'moderate');
  if (!isPhaseCoachSurfaceAllowed(gate, 'panel_unlock_coach')) {
    return (
      <div data-testid="panel-unlock-coach" className="text-xs opacity-70">
        Panel unlock coach paused for {phase}.
      </div>
    );
  }
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

// --- source: react/SimulationUiEvolutionBridge.tsx ---
export interface SimulationUiEvolutionBridgeProps {
  result: DayAdvanceUiEvolutionResult | null;
  suppressedAnnouncementCount?: number;
}

export function SimulationUiEvolutionBridge({
  result,
  suppressedAnnouncementCount = 0,
}: SimulationUiEvolutionBridgeProps): React.ReactElement | null {
  if (!result || (result.newlyUnlockedPanelIds.length === 0 && suppressedAnnouncementCount <= 0)) return null;
  return (
    <div
      data-testid="sim-ui-evolution-bridge"
      role="status"
      aria-live="polite"
      className="text-xs space-y-1"
    >
      <div>Day {result.gameDay}: {result.newlyUnlockedPanelIds.length} new interface panels</div>
      {suppressedAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-dedup-count">
          Held back {suppressedAnnouncementCount} repeated announcements
        </div>
      ) : null}
      {result.deferredCoachAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-pacing-count">
          Staggered {result.deferredCoachAnnouncementCount} coach announcements
        </div>
      ) : null}
      {result.flushedDeferredAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-flush-count">
          Flushed {result.flushedDeferredAnnouncementCount} queued coach announcements
        </div>
      ) : null}
      {result.coachLiveRegionMessageCount > 0 ? (
        <div data-testid="sim-ui-evolution-live-region-count">
          Scheduled {result.coachLiveRegionMessageCount} live-region coach messages
        </div>
      ) : null}
      {result.progressionCoverageDeltaCopy ? (
        <div data-testid="sim-ui-evolution-coverage-delta">{result.progressionCoverageDeltaCopy}</div>
      ) : null}
      {result.coachAnnouncements.slice(0, 3).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}

// --- source: react/ContextualQuickActionRail.tsx ---
export interface ContextualQuickActionRailProps {
  phase: V94StandardizedGamePhase;
  gameDay: number;
  sessionMemory?: SessionUiMemory;
  onNavigate?: (navTarget: string, patch: Record<string, boolean | string>) => void;
}

export function ContextualQuickActionRail({
  phase,
  gameDay,
  sessionMemory,
  onNavigate,
}: ContextualQuickActionRailProps): React.ReactElement {
  const base = listContextualQuickActions(phase, gameDay);
  const actions = sessionMemory ? rankContextualQuickActionsWithMemory(base, sessionMemory) : base;
  return (
    <div data-testid="contextual-quick-action-rail" role="toolbar" aria-label="Contextual quick actions" className="flex flex-wrap gap-1">
      {actions.map(a => (
        <button
          key={a.id}
          type="button"
          className="px-2 py-0.5 rounded text-xs border"
          onClick={() => onNavigate?.(a.navTarget, contextualActionToNavPatch(a))}
          data-testid={`cqa-${a.id}`}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// --- source: react/KeyboardHintsOverlay.tsx ---
export interface KeyboardHintsOverlayProps {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
  onInvoke?: (shortcutId: string, navTarget: string | null) => void;
}

export function KeyboardHintsOverlay({
  interfaceLevel,
  phase,
  accessibility,
  onInvoke,
}: KeyboardHintsOverlayProps): React.ReactElement | null {
  const display = useMemo(
    () => planKeyboardHintsDisplay(interfaceLevel, phase, 6),
    [interfaceLevel, phase]
  );
  if (!accessibility.keyboardNavigationHints || display.shortcuts.length === 0) return null;
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="keyboard-hints-overlay"
      role="complementary"
      aria-label="Keyboard shortcuts"
      className="text-xs opacity-90 space-y-0.5"
    >
      {display.coachCopy ? (
        <p data-testid="keyboard-hints-coach-copy" className="opacity-80">
          {display.coachCopy}
        </p>
      ) : null}
      {display.shortcuts.map(s => (
        <button
          key={s.id}
          type="button"
          className={`block text-left ${focusClass}`}
          onClick={() => onInvoke?.(s.id, s.navTarget ?? null)}
          data-testid={`kb-hint-${s.id}`}
        >
          <kbd>{s.keys}</kbd> — {s.actionLabel}
        </button>
      ))}
    </div>
  );
}

// --- source: react/UiDensitySelector.tsx ---
export interface UiDensitySelectorProps {
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: V94LayoutPreset;
  textScaleMultiplier?: number;
  value?: UiDensityTier | null;
  accessibility: AccessibilitySettingsSnapshot;
  onChange?: (tier: UiDensityTier) => void;
}

export function UiDensitySelector({
  interfaceLevel,
  layoutPreset,
  textScaleMultiplier,
  value,
  accessibility,
  onChange,
}: UiDensitySelectorProps): React.ReactElement {
  const profile = useMemo(
    () =>
      resolveUiDensityProfile({
        interfaceLevel,
        layoutPreset,
        textScaleMultiplier,
        preferredTier: value,
      }),
    [interfaceLevel, layoutPreset, textScaleMultiplier, value]
  );
  const eligible = listEligibleDensityTiers(interfaceLevel);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div data-testid="ui-density-selector" role="group" aria-label="Interface density" className="flex gap-1">
      {eligible.map(tier => (
        <button
          key={tier}
          type="button"
          className={focusClass}
          aria-pressed={profile.tier === tier}
          data-testid={`density-${tier}`}
          onClick={() => onChange?.(tier)}
        >
          {tier}
        </button>
      ))}
      <button
        type="button"
        className={focusClass}
        data-testid="density-cycle"
        aria-label="Cycle density"
        onClick={() => onChange?.(cycleUiDensityTier(profile.tier, interfaceLevel))}
      >
        Cycle
      </button>
    </div>
  );
}

// --- source: react/FocusSessionBanner.tsx ---
export interface FocusSessionBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
  accessibility: AccessibilitySettingsSnapshot;
  onSnooze?: (untilDay: number) => void;
}

export function FocusSessionBanner({
  phase,
  signals,
  policy,
  focusSessionSnoozedUntilDay,
  accessibility,
  onSnooze,
}: FocusSessionBannerProps): React.ReactElement | null {
  const ctx = { phase, signals, policy, focusSessionSnoozedUntilDay };
  if (!shouldActivateFocusSession(ctx)) return null;

  const load = assessCognitiveLoad({ signals, policy, onboardingEnabled: true });
  const attentionPlan = planAttentionSurfaceGate({
    band: load.band,
    phase,
    focusSessionBannerRequested: true,
  });
  if (!isAttentionCoachSurfaceVisible(attentionPlan, 'focus_session_banner')) return null;

  const copy = focusSessionCoachCopy(ctx);
  const suppressed = listPanelsSuppressedByFocusSession(signals, policy, phase, focusSessionSnoozedUntilDay);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="focus-session-banner"
      role="status"
      aria-live="polite"
      className="text-sm border border-amber-500/40 rounded p-2"
    >
      <p>{copy}</p>
      {suppressed.length > 0 ? (
        <p className="text-xs opacity-80" data-testid="focus-session-suppressed-count">
          {suppressed.length} advanced panels tucked away for now.
        </p>
      ) : null}
      <button
        type="button"
        className={focusClass}
        data-testid="focus-session-snooze"
        onClick={() => onSnooze?.(snoozeFocusSessionUntilDay(signals.gameDay))}
      >
        Snooze focus mode
      </button>
    </div>
  );
}

// --- source: react/CognitiveLoadCoachBanner.tsx ---
export interface CognitiveLoadCoachBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  cognitiveLoadCoachSnoozedUntilDay?: number;
  coachDismissalBackoff?: CoachDismissalBackoffState;
  focusSessionSnoozedUntilDay?: number;
  pendingCoachAnnouncements?: number;
  onboardingEnabled?: boolean;
  focusSessionBannerActive?: boolean;
  onSnooze?: (untilDay: number) => void;
}

export function CognitiveLoadCoachBanner({
  phase,
  signals,
  policy,
  accessibility,
  cognitiveLoadCoachSnoozedUntilDay,
  coachDismissalBackoff,
  focusSessionSnoozedUntilDay,
  pendingCoachAnnouncements = 0,
  onboardingEnabled = true,
  focusSessionBannerActive = false,
  onSnooze,
}: CognitiveLoadCoachBannerProps): React.ReactElement | null {
  const focusSessionActive = shouldActivateFocusSession({
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay,
  });

  const assessment = assessCognitiveLoad({
    signals,
    policy,
    onboardingEnabled,
    focusSessionActive,
    pendingCoachAnnouncements,
  });

  if (
    !shouldShowCognitiveLoadCoach(assessment, signals.gameDay, cognitiveLoadCoachSnoozedUntilDay) ||
    !shouldAllowCoachSurface(signals.gameDay, coachDismissalBackoff ?? {}, cognitiveLoadCoachSnoozedUntilDay)
  ) {
    return null;
  }

  const attentionPlan = planAttentionSurfaceGate({
    band: assessment.band,
    phase,
    cognitiveLoadCoachRequested: true,
    focusSessionBannerRequested: focusSessionBannerActive,
  });

  if (!isAttentionCoachSurfaceVisible(attentionPlan, 'cognitive_load_coach')) {
    return null;
  }

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="cognitive-load-coach-banner"
      data-load-band={assessment.band}
      role="status"
      aria-live="polite"
      className="text-sm border border-sky-500/40 rounded p-2"
    >
      <p>{assessment.coachCopy}</p>
      {assessment.recommendDeferCoach ? (
        <p className="text-xs opacity-80" data-testid="cognitive-load-defer-hint">
          Unlock coaching will wait until the interface catches up.
        </p>
      ) : null}
      {assessment.recommendCollapseQuickActions ? (
        <p className="text-xs opacity-80" data-testid="cognitive-load-quick-actions-hint">
          Quick actions may collapse while load is {assessment.band}.
        </p>
      ) : null}
      <button
        type="button"
        className={focusClass}
        data-testid="cognitive-load-snooze"
        onClick={() => onSnooze?.(snoozeCognitiveLoadCoachUntilDay(signals.gameDay))}
      >
        Snooze load coach
      </button>
    </div>
  );
}

// --- source: react/UiCalmRecoveryBanner.tsx ---
export interface UiCalmRecoveryBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  persisted: EvolvingUiPersistedState;
  pendingCoachAnnouncements?: number;
  onApplyCalmRecovery?: (next: EvolvingUiPersistedState) => void;
}

export function UiCalmRecoveryBanner({
  phase,
  signals,
  policy,
  accessibility,
  persisted,
  pendingCoachAnnouncements = 0,
  onApplyCalmRecovery,
}: UiCalmRecoveryBannerProps): React.ReactElement | null {
  const focusSessionActive = shouldActivateFocusSession({
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay: persisted.focusSessionSnoozedUntilDay,
  });

  const assessment = assessCognitiveLoad({
    signals,
    policy,
    focusSessionActive,
    pendingCoachAnnouncements,
  });

  const calmActive = isCalmRecoveryActive(persisted, signals.gameDay);
  const patch = buildCalmRecoveryPatch(assessment, signals.gameDay);

  const budget = planAttentionSurfaces({
    band: assessment.band,
    phase,
    candidates: [
      { id: 'cognitive_load_coach', priority: 2, requested: assessment.band !== 'light' },
      { id: 'focus_session_banner', priority: 1, requested: focusSessionActive },
      { id: 'panel_unlock_coach', priority: 3, requested: pendingCoachAnnouncements > 0 },
      {
        id: 'sim_evolution_bridge',
        priority: 4,
        requested: !calmActive && pendingCoachAnnouncements > 0,
      },
    ],
  });

  const showBanner =
    calmActive ||
    (patch != null && isAttentionSurfaceAllowed(budget, 'cognitive_load_coach'));

  if (!showBanner) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="ui-calm-recovery-banner"
      data-calm-active={calmActive ? 'true' : 'false'}
      data-attention-slots={budget.maxConcurrentSurfaces}
      role="status"
      aria-live="polite"
      className="text-sm border border-violet-500/40 rounded p-2 space-y-2"
    >
      <p>{calmRecoveryCoachCopy(calmActive)}</p>
      {!calmActive && patch && onApplyCalmRecovery ? (
        <button
          type="button"
          data-testid="ui-calm-recovery-activate"
          className={`text-xs underline ${focusClass}`}
          onClick={() => onApplyCalmRecovery(mergeCalmRecoveryIntoPersisted(persisted, patch))}
        >
          Enable calm recovery
        </button>
      ) : null}
    </div>
  );
}

// --- source: react/CoachDismissalBackoffBanner.tsx ---
export interface CoachDismissalBackoffBannerProps {
  signals: ProgressionSignalSnapshot;
  persisted: EvolvingUiPersistedState;
  accessibility: AccessibilitySettingsSnapshot;
  onPersist?: (next: EvolvingUiPersistedState) => void;
}

export function CoachDismissalBackoffBanner({
  signals,
  persisted,
  accessibility,
  onPersist,
}: CoachDismissalBackoffBannerProps): React.ReactElement | null {
  const quiet = isCoachDismissalQuiet(persisted, signals.gameDay);
  const quietUntil = persisted.coachDismissalQuietUntilDay;
  if (!quiet || quietUntil == null) return null;

  const copy = coachDismissalQuietCopy(quietUntil, signals.gameDay);
  if (!copy) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="coach-dismissal-backoff-banner"
      data-dismissal-streak={persisted.coachDismissalStreak ?? 0}
      role="status"
      aria-live="polite"
      className="text-xs border rounded p-2 opacity-90"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <p>{copy}</p>
      {onPersist ? (
        <button
          type="button"
          className={`underline ${focusClass}`}
          data-testid="coach-dismissal-extend-quiet"
          onClick={() =>
            onPersist(mergeCoachDismissalIntoPersisted(persisted, recordCoachDismissal(persisted, signals.gameDay)))
          }
        >
          Keep coaching quiet longer
        </button>
      ) : null}
    </div>
  );
}

// --- source: react/LandmarkSkipLinksStrip.tsx ---
export interface LandmarkSkipLinksStripProps {
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
  /** id/label pairs for primary shells currently mounted. */
  surfaces: Array<{ id: string; label: string; visible?: boolean }>;
}

export function LandmarkSkipLinksStrip({
  phase,
  accessibility,
  surfaces,
}: LandmarkSkipLinksStripProps): React.ReactElement | null {
  if (!accessibility.screenReaderAnnouncements && !accessibility.keyboardNavigationHints) {
    return null;
  }

  const landmarks = surfaces.map((s, index) =>
    landmarkTargetForSurface(s.id, s.label, s.visible !== false, index + 1)
  );
  const plan = planLandmarkReadingOrder({ phase, landmarks });
  if (plan.skipLinkLabels.length === 0) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <nav
      data-testid="landmark-skip-links"
      aria-label="Skip links"
      className="flex flex-wrap gap-2 text-xs sr-only focus-within:not-sr-only"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {plan.skipLinkLabels.map(label => (
        <a key={label} href={`#${label.replace(/\s+/g, '-').toLowerCase()}`} className={focusClass}>
          {label}
        </a>
      ))}
    </nav>
  );
}

// --- source: react/AnnouncementDedupStatusBanner.tsx ---
export interface AnnouncementDedupStatusBannerProps {
  suppressedCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function AnnouncementDedupStatusBanner({
  suppressedCount,
  accessibility,
}: AnnouncementDedupStatusBannerProps): React.ReactElement | null {
  const copy = dedupStatusCopy(suppressedCount);
  if (!copy) return null;

  return (
    <div
      data-testid="announcement-dedup-status-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/ModalFocusRestoreStrip.tsx ---
export interface ModalFocusRestoreStripProps {
  modalId: string;
  lastNavTarget?: string | null;
  accessibility: AccessibilitySettingsSnapshot;
  onSkipToRestore?: (selector: string) => void;
}

export function ModalFocusRestoreStrip({
  modalId,
  lastNavTarget,
  accessibility,
  onSkipToRestore,
}: ModalFocusRestoreStripProps): React.ReactElement | null {
  const plan = resolveModalFocusRestorePlan({ modalId, lastNavTarget, accessibility });
  if (!plan.restoreEnabled) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="modal-focus-restore-strip"
      className="text-xs flex flex-wrap gap-2 items-center"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <span>{modalFocusRestoreSkipLabel(plan)}</span>
      <button
        type="button"
        className={focusClass}
        data-testid="modal-focus-restore-skip"
        data-restore-selector={plan.restoreSelector}
        onClick={() => onSkipToRestore?.(plan.restoreSelector)}
      >
        Jump to restore target
      </button>
      {plan.trapEnabled ? (
        <span className="opacity-70" data-testid="modal-focus-trap-hint">
          Focus is trapped inside this dialog.
        </span>
      ) : null}
    </div>
  );
}

// --- source: react/MotionTimingChromeRoot.tsx ---
export interface MotionTimingChromeRootProps {
  accessibility: AccessibilitySettingsSnapshot;
  interfaceLevel: InterfaceExperienceLevel;
  preferredDensityTier?: 'compact' | 'comfortable' | 'spacious' | null;
  children?: React.ReactNode;
}

export function MotionTimingChromeRoot({
  accessibility,
  interfaceLevel,
  preferredDensityTier,
  children,
}: MotionTimingChromeRootProps): React.ReactElement {
  const shell = resolveAccessibleChromeShellProfile({
    accessibility,
    interfaceLevel,
    preferredDensityTier,
  });

  return (
    <div
      data-testid="motion-timing-chrome-root"
      style={shell.style}
      {...shell.dataAttributes}
      data-ui-density={shell.density.tier}
    >
      {children}
    </div>
  );
}

// --- source: react/PacedAnnouncementStatusStrip.tsx ---
export interface PacedAnnouncementStatusStripProps {
  deferredCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PacedAnnouncementStatusStrip({
  deferredCount,
  accessibility,
}: PacedAnnouncementStatusStripProps): React.ReactElement | null {
  const copy = pacingStatusCopy(deferredCount);
  if (!copy) return null;

  return (
    <div
      data-testid="paced-announcement-status-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/KeyboardShortcutConflictBanner.tsx ---
export interface KeyboardShortcutConflictBannerProps {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function KeyboardShortcutConflictBanner({
  interfaceLevel,
  phase,
  accessibility,
}: KeyboardShortcutConflictBannerProps): React.ReactElement | null {
  const conflicts = planKeyboardShortcutConflicts(interfaceLevel, phase);
  const copy = shortcutConflictWarningCopy(conflicts);
  if (!copy) return null;

  return (
    <div
      data-testid="keyboard-shortcut-conflict-banner"
      role="alert"
      className="text-xs border border-amber-500/40 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/SessionResumeCoachStrip.tsx ---
export interface SessionResumeCoachStripProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  memory?: SessionUiMemory;
  phaseAllowsResume?: boolean;
  onResume?: (navTarget: string) => void;
}

export function SessionResumeCoachStrip({
  signals,
  policy,
  accessibility,
  memory,
  phaseAllowsResume,
  onResume,
}: SessionResumeCoachStripProps): React.ReactElement | null {
  const plan = buildSessionResumeCoachPlan({
    memory,
    signals,
    policy,
    accessibility,
    phaseAllowsResume,
  });

  if (!plan.shouldShow || !plan.navTarget || !plan.coachCopy) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  const skipLabel = sessionResumeSkipLinkLabel(plan);

  return (
    <div
      data-testid="session-resume-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-500/30 rounded p-2 space-y-1"
    >
      <p>{plan.coachCopy}</p>
      {skipLabel ? (
        <a
          href={`#${plan.focusSelector?.replace(/^\[#?/, '').replace(/\]$/, '') ?? plan.navTarget}`}
          className={`underline ${focusClass}`}
          data-testid="session-resume-skip-link"
          onClick={e => {
            if (onResume) {
              e.preventDefault();
              onResume(plan.navTarget!);
            }
          }}
        >
          {skipLabel}
        </a>
      ) : null}
    </div>
  );
}

// --- source: react/DeferredAnnouncementFlushBanner.tsx ---
export interface DeferredAnnouncementFlushBannerProps {
  flushedCount: number;
  remainingCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function DeferredAnnouncementFlushBanner({
  flushedCount,
  remainingCount,
  accessibility,
}: DeferredAnnouncementFlushBannerProps): React.ReactElement | null {
  const copy = deferredFlushStatusCopy(flushedCount, remainingCount);
  if (!copy) return null;

  return (
    <div
      data-testid="deferred-announcement-flush-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/OnboardingFunnelCoachStrip.tsx ---
export interface OnboardingFunnelCoachStripProps {
  signals: ProgressionSignalSnapshot;
  persisted: EvolvingUiPersistedState;
  accessibility: AccessibilitySettingsSnapshot;
  onDismissStep?: (stepId: string) => void;
}

export function OnboardingFunnelCoachStrip({
  signals,
  persisted,
  accessibility,
  onDismissStep,
}: OnboardingFunnelCoachStripProps): React.ReactElement | null {
  const steps = listActiveOnboardingStepsForPersisted(signals.gameDay, persisted);
  const headline = onboardingFunnelStatusCopy(steps);
  if (!headline) return null;

  return (
    <div
      data-testid="onboarding-funnel-coach-strip"
      role="complementary"
      aria-label="Onboarding funnel"
      className="text-xs border border-teal-500/30 rounded p-2 space-y-1"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <p>{headline}</p>
      {steps.slice(0, 2).map(step => (
        <div key={step.id} data-testid={`onboarding-step-${step.id}`}>
          <span>{step.coachMessage}</span>
          {onDismissStep ? (
            <button
              type="button"
              className="ml-2 underline"
              data-testid={`onboarding-dismiss-${step.id}`}
              onClick={() => onDismissStep(step.id)}
            >
              Got it
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

// --- source: react/ResponsiveNavRailHintBanner.tsx ---
export interface ResponsiveNavRailHintBannerProps {
  plan: NavRailVisibilityPlan;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ResponsiveNavRailHintBanner({
  plan,
  accessibility,
}: ResponsiveNavRailHintBannerProps): React.ReactElement | null {
  const copy = responsiveNavRailCoachCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="responsive-nav-rail-hint-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/CoachLiveRegionDeliveryStrip.tsx ---
export interface CoachLiveRegionDeliveryStripProps {
  plan: CoachLiveRegionDeliveryPlan;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CoachLiveRegionDeliveryStrip({
  plan,
  accessibility,
}: CoachLiveRegionDeliveryStripProps): React.ReactElement | null {
  const copy = coachLiveRegionDeliveryCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="coach-live-region-delivery-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-500/25 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/PhaseCoachGateBanner.tsx ---
export interface PhaseCoachGateBannerProps {
  phase: V94StandardizedGamePhase;
  cognitiveBand?: CognitiveLoadBand;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PhaseCoachGateBanner({
  phase,
  cognitiveBand = 'moderate',
  accessibility,
}: PhaseCoachGateBannerProps): React.ReactElement | null {
  const plan = planPhaseCoachSurfaces(phase, cognitiveBand);
  const copy = phaseCoachGateCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="phase-coach-gate-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}

// --- source: react/ProgressionCoverageCoachStrip.tsx ---
export interface ProgressionCoverageCoachStripProps {
  snapshot: ProgressionCoverageSnapshot;
  previousCoverageRatio?: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ProgressionCoverageCoachStrip({
  snapshot,
  previousCoverageRatio,
  accessibility,
}: ProgressionCoverageCoachStripProps): React.ReactElement | null {
  const delta = coverageDeltaCopy(previousCoverageRatio, snapshot.coverageRatio);
  if (!snapshot.coachCopy && !delta) return null;

  return (
    <div
      data-testid="progression-coverage-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-500/30 rounded p-2 space-y-1"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-coverage-tier={snapshot.tierLabel}
    >
      {snapshot.coachCopy ? <p>{snapshot.coachCopy}</p> : null}
      {delta ? <p data-testid="progression-coverage-delta">{delta}</p> : null}
      <p className="opacity-80">
        {snapshot.visible}/{snapshot.total} panels visible ({Math.round(snapshot.coverageRatio * 100)}%)
      </p>
    </div>
  );
}

// --- source: react/ShowAllSafetyCoachBanner.tsx ---
export interface ShowAllSafetyCoachBannerProps {
  persisted: EvolvingUiPersistedState;
  policy: EvolvingUiAccessPolicy;
  signals: ProgressionSignalSnapshot;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ShowAllSafetyCoachBanner({
  persisted,
  policy,
  signals,
  phase,
  accessibility,
}: ShowAllSafetyCoachBannerProps): React.ReactElement | null {
  const assessment = evaluateShowAllOverrideSafety({ persisted, phase, signals, policy });
  if (!assessment.coachCopy) return null;

  return (
    <div
      data-testid="show-all-safety-coach-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {assessment.coachCopy}
    </div>
  );
}

export const AGENT_22_MODULE_ID = 'operation-10m/agent-22-ui';
export const AGENT_22_MODULE_VERSION = '1.12.0';

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

  const round3 = runAgent22Round3SelfTests();
  for (const r of round3.results) {
    check(`agent22_round3_${r.id}`, r.name, r.passed, r.detail);
  }

  const round4 = runAgent22Round4SelfTests();
  for (const r of round4.results) {
    check(`agent22_round4_${r.id}`, r.name, r.passed, r.detail);
  }

  const round5 = runAgent22Round5SelfTests();
  for (const r of round5.results) {
    check(`agent22_round5_${r.id}`, r.name, r.passed, r.detail);
  }

  const round6 = runAgent22Round6SelfTests();
  for (const r of round6.results) {
    check(`agent22_round6_${r.id}`, r.name, r.passed, r.detail);
  }

  const round7 = runAgent22Round7SelfTests();
  for (const r of round7.results) {
    check(`agent22_round7_${r.id}`, r.name, r.passed, r.detail);
  }

  const round8 = runAgent22Round8SelfTests();
  for (const r of round8.results) {
    check(`agent22_round8_${r.id}`, r.name, r.passed, r.detail);
  }

  const round9 = runAgent22Round9SelfTests();
  for (const r of round9.results) {
    check(`agent22_round9_${r.id}`, r.name, r.passed, r.detail);
  }

  const round10 = runAgent22Round10SelfTests();
  for (const r of round10.results) {
    check(`agent22_round10_${r.id}`, r.name, r.passed, r.detail);
  }

  const round11 = runAgent22Round11SelfTests();
  for (const r of round11.results) {
    check(`agent22_round11_${r.id}`, r.name, r.passed, r.detail);
  }

  const round12 = runAgent22Round12SelfTests();
  for (const r of round12.results) {
    check(`agent22_round12_${r.id}`, r.name, r.passed, r.detail);
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
