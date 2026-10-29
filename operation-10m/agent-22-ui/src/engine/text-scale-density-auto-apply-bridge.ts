import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { TextScaleDensityDayHint } from './text-scale-density-day-hint.js';
import { assessTextScaleReadability } from './text-scale-readability-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface TextScaleDensityAutoApplyResult {
  applied: boolean;
  persisted: EvolvingUiPersistedState;
  coachCopy: string | null;
}

/** Applies recommended density from a day-advance text-scale hint when host opts into auto-apply. */
export function applyTextScaleDensityFromDayHint(
  persisted: EvolvingUiPersistedState,
  hint: TextScaleDensityDayHint,
  accessibility: AccessibilitySettingsSnapshot,
  options?: { autoApply?: boolean }
): TextScaleDensityAutoApplyResult {
  const autoApply = options?.autoApply !== false;

  if (!hint.shouldSuggestDensityChange || !hint.coachCopy) {
    return { applied: false, persisted, coachCopy: hint.coachCopy };
  }

  const assessment = assessTextScaleReadability({
    accessibility,
    activeDensity: hint.activeDensity,
  });

  if (!autoApply) {
    return { applied: false, persisted, coachCopy: hint.coachCopy };
  }

  if (assessment.recommendedDensity === persisted.preferredDensity) {
    return { applied: false, persisted, coachCopy: hint.coachCopy };
  }

  const merged: EvolvingUiPersistedState = {
    ...persisted,
    preferredDensity: assessment.recommendedDensity,
  };

  return {
    applied: true,
    persisted: merged,
    coachCopy: `Applied ${assessment.recommendedDensity} density to match your text scale.`,
  };
}
