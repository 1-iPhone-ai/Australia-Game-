import type { ContextualQuickAction } from './contextual-quick-actions.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

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
