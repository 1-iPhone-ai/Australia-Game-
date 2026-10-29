import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { deferredFlushStatusCopy } from '../engine/deferred-announcement-flush.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface DeferredAnnouncementFlushBannerProps {
  flushedCount: number;
  remainingCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function DeferredAnnouncementFlushBanner({
  flushedCount,
  remainingCount,
  accessibility,
}: DeferredAnnouncementFlushBannerProps): React.ReactElement | null {
  const copy = deferredFlushStatusCopy(flushedCount, remainingCount);
  if (!copy) return null;

  return (
    <div
      data-testid="deferred-announcement-flush-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
