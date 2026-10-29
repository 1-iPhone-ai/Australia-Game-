export interface MultiUnlockBatchDayCoach {
  unlockCount: number;
  coachCopy: string | null;
}

export function buildMultiUnlockBatchDayCoach(input: {
  newlyUnlockedPanelIds: string[];
  nextGameDay: number;
}): MultiUnlockBatchDayCoach {
  const count = input.newlyUnlockedPanelIds.length;
  if (count <= 1) {
    return { unlockCount: count, coachCopy: null };
  }
  return {
    unlockCount: count,
    coachCopy: `Day ${input.nextGameDay}: ${count} interface panels unlocked together — screen reader announcements may batch.`,
  };
}
