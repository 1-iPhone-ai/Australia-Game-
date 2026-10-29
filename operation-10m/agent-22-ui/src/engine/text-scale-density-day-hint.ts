import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import { assessTextScaleReadability } from './text-scale-readability-coach.js';

export interface TextScaleDensityDayHint {
  activeDensity: ReturnType<typeof resolveUiDensityProfile>['tier'];
  coachCopy: string | null;
  shouldSuggestDensityChange: boolean;
}

export function buildTextScaleDensityDayHint(input: {
  signals: ProgressionSignalSnapshot;
  accessibility: AccessibilitySettingsSnapshot;
  preferredDensity?: 'compact' | 'comfortable' | 'spacious' | null;
}): TextScaleDensityDayHint {
  const profile = resolveUiDensityProfile({
    interfaceLevel: input.signals.interfaceLevel,
    preferredTier: input.preferredDensity ?? null,
    textScaleMultiplier: input.accessibility.textScaleMultiplier,
  });

  const assessment = assessTextScaleReadability({
    accessibility: input.accessibility,
    activeDensity: profile.tier,
  });

  let coachCopy = assessment.coachCopy;
  if (!coachCopy && input.signals.gameDay <= 2 && assessment.needsSpaciousDensity) {
    coachCopy = 'Early sessions with large text benefit from comfortable or spacious density.';
  }

  const shouldSuggestDensityChange =
    Boolean(coachCopy) && assessment.recommendedDensity !== profile.tier;

  return {
    activeDensity: profile.tier,
    coachCopy,
    shouldSuggestDensityChange,
  };
}
