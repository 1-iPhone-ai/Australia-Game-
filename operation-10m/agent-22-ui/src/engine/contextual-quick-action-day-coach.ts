import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { listContextualQuickActions } from './contextual-quick-actions.js';

export interface ContextualQuickActionDayCoach {
  actionCount: number;
  coachCopy: string | null;
}

export function buildContextualQuickActionDayCoach(input: {
  phase: V94StandardizedGamePhase;
  gameDay: number;
  nextGameDay: number;
  limit?: number;
}): ContextualQuickActionDayCoach {
  const actions = listContextualQuickActions(input.phase, input.gameDay, input.limit ?? 6);
  if (!actions.length) {
    return { actionCount: 0, coachCopy: null };
  }
  const preview = actions
    .slice(0, 2)
    .map(a => a.label)
    .join(', ');
  const coachCopy = `Day ${input.nextGameDay}: ${actions.length} contextual quick actions (${preview}${actions.length > 2 ? '…' : ''}).`;
  return { actionCount: actions.length, coachCopy };
}
