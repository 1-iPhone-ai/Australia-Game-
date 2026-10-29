import React from 'react';
import type { LegacyNavAuditDayCoach } from '../engine/legacy-nav-audit-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavAuditDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavAuditDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-audit-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
