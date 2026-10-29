import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility } from '../engine/resolve-panel-visibility.js';
import { formatPanelUnlockAnnouncement } from '../a11y/live-region-controller.js';
import { buildUnlockHintForPanel } from '../engine/unlock-hint-formatter.js';

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
}

export interface DayAdvanceUiEvolutionResult {
  gameDay: number;
  newlyUnlockedPanelIds: string[];
  coachAnnouncements: string[];
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

  return {
    gameDay: nextSignals.gameDay,
    newlyUnlockedPanelIds,
    coachAnnouncements,
    updatedPersisted,
    visiblePanelCount,
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
