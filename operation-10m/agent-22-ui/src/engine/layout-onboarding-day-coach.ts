import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import {
  buildLayoutOnboardingVisibilityHints,
  layoutOnboardingCoachCopy,
} from './layout-onboarding-visibility.js';

export interface LayoutOnboardingDayCoach {
  layoutBlockedHighlightCount: number;
  coachCopy: string | null;
}

export function buildLayoutOnboardingDayCoach(input: {
  panelIds: string[];
  layoutPreset: V94LayoutPreset | undefined;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): LayoutOnboardingDayCoach {
  const hints = buildLayoutOnboardingVisibilityHints({
    panelIds: input.panelIds,
    layoutPreset: input.layoutPreset,
    signals: input.signals,
    policy: input.policy,
    persisted: input.persisted,
  });
  const layoutBlockedHighlightCount = hints.filter(h => h.onboardingHighlight && h.layoutBlocked).length;
  const base = layoutOnboardingCoachCopy(hints);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    layoutBlockedHighlightCount,
    coachCopy,
  };
}
