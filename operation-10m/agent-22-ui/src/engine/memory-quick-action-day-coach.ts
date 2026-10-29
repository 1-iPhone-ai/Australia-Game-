import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import { createDefaultSessionUiMemory } from '../sim/session-ui-memory.js';
import { listContextualQuickActions } from './contextual-quick-actions.js';
import {
  memoryQuickActionCoachCopy,
  rankContextualQuickActionsWithMemory,
} from './memory-weighted-quick-actions.js';

export interface MemoryQuickActionDayCoach {
  boostedNavTarget: string | null;
  coachCopy: string | null;
}

export function buildMemoryQuickActionDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  phase: V94StandardizedGamePhase;
  sessionMemory?: SessionUiMemory;
  nextGameDay: number;
}): MemoryQuickActionDayCoach {
  const memory = input.sessionMemory ?? createDefaultSessionUiMemory();
  const actions = listContextualQuickActions(input.phase, input.signals.gameDay);
  const ranked = rankContextualQuickActionsWithMemory(actions, memory);
  const top = ranked[0];
  if (!top || !memory.lastNavTarget) {
    return { boostedNavTarget: null, coachCopy: null };
  }

  const boostedNavTarget = memory.lastNavTarget;
  const baseCopy = memoryQuickActionCoachCopy(boostedNavTarget);
  const coachCopy = baseCopy ? `Day ${input.nextGameDay}: ${baseCopy}` : null;

  return { boostedNavTarget, coachCopy };
}
