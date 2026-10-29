import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  listSuppressedNotificationCategories,
  NOTIFICATION_LANE_PROGRESSION,
  shouldShowNotificationLaneCategory,
  type NotificationLaneCategory,
} from './notification-lane-progression.js';

export interface NotificationLaneCoachPlan {
  activeCategories: NotificationLaneCategory[];
  suppressedCategories: NotificationLaneCategory[];
  coachCopy: string | null;
}

export function buildNotificationLaneCoachPlan(
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): NotificationLaneCoachPlan {
  const suppressedCategories = listSuppressedNotificationCategories(signals, onboardingEnabled);
  const suppressedSet = new Set(suppressedCategories);
  const activeCategories = NOTIFICATION_LANE_PROGRESSION.map(r => r.category).filter(
    c => !suppressedSet.has(c)
  );

  let coachCopy: string | null = null;
  if (suppressedCategories.length >= 3) {
    coachCopy = `${suppressedCategories.length} notification lanes are gated until progression catches up.`;
  } else if (suppressedCategories.includes('automation')) {
    coachCopy = 'Automation notices stay quiet until advanced assistance unlocks.';
  } else if (suppressedCategories.includes('activity')) {
    coachCopy = 'Activity feed lanes unlock after the first travel day.';
  }

  return { activeCategories, suppressedCategories, coachCopy };
}

export function notificationLaneStatusLine(category: NotificationLaneCategory, active: boolean): string {
  const rule = NOTIFICATION_LANE_PROGRESSION.find(r => r.category === category);
  return active ? `${category}: on` : `${category}: gated — ${rule?.description ?? 'locked'}`;
}

export function countActiveNotificationLanes(
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): number {
  return NOTIFICATION_LANE_PROGRESSION.filter(r =>
    shouldShowNotificationLaneCategory(r.category, signals, onboardingEnabled)
  ).length;
}
