import type { TextScaleDensityDayHint } from './text-scale-density-day-hint.js';

export interface TextScaleHintPendingDayCoach {
  pendingSuggestion: boolean;
  coachCopy: string | null;
}

export function buildTextScaleHintPendingDayCoach(input: {
  hint: TextScaleDensityDayHint;
  applied: boolean;
  nextGameDay: number;
}): TextScaleHintPendingDayCoach {
  if (input.applied || !input.hint.coachCopy) {
    return { pendingSuggestion: false, coachCopy: null };
  }
  return {
    pendingSuggestion: true,
    coachCopy: `Day ${input.nextGameDay}: ${input.hint.coachCopy}`,
  };
}
