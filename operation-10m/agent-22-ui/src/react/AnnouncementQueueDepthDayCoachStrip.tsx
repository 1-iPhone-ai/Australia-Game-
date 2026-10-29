import React from 'react';
import type { AnnouncementQueueDepthDayCoach } from '../engine/announcement-queue-depth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AnnouncementQueueDepthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: AnnouncementQueueDepthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="announcement-queue-depth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-blue-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
