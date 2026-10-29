import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  listAvailableKeyboardShortcuts,
  type KeyboardShortcutDefinition,
} from './keyboard-shortcut-progression.js';
import { planKeyboardShortcutConflicts } from './keyboard-shortcut-conflict-guard.js';

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
