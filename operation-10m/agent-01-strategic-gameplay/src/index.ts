export type { StrategicGameplayContracts } from './contracts/index.ts';
export * from './contracts/index.ts';

export * from './types/national-priority.ts';
export * from './types/strategic-action.ts';

export {
  advanceDayAndResolveDelayed,
  applyDomainEffects,
  resetDelayedEffectSequence,
  scheduleDelayedTradeOffs,
} from './engine/delayed-effects.ts';

export {
  actionAlreadyCompleted,
  appendJournalEntry,
  computeCommitmentPressure,
  DEFAULT_MAX_PENDING_TRADE_OFFS,
  pendingTradeOffCount,
} from './engine/commitment-journal.ts';

export { rankStrategicActions } from './engine/strategic-recommendations.ts';

export { buildConsequenceForecast, mergeConsequenceForecasts } from './engine/consequence-forecast.ts';
export { validatePrerequisites } from './engine/action-prerequisites.ts';
export {
  applyPriorityMomentum,
  createEmptyPriorityMomentum,
  priorityMomentumBonus,
} from './engine/priority-momentum.ts';

export {
  scoreNationalPriorityAlignment,
  validateAction,
  validateChoiceOption,
  evaluateRequirements,
} from './engine/validation.ts';

export {
  advanceMultiStageChoice,
  beginMultiStageChoice,
  createInitialStrategicState,
  executeStrategicAction,
  presentActiveChoiceStage,
} from './engine/strategic-gameplay-engine.ts';

export {
  MULTI_STAGE_CHOICE_CATALOG,
  STRATEGIC_ACTION_CATALOG,
  getStrategicAction,
  listStrategicActions,
} from './catalog/strategic-action-catalog.ts';

export { createMemoryStrategicContracts } from './adapters/memory-contracts.ts';

export const AGENT_01_MODULE_ID = 'operation-10m/agent-01-strategic-gameplay';
export {
  applySynergyApprovalBoost,
  canExecuteAfterCooldown,
  detectStrategicSynergies,
  startActionCooldown,
  synergyScoreBonus,
} from './engine/strategic-synergies.ts';

export {
  deserializeStrategicGameplayState,
  mergeStrategicSaveIntoState,
  serializeStrategicGameplayState,
} from './engine/strategic-save.ts';

export {
  mitigateNextPendingTradeOff,
  summarizePendingTradeOffLoad,
} from './engine/tradeoff-mitigation.ts';

export {
  advanceMandateOnAction,
  createEmptyMandateProgress,
  mandateRankingBonus,
  summarizeMandateProgress,
} from './engine/strategic-mandate.ts';

export {
  applyStakeholderReaction,
  createDefaultStakeholderSentiment,
  listStakeholderWarnings,
  stakeholderApprovalPenalty,
  stakeholderOppositionIssues,
} from './engine/stakeholder-coalition.ts';

export { buildTurnStrategicBriefing } from './engine/turn-briefing.ts';

export {
  computeCoalitionBalanceIndex,
  coalitionBalanceRankingBonus,
  coalitionRecoveryRankingBonus,
  sustainedRecoveryRankingBonus,
  stabilizationRankingBonus,
  lockInRankingBonus,
  crossModuleSyncRankingBonus,
  integratedMaturityRankingBonus,
  stewardshipRankingBonus,
  anchoredGovernanceRankingBonus,
  institutionalPermanenceRankingBonus,
  generationalContinuityRankingBonus,
  civilizationalEnduranceRankingBonus,
  transcendentLegacyRankingBonus,
  sovereignContinuumRankingBonus,
  eternalAscendanceRankingBonus,
  infinitePersistenceRankingBonus,
  primordialContinuityRankingBonus,
  absoluteSanctityRankingBonus,
  universalImmortalityRankingBonus,
  cosmicPerpetuityRankingBonus,
  galacticInfinityRankingBonus,
  stellarTranscendenceRankingBonus,
} from './engine/coalition-balance.ts';

export {
  applyMandateIdleDrift,
  classifyMandateDriftRisk,
  touchLastAlignedActionDay,
} from './engine/mandate-idle-drift.ts';

export { mandateMilestoneIssues } from './engine/mandate-gates.ts';

export {
  advanceStrategicGameplayCalendar,
  applyPassiveStakeholderReversion,
} from './engine/strategic-calendar.ts';

export {
  classifyCoalitionCrisisLevel,
  advanceCoalitionCrisisStreak,
  resetCoalitionCrisisStreak,
} from './engine/coalition-crisis.ts';

export {
  PROLONGED_COALITION_CRISIS_THRESHOLD,
  isProlongedCoalitionCrisis,
  applyProlongedCrisisMandatePressure,
} from './engine/coalition-crisis-pressure.ts';

export {
  SUSTAINED_COALITION_RECOVERY_THRESHOLD,
  isSustainedCoalitionRecovery,
  applySustainedRecoveryMandateBonus,
} from './engine/coalition-recovery-pressure.ts';

export {
  coalitionCrisisStreakIssues,
  coalitionRecoveryStreakIssues,
} from './engine/coalition-crisis-gates.ts';

export { coalitionVolatilityIssues } from './engine/coalition-volatility-gates.ts';

export {
  advanceCoalitionRecoveryStreak,
  resetCoalitionRecoveryStreak,
} from './engine/coalition-recovery.ts';

export {
  ELEVATED_COALITION_VOLATILITY_THRESHOLD,
  isElevatedCoalitionVolatility,
  applyElevatedVolatilityMandateDrag,
} from './engine/coalition-volatility-pressure.ts';

export { coalitionStabilizationStreakIssues } from './engine/coalition-stabilization-gates.ts';

export {
  COALITION_STABILIZATION_STREAK_THRESHOLD,
  advanceCoalitionStabilizationStreak,
  resetCoalitionStabilizationStreak,
  isCoalitionStabilizationReady,
} from './engine/coalition-stabilization.ts';

export {
  resetCoalitionVolatilityEvents,
  incrementCoalitionVolatilityEvents,
  decrementCoalitionVolatilityEvents,
} from './engine/coalition-volatility.ts';

export {
  POST_STABILIZATION_LOCK_IN_THRESHOLD,
  advanceCoalitionLockInStreak,
  resetCoalitionLockInStreak,
  isPostStabilizationLockIn,
} from './engine/coalition-lock-in.ts';

export {
  coalitionLockInStreakIssues,
  coalitionVolatilityCapIssues,
} from './engine/coalition-lock-in-gates.ts';

export { crossModuleSyncStreakIssues } from './engine/cross-module-sync-gates.ts';

export {
  buildExternalCoalitionTurnSignals,
  normalizeExternalCoalitionTurnSignals,
} from './integrations/external-coalition-turn-signals.ts';
export type { ExternalCoalitionTurnSignals } from './integrations/external-coalition-turn-signals.ts';

export {
  normalizeStrategicCrossModuleInbound,
  crossModuleStabilizationAligned,
  advanceCrossModuleSyncStreak,
  resetCrossModuleSyncStreak,
} from './integrations/strategic-cross-module-hooks.ts';
export type { StrategicCrossModuleInbound } from './integrations/strategic-cross-module-hooks.ts';

export { integratedCoalitionMaturityStreakIssues } from './engine/coalition-integrated-maturity-gates.ts';

export {
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  INTEGRATED_CROSS_MODULE_SYNC_MIN,
  advanceIntegratedCoalitionMaturityStreak,
  resetIntegratedCoalitionMaturityStreak,
  isIntegratedCoalitionMaturity,
  applyIntegratedCoalitionMandateBonus,
} from './engine/coalition-integrated-maturity.ts';

export { coalitionStewardshipStreakIssues } from './engine/coalition-stewardship-gates.ts';

export {
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  advanceCoalitionStewardshipStreak,
  resetCoalitionStewardshipStreak,
  isSustainedIntegratedCoalitionStewardship,
  applyStewardshipStakeholderCalm,
} from './engine/coalition-stewardship.ts';

export { coalitionAnchoredGovernanceStreakIssues } from './engine/coalition-anchored-governance-gates.ts';

export {
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  advanceCoalitionAnchoredGovernanceStreak,
  resetCoalitionAnchoredGovernanceStreak,
  isAnchoredCoalitionGovernance,
  applyAnchoredGovernanceMandateBonus,
} from './engine/coalition-anchored-governance.ts';

export { coalitionInstitutionalPermanenceStreakIssues } from './engine/coalition-institutional-permanence-gates.ts';

export {
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  advanceCoalitionInstitutionalPermanenceStreak,
  resetCoalitionInstitutionalPermanenceStreak,
  isInstitutionalCoalitionPermanence,
  applyInstitutionalPermanenceMandateBonus,
} from './engine/coalition-institutional-permanence.ts';

export { coalitionGenerationalContinuityStreakIssues } from './engine/coalition-generational-continuity-gates.ts';

export {
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  advanceCoalitionGenerationalContinuityStreak,
  resetCoalitionGenerationalContinuityStreak,
  isGenerationalCoalitionContinuity,
  applyGenerationalContinuityMandateBonus,
} from './engine/coalition-generational-continuity.ts';

export { coalitionCivilizationalEnduranceStreakIssues } from './engine/coalition-civilizational-endurance-gates.ts';

export {
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  advanceCoalitionCivilizationalEnduranceStreak,
  resetCoalitionCivilizationalEnduranceStreak,
  isCivilizationalCoalitionEndurance,
  applyCivilizationalEnduranceMandateBonus,
} from './engine/coalition-civilizational-endurance.ts';

export { coalitionTranscendentLegacyStreakIssues } from './engine/coalition-transcendent-legacy-gates.ts';

export {
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  advanceCoalitionTranscendentLegacyStreak,
  resetCoalitionTranscendentLegacyStreak,
  isTranscendentCoalitionLegacy,
  applyTranscendentLegacyMandateBonus,
} from './engine/coalition-transcendent-legacy.ts';

export { coalitionSovereignContinuumStreakIssues } from './engine/coalition-sovereign-continuum-gates.ts';

export {
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  advanceCoalitionSovereignContinuumStreak,
  resetCoalitionSovereignContinuumStreak,
  isSovereignCoalitionContinuum,
  applySovereignContinuumMandateBonus,
} from './engine/coalition-sovereign-continuum.ts';

export { coalitionEternalAscendanceStreakIssues } from './engine/coalition-eternal-ascendance-gates.ts';

export {
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  advanceCoalitionEternalAscendanceStreak,
  resetCoalitionEternalAscendanceStreak,
  isEternalCoalitionAscendance,
  applyEternalAscendanceMandateBonus,
} from './engine/coalition-eternal-ascendance.ts';

export { coalitionInfinitePersistenceStreakIssues } from './engine/coalition-infinite-persistence-gates.ts';

export {
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  advanceCoalitionInfinitePersistenceStreak,
  resetCoalitionInfinitePersistenceStreak,
  isInfiniteCoalitionPersistence,
  applyInfinitePersistenceMandateBonus,
} from './engine/coalition-infinite-persistence.ts';

export { coalitionPrimordialContinuityStreakIssues } from './engine/coalition-primordial-continuity-gates.ts';

export {
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  advanceCoalitionPrimordialContinuityStreak,
  resetCoalitionPrimordialContinuityStreak,
  isPrimordialCoalitionContinuity,
  applyPrimordialContinuityMandateBonus,
} from './engine/coalition-primordial-continuity.ts';

export { coalitionAbsoluteSanctityStreakIssues } from './engine/coalition-absolute-sanctity-gates.ts';

export {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
  advanceCoalitionAbsoluteSanctityStreak,
  resetCoalitionAbsoluteSanctityStreak,
  isAbsoluteCoalitionSanctity,
  applyAbsoluteSanctityMandateBonus,
} from './engine/coalition-absolute-sanctity.ts';

export { coalitionUniversalImmortalityStreakIssues } from './engine/coalition-universal-immortality-gates.ts';

export {
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  advanceCoalitionUniversalImmortalityStreak,
  resetCoalitionUniversalImmortalityStreak,
  isUniversalCoalitionImmortality,
  applyUniversalImmortalityMandateBonus,
} from './engine/coalition-universal-immortality.ts';

export { coalitionCosmicPerpetuityStreakIssues } from './engine/coalition-cosmic-perpetuity-gates.ts';

export {
  COSMIC_COALITION_PERPETUITY_THRESHOLD,
  advanceCoalitionCosmicPerpetuityStreak,
  resetCoalitionCosmicPerpetuityStreak,
  isCosmicCoalitionPerpetuity,
  applyCosmicPerpetuityMandateBonus,
} from './engine/coalition-cosmic-perpetuity.ts';

export { coalitionGalacticInfinityStreakIssues } from './engine/coalition-galactic-infinity-gates.ts';

export {
  GALACTIC_COALITION_INFINITY_THRESHOLD,
  advanceCoalitionGalacticInfinityStreak,
  resetCoalitionGalacticInfinityStreak,
  isGalacticCoalitionInfinity,
  applyGalacticInfinityMandateBonus,
} from './engine/coalition-galactic-infinity.ts';

export { coalitionStellarTranscendenceStreakIssues } from './engine/coalition-stellar-transcendence-gates.ts';

export {
  STELLAR_COALITION_TRANSCENDENCE_THRESHOLD,
  advanceCoalitionStellarTranscendenceStreak,
  resetCoalitionStellarTranscendenceStreak,
  isStellarCoalitionTranscendence,
  applyStellarTranscendenceMandateBonus,
} from './engine/coalition-stellar-transcendence.ts';

export { coalitionBalanceIssues } from './engine/coalition-gates.ts';

export const AGENT_01_MODULE_VERSION = '3.6.0';
