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

export function stellarTranscendenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStellarTranscendenceStreakDays === undefined) return 0;
  const streak = state.coalitionStellarTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionStellarTranscendenceStreakDays) return 19;
  return 2;
}

export function quantumOmnipresenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionQuantumOmnipresenceStreakDays === undefined) return 0;
  const streak = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  if (streak >= action.minCoalitionQuantumOmnipresenceStreakDays) return 20;
  return 2;
}

export function multiversalPersistenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMultiversalPersistenceStreakDays === undefined) return 0;
  const streak = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMultiversalPersistenceStreakDays) return 21;
  return 2;
}

export function metaversalContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMetaversalContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionMetaversalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMetaversalContinuityStreakDays) return 22;
  return 2;
}

export function omniversalSynthesisRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionOmniversalSynthesisStreakDays === undefined) return 0;
  const streak = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionOmniversalSynthesisStreakDays) return 23;
  return 2;
}

export function hyperversalHarmonizationRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionHyperversalHarmonizationStreakDays === undefined) return 0;
  const streak = state.coalitionHyperversalHarmonizationStreakDays ?? 0;
  if (streak >= action.minCoalitionHyperversalHarmonizationStreakDays) return 24;
  return 2;
}

export function transcendentOmniumRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionTranscendentOmniumStreakDays === undefined) return 0;
  const streak = state.coalitionTranscendentOmniumStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentOmniumStreakDays) return 25;
  return 2;
}

export function supremeConvergenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSupremeConvergenceStreakDays === undefined) return 0;
  const streak = state.coalitionSupremeConvergenceStreakDays ?? 0;
  if (streak >= action.minCoalitionSupremeConvergenceStreakDays) return 26;
  return 2;
}

export function apexTranscendenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionApexTranscendenceStreakDays === undefined) return 0;
  const streak = state.coalitionApexTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionApexTranscendenceStreakDays) return 27;
  return 2;
}

export function zenithPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionZenithPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionZenithPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionZenithPerpetuityStreakDays) return 28;
  return 2;
}

export function paragonInfinityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionParagonInfinityStreakDays === undefined) return 0;
  const streak = state.coalitionParagonInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionParagonInfinityStreakDays) return 29;
  return 2;
}

export function paramountAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionParamountAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionParamountAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionParamountAscendancyStreakDays) return 30;
  return 2;
}

export function imperialPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionImperialPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionImperialPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionImperialPerpetuityStreakDays) return 31;
  return 2;
}

export function custodialEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCustodialEternityStreakDays === undefined) return 0;
  const streak = state.coalitionCustodialEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionCustodialEternityStreakDays) return 32;
  return 2;
}

export function vanguardSynthesisRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionVanguardSynthesisStreakDays === undefined) return 0;
  const streak = state.coalitionVanguardSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionVanguardSynthesisStreakDays) return 33;
  return 2;
}

export function sentinelAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSentinelAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionSentinelAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionSentinelAscendancyStreakDays) return 34;
  return 2;
}

export function oraclePerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionOraclePerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionOraclePerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionOraclePerpetuityStreakDays) return 35;
  return 2;
}

export function archonEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionArchonEternityStreakDays === undefined) return 0;
  const streak = state.coalitionArchonEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionArchonEternityStreakDays) return 36;
  return 2;
}

export function exarchAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionExarchAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionExarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionExarchAscendancyStreakDays) return 37;
  return 2;
}

export function primarchPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPrimarchPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimarchPerpetuityStreakDays) return 38;
  return 2;
}

export function patriarchEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPatriarchEternityStreakDays === undefined) return 0;
  const streak = state.coalitionPatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionPatriarchEternityStreakDays) return 39;
  return 2;
}

export function matriarchAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchAscendancyStreakDays) return 40;
  return 2;
}

export function matriarchPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchPerpetuityStreakDays) return 41;
  return 2;
}

export function matriarchEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchEternityStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchEternityStreakDays) return 42;
  return 2;
}
