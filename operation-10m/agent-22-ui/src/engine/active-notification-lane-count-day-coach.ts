import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { countActiveNotificationLanes } from './notification-lane-coach-plan.js';
import { NOTIFICATION_LANE_PROGRESSION } from './notification-lane-progression.js';

export interface ActiveNotificationLaneCountDayCoach {
  activeCount: number;
  totalLanes: number;
  coachCopy: string | null;
}

export function buildActiveNotificationLaneCountDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
  onboardingEnabled?: boolean;
}): ActiveNotificationLaneCountDayCoach {
  const totalLanes = NOTIFICATION_LANE_PROGRESSION.length;
  const activeCount = countActiveNotificationLanes(
    input.signals,
    input.onboardingEnabled !== false
  );
  if (activeCount >= totalLanes || activeCount === 0) {
    return { activeCount, totalLanes, coachCopy: null };
  }
  return {
    activeCount,
    totalLanes,
    coachCopy: `Day ${input.nextGameDay}: ${activeCount} of ${totalLanes} notification lanes are live; others stay gated by progression.`,
  };
}
