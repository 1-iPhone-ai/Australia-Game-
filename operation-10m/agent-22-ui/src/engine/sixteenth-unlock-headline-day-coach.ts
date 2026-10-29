import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildCoachHeadline } from './unlock-hint-formatter.js';

export interface SixteenthUnlockHeadlineDayCoach {
  panelId: string | null;
  coachCopy: string | null;
}

export function buildSixteenthUnlockHeadlineDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): SixteenthUnlockHeadlineDayCoach {
  const panelId = input.newlyUnlockedPanelIds[15];
  if (!panelId) {
    return { panelId: null, coachCopy: null };
  }
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return { panelId, coachCopy: null };
  }
  return {
    panelId,
    coachCopy: `Day ${input.nextGameDay}: Sixteenth unlock today — ${buildCoachHeadline(panel, input.signals)}`,
  };
}
