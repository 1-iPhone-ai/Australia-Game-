import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildNotificationLaneCoachPlan } from './notification-lane-coach-plan.js';

export interface NotificationLaneDayCoach {
  activeLaneCount: number;
  coachCopy: string | null;
}

export function buildNotificationLaneDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
  onboardingEnabled?: boolean;
}): NotificationLaneDayCoach {
  const plan = buildNotificationLaneCoachPlan(input.signals, input.onboardingEnabled !== false);
  const coachCopy = plan.coachCopy ? `Day ${input.nextGameDay}: ${plan.coachCopy}` : null;

  return {
    activeLaneCount: plan.activeCategories.length,
    coachCopy,
  };
}
