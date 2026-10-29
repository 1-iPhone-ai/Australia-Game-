import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  listAvailableKeyboardShortcuts,
  type KeyboardShortcutDefinition,
} from './keyboard-shortcut-progression.js';

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
