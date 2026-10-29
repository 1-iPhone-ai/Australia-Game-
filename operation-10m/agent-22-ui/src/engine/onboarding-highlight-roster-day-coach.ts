import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface OnboardingHighlightRosterDayCoach {
  highlightCount: number;
  coachCopy: string | null;
}

export function buildOnboardingHighlightRosterDayCoach(input: {
  highlightedPanelIds: string[];
  nextGameDay: number;
}): OnboardingHighlightRosterDayCoach {
  const ids = input.highlightedPanelIds;
  if (!ids.length) {
    return { highlightCount: 0, coachCopy: null };
  }
  const labels = ids
    .slice(0, 3)
    .map(id => EVOLVING_UI_PANEL_BY_ID[id]?.label ?? id)
    .join(', ');
  const extra = ids.length > 3 ? ` (+${ids.length - 3} more)` : '';
  return {
    highlightCount: ids.length,
    coachCopy: `Day ${input.nextGameDay}: Onboarding highlights ${labels}${extra}.`,
  };
}
