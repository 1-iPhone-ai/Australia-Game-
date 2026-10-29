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

export const AGENT_01_MODULE_VERSION = '1.3.0';
