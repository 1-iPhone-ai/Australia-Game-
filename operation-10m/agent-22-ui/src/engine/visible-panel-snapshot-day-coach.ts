export interface VisiblePanelSnapshotDayCoach {
  visibleCount: number;
  totalPanels: number;
  coachCopy: string | null;
}

export function buildVisiblePanelSnapshotDayCoach(input: {
  visiblePanelCount: number;
  totalPanelCount: number;
  nextGameDay: number;
}): VisiblePanelSnapshotDayCoach {
  if (input.nextGameDay > 12 || input.visiblePanelCount === 0) {
    return {
      visibleCount: input.visiblePanelCount,
      totalPanels: input.totalPanelCount,
      coachCopy: null,
    };
  }
  return {
    visibleCount: input.visiblePanelCount,
    totalPanels: input.totalPanelCount,
    coachCopy: `Day ${input.nextGameDay}: ${input.visiblePanelCount} of ${input.totalPanelCount} evolving UI panels are visible today.`,
  };
}
