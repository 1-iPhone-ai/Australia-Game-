import type { NationalPriorityId } from '../types/national-priority.ts';
import type {
  StrategicActionDefinition,
  StrategicGameplayState,
} from '../types/strategic-action.ts';

export function createEmptyPriorityMomentum(): Partial<Record<NationalPriorityId, number>> {
  return {};
}

export function applyPriorityMomentum(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const momentum = { ...state.priorityMomentum };
  for (const id of action.alignedPriorities) {
    momentum[id] = Math.min(100, (momentum[id] ?? 0) + 8);
  }
  for (const id of action.conflictingPriorities) {
    momentum[id] = Math.max(0, (momentum[id] ?? 0) - 5);
  }
  return { ...state, priorityMomentum: momentum };
}

export function priorityMomentumBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  let bonus = 0;
  for (const id of action.alignedPriorities) {
    bonus += Math.floor((state.priorityMomentum[id] ?? 0) / 10);
  }
  return bonus;
}
