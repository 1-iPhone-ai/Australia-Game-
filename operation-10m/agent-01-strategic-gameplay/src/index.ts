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
  coalitionCrisisStreakIssues,
  coalitionRecoveryStreakIssues,
} from './engine/coalition-crisis-gates.ts';

export {
  advanceCoalitionRecoveryStreak,
  resetCoalitionRecoveryStreak,
} from './engine/coalition-recovery.ts';

export { coalitionBalanceIssues } from './engine/coalition-gates.ts';

export const AGENT_01_MODULE_VERSION = '1.7.0';
