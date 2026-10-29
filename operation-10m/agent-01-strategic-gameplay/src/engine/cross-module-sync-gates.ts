import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function crossModuleSyncStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCrossModuleSyncStreakDays === undefined) return [];

  const streak = state.crossModuleSyncStreakDays ?? 0;
  if (streak >= action.minCrossModuleSyncStreakDays) return [];

  return [
    {
      code: 'CROSS_MODULE_SYNC_STREAK_TOO_SHORT',
      message: `Cross-module sync streak ${streak} below required ${action.minCrossModuleSyncStreakDays} day(s).`,
      requirement: {
        kind: 'min_cross_module_sync_streak',
        minDays: action.minCrossModuleSyncStreakDays,
      },
    },
  ];
}
