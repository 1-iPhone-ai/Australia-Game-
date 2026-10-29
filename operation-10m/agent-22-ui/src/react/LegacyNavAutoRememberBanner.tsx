import React from 'react';
import type { LegacyNavAutoRememberPlan } from '../engine/legacy-nav-auto-remember-bridge.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface LegacyNavAutoRememberBannerProps {
  plan: LegacyNavAutoRememberPlan;
  applied: boolean;
  rememberedCount: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function LegacyNavAutoRememberBanner({
  plan,
  applied,
  rememberedCount,
  accessibility,
}: LegacyNavAutoRememberBannerProps): React.ReactElement | null {
  if (!plan.coachCopy && !applied) return null;

  return (
    <div
      data-testid="legacy-nav-auto-remember"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-applied={applied ? 'true' : 'false'}
      data-count={rememberedCount}
    >
      {applied
        ? `Remembered ${rememberedCount} legacy nav panels.`
        : plan.coachCopy}
    </div>
  );
}
