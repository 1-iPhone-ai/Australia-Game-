import React from 'react';
import { dedupStatusCopy } from '../engine/announcement-dedup-ledger.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface AnnouncementDedupStatusBannerProps {
  suppressedCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function AnnouncementDedupStatusBanner({
  suppressedCount,
  accessibility,
}: AnnouncementDedupStatusBannerProps): React.ReactElement | null {
  const copy = dedupStatusCopy(suppressedCount);
  if (!copy) return null;

  return (
    <div
      data-testid="announcement-dedup-status-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
