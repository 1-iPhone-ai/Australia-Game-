import type { DayAdvanceCalmRecoveryHint } from './day-advance-calm-recovery-hint.js';

export interface CalmRecoverySuggestionDayCoach {
  suggestCalmRecovery: boolean;
  coachCopy: string | null;
}

export function buildCalmRecoverySuggestionDayCoach(input: {
  hint: DayAdvanceCalmRecoveryHint;
  nextGameDay: number;
}): CalmRecoverySuggestionDayCoach {
  if (!input.hint.suggestCalmRecovery || !input.hint.coachCopy) {
    return { suggestCalmRecovery: false, coachCopy: null };
  }
  return {
    suggestCalmRecovery: true,
    coachCopy: `Day ${input.nextGameDay}: ${input.hint.coachCopy}`,
  };
}
