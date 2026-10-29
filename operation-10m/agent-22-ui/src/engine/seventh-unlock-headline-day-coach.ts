import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildCoachHeadline } from './unlock-hint-formatter.js';

export interface SeventhUnlockHeadlineDayCoach {
  panelId: string | null;
  coachCopy: string | null;
}

export function buildSeventhUnlockHeadlineDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): SeventhUnlockHeadlineDayCoach {
  const panelId = input.newlyUnlockedPanelIds[6];
  if (!panelId) {
    return { panelId: null, coachCopy: null };
  }
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return { panelId, coachCopy: null };
  }
  return {
    panelId,
    coachCopy: `Day ${input.nextGameDay}: Seventh unlock today — ${buildCoachHeadline(panel, input.signals)}`,
  };
}
