import React from 'react';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import {
  auditLegacyNavTargets,
  legacyNavAuditCoachCopy,
} from '../engine/legacy-nav-audit-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface LegacyNavAuditCoachStripProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
}

export function LegacyNavAuditCoachStrip({
  signals,
  policy,
  accessibility,
}: LegacyNavAuditCoachStripProps): React.ReactElement | null {
  const entries = auditLegacyNavTargets(signals, policy);
  const copy = legacyNavAuditCoachCopy(entries);
  if (!copy) return null;

  return (
    <div
      data-testid="legacy-nav-audit-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
