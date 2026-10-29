import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { planKeyboardHintsDisplay } from './keyboard-hints-priority-plan.js';

export interface KeyboardHintsDayCoach {
  shortcutCount: number;
  conflictCount: number;
  coachCopy: string | null;
}

export function buildKeyboardHintsDayCoach(input: {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
}): KeyboardHintsDayCoach {
  const plan = planKeyboardHintsDisplay(input.interfaceLevel, input.phase);

  let coachCopy = plan.coachCopy;
  if (coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${coachCopy}`;
  }

  return {
    shortcutCount: plan.shortcuts.length,
    conflictCount: plan.conflictCount,
    coachCopy,
  };
}
