import React from 'react';
import type { PhaseShellAttentionDayCoach } from '../engine/phase-shell-attention-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PhaseShellAttentionDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PhaseShellAttentionDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="phase-shell-attention-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-fuchsia-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
