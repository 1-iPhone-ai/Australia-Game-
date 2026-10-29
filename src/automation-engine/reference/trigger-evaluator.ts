/**
 * Reference copy of evaluateHumanAutomationTrigger (HA2) for offline contract tests.
 * Must stay aligned with `(V9.4) australia-game-with-ai.tsx`; baseline-lock.test.ts guards exports.
 */
export type RefTriggerType =
  | 'turn_start'
  | 'day_start'
  | 'cash_below_threshold'
  | 'cash_above_threshold'
  | 'manual_test_only'
  | 'day_number_at_or_above';

export interface RefTrigger {
  type: RefTriggerType;
  thresholdAmount?: number;
}

export interface RefActor {
  money: number;
}

export function evaluateTriggerReference(
  trigger: RefTrigger,
  actor: RefActor,
  isNewDayForActor: boolean,
  currentDay: number,
  currentTurn: number,
  extendedTriggersEnabled: boolean
): boolean {
  switch (trigger.type) {
    case 'turn_start':
      return true;
    case 'day_start':
      return isNewDayForActor;
    case 'cash_below_threshold':
      return actor.money < (trigger.thresholdAmount ?? 0);
    case 'cash_above_threshold':
      return actor.money > (trigger.thresholdAmount ?? 0);
    case 'day_number_at_or_above':
      return extendedTriggersEnabled ? currentDay >= (trigger.thresholdAmount ?? 0) : false;
    case 'manual_test_only':
    default:
      return false;
  }
}
