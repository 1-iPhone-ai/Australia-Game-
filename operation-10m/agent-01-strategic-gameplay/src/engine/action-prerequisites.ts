import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';
import { actionAlreadyCompleted } from './commitment-journal.ts';

export function validatePrerequisites(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicValidationIssue[] {
  const ids = action.prerequisiteActionIds ?? [];
  if (ids.length === 0) return [];

  const missing = ids.filter((id) => !actionAlreadyCompleted(state, id));
  if (missing.length === 0) return [];

  return [
    {
      code: 'MISSING_PREREQUISITES',
      message: `Complete first: ${missing.join(', ')}`,
      requirement: { kind: 'action_not_yet_completed', actionId: missing[0] },
    },
  ];
}
