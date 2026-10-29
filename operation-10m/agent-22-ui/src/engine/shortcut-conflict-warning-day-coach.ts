import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  planKeyboardShortcutConflicts,
  shortcutConflictWarningCopy,
} from './keyboard-shortcut-conflict-guard.js';

export interface ShortcutConflictWarningDayCoach {
  conflictCount: number;
  coachCopy: string | null;
}

export function buildShortcutConflictWarningDayCoach(input: {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
}): ShortcutConflictWarningDayCoach {
  const conflicts = planKeyboardShortcutConflicts(input.interfaceLevel, input.phase);
  const base = shortcutConflictWarningCopy(conflicts);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    conflictCount: conflicts.length,
    coachCopy,
  };
}
