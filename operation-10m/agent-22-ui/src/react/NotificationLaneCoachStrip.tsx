import React from 'react';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  buildNotificationLaneCoachPlan,
  countActiveNotificationLanes,
} from '../engine/notification-lane-coach-plan.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface NotificationLaneCoachStripProps {
  signals: ProgressionSignalSnapshot;
  onboardingEnabled?: boolean;
  accessibility: AccessibilitySettingsSnapshot;
}

export function NotificationLaneCoachStrip({
  signals,
  onboardingEnabled = true,
  accessibility,
}: NotificationLaneCoachStripProps): React.ReactElement | null {
  const plan = buildNotificationLaneCoachPlan(signals, onboardingEnabled);
  if (!plan.coachCopy) return null;

  return (
    <div
      data-testid="notification-lane-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-blue-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-active-lanes={countActiveNotificationLanes(signals, onboardingEnabled)}
    >
      {plan.coachCopy}
    </div>
  );
}
