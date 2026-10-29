import React from 'react';
import type { ContextualQuickActionDayCoach } from '../engine/contextual-quick-action-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ContextualQuickActionDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ContextualQuickActionDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="contextual-quick-action-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
