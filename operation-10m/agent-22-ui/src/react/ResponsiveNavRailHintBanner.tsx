import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { NavRailVisibilityPlan } from '../engine/responsive-nav-rail-plan.js';
import { responsiveNavRailCoachCopy } from '../engine/responsive-nav-rail-plan.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ResponsiveNavRailHintBannerProps {
  plan: NavRailVisibilityPlan;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ResponsiveNavRailHintBanner({
  plan,
  accessibility,
}: ResponsiveNavRailHintBannerProps): React.ReactElement | null {
  const copy = responsiveNavRailCoachCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="responsive-nav-rail-hint-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
