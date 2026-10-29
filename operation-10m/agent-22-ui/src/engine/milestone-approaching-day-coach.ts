import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { listMilestonesApproaching } from './progression-coach.js';

export interface MilestoneApproachingDayCoach {
  approachingCount: number;
  coachCopy: string | null;
}

export function buildMilestoneApproachingDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
  limit?: number;
}): MilestoneApproachingDayCoach {
  const milestones = listMilestonesApproaching(input.signals, input.limit ?? 2);
  if (!milestones.length) {
    return { approachingCount: 0, coachCopy: null };
  }
  const next = milestones[0];
  const coachCopy = `Day ${input.nextGameDay}: Milestone nearing — ${next.title}. ${next.coachCopy}`;
  return {
    approachingCount: milestones.length,
    coachCopy,
  };
}
