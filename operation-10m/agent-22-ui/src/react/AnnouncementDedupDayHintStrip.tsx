import React from 'react';
import type { AnnouncementDedupDayHint } from '../engine/announcement-dedup-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AnnouncementDedupDayHintStrip({
  hint,
  accessibility,
}: {
  hint: AnnouncementDedupDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!hint.coachCopy) return null;
  return (
    <div
      data-testid="announcement-dedup-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-suppressed-count={hint.suppressedCount}
    >
      {hint.coachCopy}
    </div>
  );
}
