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
import {
  advanceCoalitionSovereignContinuumStreak,
  applySovereignContinuumMandateBonus,
} from './coalition-sovereign-continuum.ts';
import {
  advanceCoalitionEternalAscendanceStreak,
  applyEternalAscendanceMandateBonus,
} from './coalition-eternal-ascendance.ts';
import {
  advanceCoalitionInfinitePersistenceStreak,
  applyInfinitePersistenceMandateBonus,
} from './coalition-infinite-persistence.ts';
import {
  advanceCoalitionPrimordialContinuityStreak,
  applyPrimordialContinuityMandateBonus,
} from './coalition-primordial-continuity.ts';
import {
  advanceCoalitionAbsoluteSanctityStreak,
  applyAbsoluteSanctityMandateBonus,
} from './coalition-absolute-sanctity.ts';
import {
  advanceCoalitionUniversalImmortalityStreak,
  applyUniversalImmortalityMandateBonus,
} from './coalition-universal-immortality.ts';
import {
  advanceCoalitionCosmicPerpetuityStreak,
  applyCosmicPerpetuityMandateBonus,
} from './coalition-cosmic-perpetuity.ts';
import {
  advanceCoalitionGalacticInfinityStreak,
  applyGalacticInfinityMandateBonus,
} from './coalition-galactic-infinity.ts';
import {
  advanceCoalitionStellarTranscendenceStreak,
  applyStellarTranscendenceMandateBonus,
} from './coalition-stellar-transcendence.ts';
import {
  advanceCoalitionQuantumOmnipresenceStreak,
  applyQuantumOmnipresenceMandateBonus,
} from './coalition-quantum-omnipresence.ts';
import {
  advanceCoalitionMultiversalPersistenceStreak,
  applyMultiversalPersistenceMandateBonus,
} from './coalition-multiversal-persistence.ts';
import {
  advanceCoalitionMetaversalContinuityStreak,
  applyMetaversalContinuityMandateBonus,
} from './coalition-metaversal-continuity.ts';
import {
  advanceCoalitionOmniversalSynthesisStreak,
  applyOmniversalSynthesisMandateBonus,
} from './coalition-omniversal-synthesis.ts';
import {
  advanceCoalitionHyperversalHarmonizationStreak,
  applyHyperversalHarmonizationMandateBonus,
} from './coalition-hyperversal-harmonization.ts';
import {
  advanceCoalitionTranscendentOmniumStreak,
  applyTranscendentOmniumMandateBonus,
} from './coalition-transcendent-omnium.ts';
import {
  advanceCoalitionSupremeConvergenceStreak,
  applySupremeConvergenceMandateBonus,
} from './coalition-supreme-convergence.ts';
import {
  advanceCoalitionApexTranscendenceStreak,
  applyApexTranscendenceMandateBonus,
} from './coalition-apex-transcendence.ts';
import {
  advanceCoalitionZenithPerpetuityStreak,
  applyZenithPerpetuityMandateBonus,
} from './coalition-zenith-perpetuity.ts';
import {
  advanceCoalitionParagonInfinityStreak,
  applyParagonInfinityMandateBonus,
} from './coalition-paragon-infinity.ts';
import {
  advanceCoalitionParamountAscendancyStreak,
  applyParamountAscendancyMandateBonus,
} from './coalition-paramount-ascendancy.ts';
import {
  advanceCoalitionImperialPerpetuityStreak,
  applyImperialPerpetuityMandateBonus,
} from './coalition-imperial-perpetuity.ts';
import {
  advanceCoalitionCustodialEternityStreak,
  applyCustodialEternityMandateBonus,
} from './coalition-custodial-eternity.ts';
import {
  advanceCoalitionVanguardSynthesisStreak,
  applyVanguardSynthesisMandateBonus,
} from './coalition-vanguard-synthesis.ts';
import {
  advanceCoalitionSentinelAscendancyStreak,
  applySentinelAscendancyMandateBonus,
} from './coalition-sentinel-ascendancy.ts';
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
  next = advanceCoalitionSovereignContinuumStreak(next, daysAdvanced);
  next = applySovereignContinuumMandateBonus(next, daysAdvanced);
  next = advanceCoalitionEternalAscendanceStreak(next, daysAdvanced);
  next = applyEternalAscendanceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionInfinitePersistenceStreak(next, daysAdvanced);
  next = applyInfinitePersistenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionPrimordialContinuityStreak(next, daysAdvanced);
  next = applyPrimordialContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionAbsoluteSanctityStreak(next, daysAdvanced);
  next = applyAbsoluteSanctityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionUniversalImmortalityStreak(next, daysAdvanced);
  next = applyUniversalImmortalityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionCosmicPerpetuityStreak(next, daysAdvanced);
  next = applyCosmicPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionGalacticInfinityStreak(next, daysAdvanced);
  next = applyGalacticInfinityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStellarTranscendenceStreak(next, daysAdvanced);
  next = applyStellarTranscendenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionQuantumOmnipresenceStreak(next, daysAdvanced);
  next = applyQuantumOmnipresenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMultiversalPersistenceStreak(next, daysAdvanced);
  next = applyMultiversalPersistenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMetaversalContinuityStreak(next, daysAdvanced);
  next = applyMetaversalContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionOmniversalSynthesisStreak(next, daysAdvanced);
  next = applyOmniversalSynthesisMandateBonus(next, daysAdvanced);
  next = advanceCoalitionHyperversalHarmonizationStreak(next, daysAdvanced);
  next = applyHyperversalHarmonizationMandateBonus(next, daysAdvanced);
  next = advanceCoalitionTranscendentOmniumStreak(next, daysAdvanced);
  next = applyTranscendentOmniumMandateBonus(next, daysAdvanced);
  next = advanceCoalitionSupremeConvergenceStreak(next, daysAdvanced);
  next = applySupremeConvergenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionApexTranscendenceStreak(next, daysAdvanced);
  next = applyApexTranscendenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionZenithPerpetuityStreak(next, daysAdvanced);
  next = applyZenithPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionParagonInfinityStreak(next, daysAdvanced);
  next = applyParagonInfinityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionParamountAscendancyStreak(next, daysAdvanced);
  next = applyParamountAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionImperialPerpetuityStreak(next, daysAdvanced);
  next = applyImperialPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionCustodialEternityStreak(next, daysAdvanced);
  next = applyCustodialEternityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionVanguardSynthesisStreak(next, daysAdvanced);
  next = applyVanguardSynthesisMandateBonus(next, daysAdvanced);
  next = advanceCoalitionSentinelAscendancyStreak(next, daysAdvanced);
  next = applySentinelAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStabilizationStreak(next, daysAdvanced);
  next = applyPassiveStakeholderReversion(next, daysAdvanced);

  return { state: next, firedTradeOffCount: fired.length };
}
