import type { NationalPriorityId } from '../types/national-priority.ts';
import type {
  StrategicActionDefinition,
  StrategicGameplayState,
} from '../types/strategic-action.ts';
import { actionAlreadyCompleted } from './commitment-journal.ts';

export interface StrategicSynergyMatch {
  priorityId: NationalPriorityId;
  completedActionId: string;
  bonusScore: number;
  reason: string;
}

export function detectStrategicSynergies(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  catalog: Record<string, StrategicActionDefinition>,
): StrategicSynergyMatch[] {
  const matches: StrategicSynergyMatch[] = [];
  for (const priorityId of action.alignedPriorities) {
    for (const completedId of state.completedActionIds) {
      if (completedId === action.id) continue;
      const prior = catalog[completedId];
      if (!prior?.alignedPriorities.includes(priorityId)) continue;
      matches.push({
        priorityId,
        completedActionId: completedId,
        bonusScore: 6,
        reason: `Builds on ${prior.title} for ${priorityId.replace(/_/g, ' ')}.`,
      });
    }
  }
  return matches;
}

export function synergyScoreBonus(matches: StrategicSynergyMatch[]): number {
  return matches.reduce((sum, m) => sum + m.bonusScore, 0);
}

export function applySynergyApprovalBoost(
  matches: StrategicSynergyMatch[],
): number {
  if (matches.length === 0) return 0;
  return Math.min(4, 1 + Math.floor(matches.length / 2));
}

export function canExecuteAfterCooldown(
  state: StrategicGameplayState,
  actionId: string,
): boolean {
  const entry = state.actionCooldowns[actionId];
  if (!entry) return true;
  return state.day >= entry.untilDay;
}

export function startActionCooldown(
  state: StrategicGameplayState,
  actionId: string,
  cooldownDays: number,
): StrategicGameplayState {
  return {
    ...state,
    actionCooldowns: {
      ...state.actionCooldowns,
      [actionId]: { untilDay: state.day + cooldownDays },
    },
  };
}

export function countCompletedInCategory(
  state: StrategicGameplayState,
  catalog: Record<string, StrategicActionDefinition>,
  category: StrategicActionDefinition['category'],
): number {
  return state.completedActionIds.filter((id) => catalog[id]?.category === category).length;
}

export function hasCompletedPrerequisiteChain(
  state: StrategicGameplayState,
  chain: string[],
): boolean {
  return chain.every((id) => actionAlreadyCompleted(state, id));
}
