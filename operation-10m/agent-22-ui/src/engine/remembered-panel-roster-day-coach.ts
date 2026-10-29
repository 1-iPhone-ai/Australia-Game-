import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface RememberedPanelRosterDayCoach {
  rememberedCount: number;
  coachCopy: string | null;
}

export function buildRememberedPanelRosterDayCoach(input: {
  rememberedPanelIds: string[];
  nextGameDay: number;
}): RememberedPanelRosterDayCoach {
  const ids = input.rememberedPanelIds;
  if (!ids.length) {
    return { rememberedCount: 0, coachCopy: null };
  }
  const labels = ids
    .slice(0, 2)
    .map(id => EVOLVING_UI_PANEL_BY_ID[id]?.label ?? id)
    .join(', ');
  const extra = ids.length > 2 ? ` (+${ids.length - 2} more)` : '';
  return {
    rememberedCount: ids.length,
    coachCopy: `Day ${input.nextGameDay}: ${ids.length} panels remembered for quick return (${labels}${extra}).`,
  };
}
