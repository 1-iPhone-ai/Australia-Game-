export interface LegacyNavPatchCoverageDayCoach {
  patchCoverageCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavPatchCoverageDayCoach(input: {
  patchCoverageCount: number;
  nextGameDay: number;
}): LegacyNavPatchCoverageDayCoach {
  if (input.patchCoverageCount <= 0 || input.nextGameDay > 14) {
    return { patchCoverageCount: input.patchCoverageCount, coachCopy: null };
  }
  const noun = input.patchCoverageCount === 1 ? 'target' : 'targets';
  return {
    patchCoverageCount: input.patchCoverageCount,
    coachCopy: `Day ${input.nextGameDay}: Legacy navigation audit covers ${input.patchCoverageCount} patch ${noun} still hidden by progression.`,
  };
}
