import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

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
