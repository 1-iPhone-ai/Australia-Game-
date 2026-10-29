import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface TextScaleDensityAutoApplyBannerProps {
  applied: boolean;
  coachCopy: string | null;
  accessibility: AccessibilitySettingsSnapshot;
}

export function TextScaleDensityAutoApplyBanner({
  applied,
  coachCopy,
  accessibility,
}: TextScaleDensityAutoApplyBannerProps): React.ReactElement | null {
  if (!applied && !coachCopy) return null;

  return (
    <div
      data-testid="text-scale-density-auto-apply"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-applied={applied ? 'true' : 'false'}
    >
      {applied ? coachCopy ?? 'Density auto-applied for text scale.' : coachCopy}
    </div>
  );
}
