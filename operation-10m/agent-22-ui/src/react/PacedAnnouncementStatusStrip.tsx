import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { pacingStatusCopy } from '../engine/paced-announcement-scheduler.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface PacedAnnouncementStatusStripProps {
  deferredCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PacedAnnouncementStatusStrip({
  deferredCount,
  accessibility,
}: PacedAnnouncementStatusStripProps): React.ReactElement | null {
  const copy = pacingStatusCopy(deferredCount);
  if (!copy) return null;

  return (
    <div
      data-testid="paced-announcement-status-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
