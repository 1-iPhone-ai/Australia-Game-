import type { NationalPriorityAlignmentBand } from '../types/national-priority.ts';
import type {
  StrategicActionDefinition,
  StrategicActionJournalEntry,
  StrategicGameplayState,
} from '../types/strategic-action.ts';

export const DEFAULT_MAX_PENDING_TRADE_OFFS = 8;

export function computeCommitmentPressure(state: StrategicGameplayState): number {
  const pendingWeight = state.pendingDelayed.length * 12;
  const journalWeight = Math.min(state.journal.length, 10) * 3;
  return pendingWeight + journalWeight;
}

export function appendJournalEntry(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  alignmentBand: NationalPriorityAlignmentBand | null,
  scheduledTradeOffCount: number,
): StrategicGameplayState {
  const entry: StrategicActionJournalEntry = {
    day: state.day,
    actionId: action.id,
    title: action.title,
    alignmentBand,
    scheduledTradeOffCount,
  };
  return {
    ...state,
    journal: [...state.journal, entry].slice(-50),
  };
}

export function actionAlreadyCompleted(
  state: StrategicGameplayState,
  actionId: string,
): boolean {
  return state.completedActionIds.includes(actionId);
}

export function pendingTradeOffCount(state: StrategicGameplayState): number {
  return state.pendingDelayed.length;
}
