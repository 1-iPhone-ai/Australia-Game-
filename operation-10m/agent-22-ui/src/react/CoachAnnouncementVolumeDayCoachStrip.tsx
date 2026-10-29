import React from 'react';
import type { CoachAnnouncementVolumeDayCoach } from '../engine/coach-announcement-volume-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CoachAnnouncementVolumeDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CoachAnnouncementVolumeDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="coach-announcement-volume-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
