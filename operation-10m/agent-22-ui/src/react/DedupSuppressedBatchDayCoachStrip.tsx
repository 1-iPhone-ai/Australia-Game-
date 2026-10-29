import React from 'react';
import type { DedupSuppressedBatchDayCoach } from '../engine/dedup-suppressed-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function DedupSuppressedBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: DedupSuppressedBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="dedup-suppressed-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
