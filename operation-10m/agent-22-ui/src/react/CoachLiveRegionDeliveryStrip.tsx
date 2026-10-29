import React from 'react';
import type { CoachLiveRegionDeliveryPlan } from '../engine/coach-live-region-scheduler.js';
import { coachLiveRegionDeliveryCopy } from '../engine/coach-live-region-scheduler.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CoachLiveRegionDeliveryStripProps {
  plan: CoachLiveRegionDeliveryPlan;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CoachLiveRegionDeliveryStrip({
  plan,
  accessibility,
}: CoachLiveRegionDeliveryStripProps): React.ReactElement | null {
  const copy = coachLiveRegionDeliveryCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="coach-live-region-delivery-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-500/25 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
