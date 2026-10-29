import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildNotificationLaneCoachPlan } from './notification-lane-coach-plan.js';

export interface NotificationLaneSuppressedDayCoach {
  suppressedCount: number;
  coachCopy: string | null;
}

export function buildNotificationLaneSuppressedDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
  onboardingEnabled?: boolean;
}): NotificationLaneSuppressedDayCoach {
  const plan = buildNotificationLaneCoachPlan(input.signals, input.onboardingEnabled !== false);
  if (!plan.suppressedCategories.length) {
    return { suppressedCount: 0, coachCopy: null };
  }
  const base = plan.coachCopy ?? `${plan.suppressedCategories.length} notification lanes gated by progression.`;
  return {
    suppressedCount: plan.suppressedCategories.length,
    coachCopy: `Day ${input.nextGameDay}: ${base}`,
  };
}
