import React from 'react';
import type { SessionResumeDayAdvanceCoach } from '../engine/session-resume-day-advance-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface SessionResumeDayAdvanceCoachStripProps {
  coach: SessionResumeDayAdvanceCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function SessionResumeDayAdvanceCoachStrip({
  coach,
  accessibility,
}: SessionResumeDayAdvanceCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="session-resume-day-advance-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-nav-target={coach.navTarget ?? undefined}
    >
      {coach.coachCopy}
    </div>
  );
}
