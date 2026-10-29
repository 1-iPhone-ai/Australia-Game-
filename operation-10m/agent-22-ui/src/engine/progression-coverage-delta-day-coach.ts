export interface ProgressionCoverageDeltaDayCoach {
  deltaRatio: number | null;
  coachCopy: string | null;
}

export function buildProgressionCoverageDeltaDayCoach(input: {
  previousCoverageRatio: number | undefined;
  currentCoverageRatio: number;
  nextGameDay: number;
}): ProgressionCoverageDeltaDayCoach {
  const previous = input.previousCoverageRatio;
  if (previous == null) {
    return { deltaRatio: null, coachCopy: null };
  }
  const delta = input.currentCoverageRatio - previous;
  if (Math.abs(delta) < 0.01) {
    return { deltaRatio: 0, coachCopy: null };
  }
  const pct = Math.round(Math.abs(delta) * 100);
  const base =
    delta > 0
      ? `Interface coverage increased ${pct}% since your last turn.`
      : `Interface coverage dipped ${pct}%.`;
  return {
    deltaRatio: delta,
    coachCopy: `Day ${input.nextGameDay}: ${base}`,
  };
}
