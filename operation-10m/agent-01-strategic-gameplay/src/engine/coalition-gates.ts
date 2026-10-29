import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';
import { computeCoalitionBalanceIndex } from './coalition-balance.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';

export function coalitionBalanceIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  const issues: StrategicValidationIssue[] = [];

  if (
    action.minCoalitionBalanceIndex !== undefined &&
    index < action.minCoalitionBalanceIndex
  ) {
    issues.push({
      code: 'COALITION_BALANCE_TOO_LOW',
      message: `Coalition balance ${index} below required ${action.minCoalitionBalanceIndex}.`,
      requirement: {
        kind: 'min_coalition_balance',
        minIndex: action.minCoalitionBalanceIndex,
      },
    });
  }

  if (
    action.maxCoalitionBalanceIndex !== undefined &&
    index > action.maxCoalitionBalanceIndex
  ) {
    issues.push({
      code: 'COALITION_NOT_IN_CRISIS',
      message: `Coalition balance ${index} is too healthy for crisis-only action (max ${action.maxCoalitionBalanceIndex}).`,
      requirement: {
        kind: 'max_coalition_balance',
        maxIndex: action.maxCoalitionBalanceIndex,
      },
    });
  }

  return issues;
}
