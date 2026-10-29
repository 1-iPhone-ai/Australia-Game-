import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';

export interface FocusSessionSnoozeDayHint {
  snoozeActive: boolean;
  snoozeEndsToday: boolean;
  coachCopy: string | null;
}

export function buildFocusSessionSnoozeDayHint(
  persisted: EvolvingUiPersistedState,
  gameDay: number
): FocusSessionSnoozeDayHint {
  const untilDay = persisted.focusSessionSnoozedUntilDay;
  const snoozeActive = untilDay != null && gameDay < untilDay;
  const snoozeEndsToday = untilDay != null && gameDay + 1 === untilDay && snoozeActive;

  let coachCopy: string | null = null;
  if (snoozeEndsToday) {
    coachCopy = 'Focus session snooze ends tomorrow — launcher suppression may return on busy days.';
  } else if (snoozeActive && untilDay != null) {
    const remaining = Math.max(0, untilDay - gameDay);
    coachCopy =
      remaining === 1
        ? 'Focus session snooze active for the rest of today.'
        : `Focus session snooze active for ${remaining} more days.`;
  } else if (!snoozeActive && untilDay != null && gameDay === untilDay) {
    coachCopy = 'Focus session snooze ended today — focus mode may activate when coverage is low.';
  }

  return {
    snoozeActive,
    snoozeEndsToday,
    coachCopy,
  };
}
