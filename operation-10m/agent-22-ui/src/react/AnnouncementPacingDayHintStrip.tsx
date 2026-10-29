import React from 'react';
import type { AnnouncementPacingDayHint } from '../engine/announcement-pacing-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AnnouncementPacingDayHintStrip({
  hint,
  accessibility,
}: {
  hint: AnnouncementPacingDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!hint.coachCopy) return null;
  return (
    <div
      data-testid="announcement-pacing-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {hint.coachCopy}
    </div>
  );
}
