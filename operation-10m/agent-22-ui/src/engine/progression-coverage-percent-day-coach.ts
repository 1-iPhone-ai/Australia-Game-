export interface ProgressionCoveragePercentDayCoach {
  coveragePercent: number;
  coachCopy: string | null;
}

export function buildProgressionCoveragePercentDayCoach(input: {
  coverageRatio: number;
  nextGameDay: number;
  maxDay?: number;
}): ProgressionCoveragePercentDayCoach {
  const maxDay = input.maxDay ?? 12;
  if (input.nextGameDay > maxDay) {
    return { coveragePercent: Math.round(input.coverageRatio * 100), coachCopy: null };
  }
  const pct = Math.round(input.coverageRatio * 100);
  return {
    coveragePercent: pct,
    coachCopy: `Day ${input.nextGameDay}: Interface coverage is ${pct}% of registered panels.`,
  };
}
