import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';

export interface ShowAllOverrideActiveDayCoach {
  overrideActive: boolean;
  coachCopy: string | null;
}

export function buildShowAllOverrideActiveDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ShowAllOverrideActiveDayCoach {
  const overrideActive =
    input.persisted.showAllPanelsOverride === true || input.policy.showAllPanelsOverride === true;
  if (!overrideActive) {
    return { overrideActive: false, coachCopy: null };
  }
  return {
    overrideActive: true,
    coachCopy: `Day ${input.nextGameDay}: Show-all panels override is active — previews stay visible for exploration.`,
  };
}
