import type { StakeholderSentiment } from '../types/coalition-mandate.ts';
import type { StrategicActionDefinition, StrategicGameplayState } from '../types/strategic-action.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';

const STAKEHOLDER_GROUPS: (keyof StakeholderSentiment)[] = [
  'industry',
  'households',
  'regions',
  'public_services',
];

export function computeCoalitionBalanceIndex(
  sentiment: StakeholderSentiment = createDefaultStakeholderSentiment(),
): number {
  const values = STAKEHOLDER_GROUPS.map((g) => sentiment[g]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const spreadPenalty = Math.sqrt(variance) * 1.4;
  return Math.max(0, Math.min(100, Math.round(100 - spreadPenalty)));
}

export function coalitionBalanceRankingBonus(state: StrategicGameplayState): number {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  if (index >= 85) return 6;
  if (index >= 70) return 3;
  if (index < 45) return -4;
  return 0;
}

export function coalitionRecoveryRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionRecoveryStreakDays === undefined) return 0;
  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= action.minCoalitionRecoveryStreakDays) return 5;
  return 2;
}

export function sustainedRecoveryRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionRecoveryStreakDays === undefined) return 0;
  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= 4) return 4;
  return 0;
}

export function stabilizationRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStabilizationStreakDays === undefined) return 0;
  const streak = state.coalitionStabilizationStreakDays ?? 0;
  if (streak >= action.minCoalitionStabilizationStreakDays) return 5;
  return 2;
}

export function lockInRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionLockInStreakDays === undefined) return 0;
  const streak = state.coalitionLockInStreakDays ?? 0;
  if (streak >= action.minCoalitionLockInStreakDays) return 4;
  return 0;
}

export function crossModuleSyncRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCrossModuleSyncStreakDays === undefined) return 0;
  const streak = state.crossModuleSyncStreakDays ?? 0;
  if (streak >= action.minCrossModuleSyncStreakDays) return 5;
  return 2;
}

export function integratedMaturityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minIntegratedCoalitionMaturityStreakDays === undefined) return 0;
  const streak = state.integratedCoalitionMaturityStreakDays ?? 0;
  if (streak >= action.minIntegratedCoalitionMaturityStreakDays) return 6;
  return 2;
}
