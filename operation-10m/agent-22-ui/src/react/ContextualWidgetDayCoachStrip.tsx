import React from 'react';
import type { ContextualWidgetDayCoach } from '../engine/contextual-widget-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ContextualWidgetDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ContextualWidgetDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="contextual-widget-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
