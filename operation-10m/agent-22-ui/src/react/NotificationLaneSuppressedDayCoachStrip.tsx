import React from 'react';
import type { NotificationLaneSuppressedDayCoach } from '../engine/notification-lane-suppressed-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function NotificationLaneSuppressedDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: NotificationLaneSuppressedDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="notification-lane-suppressed-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-blue-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
