import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility } from '../engine/resolve-panel-visibility.js';
import type { UiDensityTier } from '../engine/ui-density-progression.js';
import type { EvolvingUiPersistedState } from './evolution-hooks.js';

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
