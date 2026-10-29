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
