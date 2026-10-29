import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { tierFromInterfaceLevel } from '../types/progression.js';

export type NotificationLaneCategory =
  | 'critical'
  | 'important'
  | 'activity'
  | 'update'
  | 'coach'
  | 'automation';

export interface NotificationLaneProgressionRule {
  category: NotificationLaneCategory;
  minTier: number;
  minDay?: number;
  description: string;
}

export const NOTIFICATION_LANE_PROGRESSION: NotificationLaneProgressionRule[] = [
  { category: 'critical', minTier: 0, description: 'Always shown — safety and bankruptcy.' },
  { category: 'important', minTier: 0, minDay: 1, description: 'Standing shifts and deadlines from day 1.' },
  { category: 'activity', minTier: 1, minDay: 2, description: 'Routine activity feed after onboarding.' },
  { category: 'update', minTier: 2, minDay: 3, description: 'Market and price updates when economy panels unlock.' },
  { category: 'coach', minTier: 1, minDay: 1, description: 'Guided coaching lane when onboarding enabled.' },
  { category: 'automation', minTier: 3, minDay: 6, description: 'Auto-mode and co-pilot notices for advanced players.' },
];

export function shouldShowNotificationLaneCategory(
  category: NotificationLaneCategory,
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): boolean {
  const rule = NOTIFICATION_LANE_PROGRESSION.find(r => r.category === category);
  if (!rule) return true;
  if (category === 'coach' && !onboardingEnabled) return false;
  const tier = tierFromInterfaceLevel(signals.interfaceLevel);
  if (tier < rule.minTier) return false;
  if (rule.minDay != null && signals.gameDay < rule.minDay) return false;
  return true;
}

export function listSuppressedNotificationCategories(
  signals: ProgressionSignalSnapshot,
  onboardingEnabled = true
): NotificationLaneCategory[] {
  return NOTIFICATION_LANE_PROGRESSION.filter(
    r => !shouldShowNotificationLaneCategory(r.category, signals, onboardingEnabled)
  ).map(r => r.category);
}
