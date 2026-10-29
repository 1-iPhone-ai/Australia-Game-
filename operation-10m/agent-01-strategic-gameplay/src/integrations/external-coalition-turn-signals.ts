import type { CoalitionCrisisLevel } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { computeCoalitionBalanceIndex } from '../engine/coalition-balance.ts';
import { classifyCoalitionCrisisLevel } from '../engine/coalition-crisis.ts';
import { isCoalitionStabilizationReady } from '../engine/coalition-stabilization.ts';
import { isElevatedCoalitionVolatility } from '../engine/coalition-volatility-pressure.ts';
import { isPostStabilizationLockIn } from '../engine/coalition-lock-in.ts';
import { isIntegratedCoalitionMaturity } from '../engine/coalition-integrated-maturity.ts';
import { isSustainedIntegratedCoalitionStewardship } from '../engine/coalition-stewardship.ts';
import { isAnchoredCoalitionGovernance } from '../engine/coalition-anchored-governance.ts';
import { isInstitutionalCoalitionPermanence } from '../engine/coalition-institutional-permanence.ts';

/** Outbound coalition telemetry for Agent 02 / Agent 05 assembly hooks (round 10+). */
export interface ExternalCoalitionTurnSignals {
  coalitionCrisisLevel: CoalitionCrisisLevel;
  coalitionBalanceIndex: number;
  coalitionVolatilityEvents: number;
  elevatedCoalitionVolatility: boolean;
  coalitionStabilizationReady: boolean;
  postStabilizationLockIn: boolean;
  crossModuleSyncStreakDays: number;
  integratedCoalitionMaturity: boolean;
  integratedCoalitionMaturityStreakDays: number;
  sustainedIntegratedCoalitionStewardship: boolean;
  coalitionStewardshipStreakDays: number;
  anchoredCoalitionGovernance: boolean;
  coalitionAnchoredGovernanceStreakDays: number;
  institutionalCoalitionPermanence: boolean;
  coalitionInstitutionalPermanenceStreakDays: number;
}

export function buildExternalCoalitionTurnSignals(
  state: StrategicGameplayState,
): ExternalCoalitionTurnSignals {
  const sentiment = state.stakeholderSentiment;
  return {
    coalitionCrisisLevel: classifyCoalitionCrisisLevel(state),
    coalitionBalanceIndex: computeCoalitionBalanceIndex(sentiment),
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: isElevatedCoalitionVolatility(state),
    coalitionStabilizationReady: isCoalitionStabilizationReady(state),
    postStabilizationLockIn: isPostStabilizationLockIn(state),
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: isIntegratedCoalitionMaturity(state),
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: isSustainedIntegratedCoalitionStewardship(state),
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: isAnchoredCoalitionGovernance(state),
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: isInstitutionalCoalitionPermanence(state),
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
  };
}

export function normalizeExternalCoalitionTurnSignals(
  raw: ExternalCoalitionTurnSignals | undefined,
): ExternalCoalitionTurnSignals {
  return {
    coalitionCrisisLevel: raw?.coalitionCrisisLevel ?? 'stable',
    coalitionBalanceIndex: raw?.coalitionBalanceIndex ?? 0,
    coalitionVolatilityEvents: raw?.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: raw?.elevatedCoalitionVolatility ?? false,
    coalitionStabilizationReady: raw?.coalitionStabilizationReady ?? false,
    postStabilizationLockIn: raw?.postStabilizationLockIn ?? false,
    crossModuleSyncStreakDays: raw?.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: raw?.integratedCoalitionMaturity ?? false,
    integratedCoalitionMaturityStreakDays: raw?.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: raw?.sustainedIntegratedCoalitionStewardship ?? false,
    coalitionStewardshipStreakDays: raw?.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: raw?.anchoredCoalitionGovernance ?? false,
    coalitionAnchoredGovernanceStreakDays: raw?.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: raw?.institutionalCoalitionPermanence ?? false,
    coalitionInstitutionalPermanenceStreakDays: raw?.coalitionInstitutionalPermanenceStreakDays ?? 0,
  };
}
