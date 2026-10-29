import React from 'react';
import type { DeferredAnnouncementFlushDayHint } from '../engine/deferred-announcement-flush-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function DeferredAnnouncementFlushDayHintStrip({
  hint,
  accessibility,
}: {
  hint: DeferredAnnouncementFlushDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!hint.coachCopy) return null;
  return (
    <div
      data-testid="deferred-flush-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-stone-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {hint.coachCopy}
    </div>
  );
}
