import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { StrategicCrossModuleInbound } from '../integrations/strategic-cross-module-hooks.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { advanceDayAndResolveDelayed } from './delayed-effects.ts';
import { applyMandateIdleDrift } from './mandate-idle-drift.ts';
import { advanceCoalitionCrisisStreak } from './coalition-crisis.ts';
import { applyProlongedCrisisMandatePressure } from './coalition-crisis-pressure.ts';
import { applySustainedRecoveryMandateBonus } from './coalition-recovery-pressure.ts';
import { applyElevatedVolatilityMandateDrag } from './coalition-volatility-pressure.ts';
import { advanceCoalitionStabilizationStreak } from './coalition-stabilization.ts';
import { advanceCoalitionLockInStreak } from './coalition-lock-in.ts';
import { advanceCrossModuleSyncStreak } from '../integrations/strategic-cross-module-hooks.ts';
import {
  advanceIntegratedCoalitionMaturityStreak,
  applyIntegratedCoalitionMandateBonus,
} from './coalition-integrated-maturity.ts';
import {
  advanceCoalitionStewardshipStreak,
  applyStewardshipStakeholderCalm,
} from './coalition-stewardship.ts';
import {
  advanceCoalitionAnchoredGovernanceStreak,
  applyAnchoredGovernanceMandateBonus,
} from './coalition-anchored-governance.ts';
import {
  advanceCoalitionInstitutionalPermanenceStreak,
  applyInstitutionalPermanenceMandateBonus,
} from './coalition-institutional-permanence.ts';
import {
  advanceCoalitionGenerationalContinuityStreak,
  applyGenerationalContinuityMandateBonus,
} from './coalition-generational-continuity.ts';
import {
  advanceCoalitionCivilizationalEnduranceStreak,
  applyCivilizationalEnduranceMandateBonus,
} from './coalition-civilizational-endurance.ts';
import {
  advanceCoalitionTranscendentLegacyStreak,
  applyTranscendentLegacyMandateBonus,
} from './coalition-transcendent-legacy.ts';
import { advanceCoalitionRecoveryStreak } from './coalition-recovery.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';
import type { StakeholderGroupId, StakeholderSentiment } from '../types/coalition-mandate.ts';

const MEAN_SENTIMENT = 55;
const PASSIVE_EROSION_PER_DAY = 1;

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Pull extreme coalition sentiment slightly toward the long-run mean each day. */
export function applyPassiveStakeholderReversion(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  const base = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const sentiment: StakeholderSentiment = { ...base };
  const step = PASSIVE_EROSION_PER_DAY * daysAdvanced;

  for (const group of Object.keys(sentiment) as StakeholderGroupId[]) {
    const value = sentiment[group];
    if (value > MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value - step);
    } else if (value < MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value + step);
    }
  }

  return { ...state, stakeholderSentiment: sentiment };
}

export interface AdvanceStrategicCalendarResult {
  state: StrategicGameplayState;
  firedTradeOffCount: number;
}

/** Agent 02 calendar hook — resolves delayed trade-offs, mandate drift, coalition reversion. */
export function advanceStrategicGameplayCalendar(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  toDay: number,
  crossModuleInbound?: StrategicCrossModuleInbound,
): AdvanceStrategicCalendarResult {
  if (toDay <= state.day) {
    return { state, firedTradeOffCount: 0 };
  }

  const daysAdvanced = toDay - state.day;
  const { state: afterDelayed, fired } = advanceDayAndResolveDelayed(state, contracts, toDay);
  let next = applyMandateIdleDrift(afterDelayed, toDay);
  next = advanceCoalitionCrisisStreak(next, daysAdvanced);
  next = applyProlongedCrisisMandatePressure(next, daysAdvanced);
  next = advanceCoalitionRecoveryStreak(next, daysAdvanced);
  next = applySustainedRecoveryMandateBonus(next, daysAdvanced);
  next = applyElevatedVolatilityMandateDrag(next, daysAdvanced);
  next = advanceCoalitionLockInStreak(next, daysAdvanced);
  next = advanceCrossModuleSyncStreak(next, daysAdvanced, crossModuleInbound);
  next = advanceIntegratedCoalitionMaturityStreak(next, daysAdvanced);
  next = applyIntegratedCoalitionMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStewardshipStreak(next, daysAdvanced);
  next = applyStewardshipStakeholderCalm(next, daysAdvanced);
  next = advanceCoalitionAnchoredGovernanceStreak(next, daysAdvanced);
  next = applyAnchoredGovernanceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionInstitutionalPermanenceStreak(next, daysAdvanced);
  next = applyInstitutionalPermanenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionGenerationalContinuityStreak(next, daysAdvanced);
  next = applyGenerationalContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionCivilizationalEnduranceStreak(next, daysAdvanced);
  next = applyCivilizationalEnduranceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionTranscendentLegacyStreak(next, daysAdvanced);
  next = applyTranscendentLegacyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStabilizationStreak(next, daysAdvanced);
  next = applyPassiveStakeholderReversion(next, daysAdvanced);

  return { state: next, firedTradeOffCount: fired.length };
}
