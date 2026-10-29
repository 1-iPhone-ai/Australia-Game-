import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildCoachHeadline } from './unlock-hint-formatter.js';

export interface PanelUnlockHeadlineDayCoach {
  unlockCount: number;
  headlinePanelId: string | null;
  coachCopy: string | null;
}

export function buildPanelUnlockHeadlineDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): PanelUnlockHeadlineDayCoach {
  if (!input.newlyUnlockedPanelIds.length) {
    return { unlockCount: 0, headlinePanelId: null, coachCopy: null };
  }
  const headlinePanelId = input.newlyUnlockedPanelIds[0] ?? null;
  const panel = headlinePanelId ? EVOLVING_UI_PANEL_BY_ID[headlinePanelId] : undefined;
  if (!panel) {
    return {
      unlockCount: input.newlyUnlockedPanelIds.length,
      headlinePanelId,
      coachCopy: null,
    };
  }
  const coachCopy = `Day ${input.nextGameDay}: ${buildCoachHeadline(panel, input.signals)}`;
  return {
    unlockCount: input.newlyUnlockedPanelIds.length,
    headlinePanelId,
    coachCopy,
  };
}
