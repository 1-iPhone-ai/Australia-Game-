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
export const AGENT_01_MODULE_VERSION = '1.0.0';
