import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface NewlyUnlockedBatchDayCoach {
  unlockCount: number;
  coachCopy: string | null;
}

export function buildNewlyUnlockedBatchDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  nextGameDay: number;
}): NewlyUnlockedBatchDayCoach {
  const unlockCount = input.newlyUnlockedPanelIds.length;
  if (unlockCount <= 1) {
    return { unlockCount, coachCopy: null };
  }
  const labels = input.newlyUnlockedPanelIds
    .slice(0, 3)
    .map(id => EVOLVING_UI_PANEL_BY_ID[id]?.label ?? id)
    .join(', ');
  const coachCopy = `Day ${input.nextGameDay}: ${unlockCount} panels unlocked (${labels}${unlockCount > 3 ? '…' : ''}) — scan the nav rail.`;
  return { unlockCount, coachCopy };
}
