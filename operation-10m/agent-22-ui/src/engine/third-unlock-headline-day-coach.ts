import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildCoachHeadline } from './unlock-hint-formatter.js';

export interface ThirdUnlockHeadlineDayCoach {
  panelId: string | null;
  coachCopy: string | null;
}

export function buildThirdUnlockHeadlineDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): ThirdUnlockHeadlineDayCoach {
  const panelId = input.newlyUnlockedPanelIds[2];
  if (!panelId) {
    return { panelId: null, coachCopy: null };
  }
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return { panelId, coachCopy: null };
  }
  return {
    panelId,
    coachCopy: `Day ${input.nextGameDay}: Third unlock today — ${buildCoachHeadline(panel, input.signals)}`,
  };
}
