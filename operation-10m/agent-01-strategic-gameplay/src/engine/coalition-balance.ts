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

export function stewardshipRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStewardshipStreakDays === undefined) return 0;
  const streak = state.coalitionStewardshipStreakDays ?? 0;
  if (streak >= action.minCoalitionStewardshipStreakDays) return 5;
  return 2;
}

export function anchoredGovernanceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionAnchoredGovernanceStreakDays === undefined) return 0;
  const streak = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  if (streak >= action.minCoalitionAnchoredGovernanceStreakDays) return 6;
  return 2;
}

export function institutionalPermanenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionInstitutionalPermanenceStreakDays === undefined) return 0;
  const streak = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInstitutionalPermanenceStreakDays) return 7;
  return 2;
}

export function generationalContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionGenerationalContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionGenerationalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionGenerationalContinuityStreakDays) return 8;
  return 2;
}

export function civilizationalEnduranceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCivilizationalEnduranceStreakDays === undefined) return 0;
  const streak = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  if (streak >= action.minCoalitionCivilizationalEnduranceStreakDays) return 9;
  return 2;
}

export function transcendentLegacyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionTranscendentLegacyStreakDays === undefined) return 0;
  const streak = state.coalitionTranscendentLegacyStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentLegacyStreakDays) return 10;
  return 2;
}

export function sovereignContinuumRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSovereignContinuumStreakDays === undefined) return 0;
  const streak = state.coalitionSovereignContinuumStreakDays ?? 0;
  if (streak >= action.minCoalitionSovereignContinuumStreakDays) return 11;
  return 2;
}

export function eternalAscendanceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionEternalAscendanceStreakDays === undefined) return 0;
  const streak = state.coalitionEternalAscendanceStreakDays ?? 0;
  if (streak >= action.minCoalitionEternalAscendanceStreakDays) return 12;
  return 2;
}

export function infinitePersistenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionInfinitePersistenceStreakDays === undefined) return 0;
  const streak = state.coalitionInfinitePersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInfinitePersistenceStreakDays) return 13;
  return 2;
}

export function primordialContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPrimordialContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionPrimordialContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimordialContinuityStreakDays) return 14;
  return 2;
}

export function absoluteSanctityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionAbsoluteSanctityStreakDays === undefined) return 0;
  const streak = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  if (streak >= action.minCoalitionAbsoluteSanctityStreakDays) return 15;
  return 2;
}

export function universalImmortalityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionUniversalImmortalityStreakDays === undefined) return 0;
  const streak = state.coalitionUniversalImmortalityStreakDays ?? 0;
  if (streak >= action.minCoalitionUniversalImmortalityStreakDays) return 16;
  return 2;
}

export function cosmicPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCosmicPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionCosmicPerpetuityStreakDays) return 17;
  return 2;
}

export function galacticInfinityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionGalacticInfinityStreakDays === undefined) return 0;
  const streak = state.coalitionGalacticInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionGalacticInfinityStreakDays) return 18;
  return 2;
}
