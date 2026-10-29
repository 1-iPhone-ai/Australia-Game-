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
import { isGenerationalCoalitionContinuity } from '../engine/coalition-generational-continuity.ts';
import { isCivilizationalCoalitionEndurance } from '../engine/coalition-civilizational-endurance.ts';
import { isTranscendentCoalitionLegacy } from '../engine/coalition-transcendent-legacy.ts';
import { isSovereignCoalitionContinuum } from '../engine/coalition-sovereign-continuum.ts';
import { isEternalCoalitionAscendance } from '../engine/coalition-eternal-ascendance.ts';
import { isInfiniteCoalitionPersistence } from '../engine/coalition-infinite-persistence.ts';
import { isPrimordialCoalitionContinuity } from '../engine/coalition-primordial-continuity.ts';
import { isAbsoluteCoalitionSanctity } from '../engine/coalition-absolute-sanctity.ts';
import { isUniversalCoalitionImmortality } from '../engine/coalition-universal-immortality.ts';
import { isCosmicCoalitionPerpetuity } from '../engine/coalition-cosmic-perpetuity.ts';
import { isGalacticCoalitionInfinity } from '../engine/coalition-galactic-infinity.ts';
import { isStellarCoalitionTranscendence } from '../engine/coalition-stellar-transcendence.ts';
import { isQuantumCoalitionOmnipresence } from '../engine/coalition-quantum-omnipresence.ts';
import { isMultiversalCoalitionPersistence } from '../engine/coalition-multiversal-persistence.ts';

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
  generationalCoalitionContinuity: boolean;
  coalitionGenerationalContinuityStreakDays: number;
  civilizationalCoalitionEndurance: boolean;
  coalitionCivilizationalEnduranceStreakDays: number;
  transcendentCoalitionLegacy: boolean;
  coalitionTranscendentLegacyStreakDays: number;
  sovereignCoalitionContinuum: boolean;
  coalitionSovereignContinuumStreakDays: number;
  eternalCoalitionAscendance: boolean;
  coalitionEternalAscendanceStreakDays: number;
  infiniteCoalitionPersistence: boolean;
  coalitionInfinitePersistenceStreakDays: number;
  primordialCoalitionContinuity: boolean;
  coalitionPrimordialContinuityStreakDays: number;
  absoluteCoalitionSanctity: boolean;
  coalitionAbsoluteSanctityStreakDays: number;
  universalCoalitionImmortality: boolean;
  coalitionUniversalImmortalityStreakDays: number;
  cosmicCoalitionPerpetuity: boolean;
  coalitionCosmicPerpetuityStreakDays: number;
  galacticCoalitionInfinity: boolean;
  coalitionGalacticInfinityStreakDays: number;
  stellarCoalitionTranscendence: boolean;
  coalitionStellarTranscendenceStreakDays: number;
  quantumCoalitionOmnipresence: boolean;
  coalitionQuantumOmnipresenceStreakDays: number;
  multiversalCoalitionPersistence: boolean;
  coalitionMultiversalPersistenceStreakDays: number;
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
    generationalCoalitionContinuity: isGenerationalCoalitionContinuity(state),
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
    civilizationalCoalitionEndurance: isCivilizationalCoalitionEndurance(state),
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: isTranscendentCoalitionLegacy(state),
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: isSovereignCoalitionContinuum(state),
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: isEternalCoalitionAscendance(state),
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: isInfiniteCoalitionPersistence(state),
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: isPrimordialCoalitionContinuity(state),
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: isAbsoluteCoalitionSanctity(state),
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: isUniversalCoalitionImmortality(state),
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: isCosmicCoalitionPerpetuity(state),
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: isGalacticCoalitionInfinity(state),
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: isStellarCoalitionTranscendence(state),
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: isQuantumCoalitionOmnipresence(state),
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: isMultiversalCoalitionPersistence(state),
    coalitionMultiversalPersistenceStreakDays: state.coalitionMultiversalPersistenceStreakDays ?? 0,
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
    generationalCoalitionContinuity: raw?.generationalCoalitionContinuity ?? false,
    coalitionGenerationalContinuityStreakDays: raw?.coalitionGenerationalContinuityStreakDays ?? 0,
    civilizationalCoalitionEndurance: raw?.civilizationalCoalitionEndurance ?? false,
    coalitionCivilizationalEnduranceStreakDays: raw?.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: raw?.transcendentCoalitionLegacy ?? false,
    coalitionTranscendentLegacyStreakDays: raw?.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: raw?.sovereignCoalitionContinuum ?? false,
    coalitionSovereignContinuumStreakDays: raw?.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: raw?.eternalCoalitionAscendance ?? false,
    coalitionEternalAscendanceStreakDays: raw?.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: raw?.infiniteCoalitionPersistence ?? false,
    coalitionInfinitePersistenceStreakDays: raw?.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: raw?.primordialCoalitionContinuity ?? false,
    coalitionPrimordialContinuityStreakDays: raw?.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: raw?.absoluteCoalitionSanctity ?? false,
    coalitionAbsoluteSanctityStreakDays: raw?.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: raw?.universalCoalitionImmortality ?? false,
    coalitionUniversalImmortalityStreakDays: raw?.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: raw?.cosmicCoalitionPerpetuity ?? false,
    coalitionCosmicPerpetuityStreakDays: raw?.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: raw?.galacticCoalitionInfinity ?? false,
    coalitionGalacticInfinityStreakDays: raw?.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: raw?.stellarCoalitionTranscendence ?? false,
    coalitionStellarTranscendenceStreakDays: raw?.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: raw?.quantumCoalitionOmnipresence ?? false,
    coalitionQuantumOmnipresenceStreakDays: raw?.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: raw?.multiversalCoalitionPersistence ?? false,
    coalitionMultiversalPersistenceStreakDays: raw?.coalitionMultiversalPersistenceStreakDays ?? 0,
  };
}
