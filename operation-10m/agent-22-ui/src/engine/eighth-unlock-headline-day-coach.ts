import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildCoachHeadline } from './unlock-hint-formatter.js';

export interface EighthUnlockHeadlineDayCoach {
  panelId: string | null;
  coachCopy: string | null;
}

export function buildEighthUnlockHeadlineDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): EighthUnlockHeadlineDayCoach {
  const panelId = input.newlyUnlockedPanelIds[7];
  if (!panelId) {
    return { panelId: null, coachCopy: null };
  }
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return { panelId, coachCopy: null };
  }
  return {
    panelId,
    coachCopy: `Day ${input.nextGameDay}: Eighth unlock today — ${buildCoachHeadline(panel, input.signals)}`,
  };
}
