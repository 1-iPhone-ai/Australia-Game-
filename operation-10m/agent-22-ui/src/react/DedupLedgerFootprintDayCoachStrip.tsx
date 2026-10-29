import React from 'react';
import type { DedupLedgerFootprintDayCoach } from '../engine/dedup-ledger-footprint-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function DedupLedgerFootprintDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: DedupLedgerFootprintDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="dedup-ledger-footprint-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
